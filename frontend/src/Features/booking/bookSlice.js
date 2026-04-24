import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSeatLayout,
  lockSeats,
  createBooking,
} from "./seatlayout";

// 🎬 FETCH SEATS
export const fetchSeatsThunk = createAsyncThunk(
  "booking/fetchSeats",
  async (showId, thunkAPI) => {
    try {
      const res = await getSeatLayout(showId);
      return res?.seats || [];
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch seats");
    }
  }
);

// 🔒 LOCK SEAT
export const lockSeatThunk = createAsyncThunk(
  "booking/lockSeat",
  async ({ showId, seatId }, thunkAPI) => {
    try {
      await lockSeats(showId, [seatId]);
      return seatId;
    } catch {
      return thunkAPI.rejectWithValue("Seat lock failed");
    }
  }
);

// 🧾 CREATE BOOKING
export const createBookingThunk = createAsyncThunk(
  "booking/createBooking",
  async ({ showId, seatIds }, thunkAPI) => {
    try {
      const res = await createBooking(showId, seatIds);
      return res?.booking;
    } catch {
      return thunkAPI.rejectWithValue("Booking failed");
    }
  }
);

const initialState = {
  seats: [],
  selectedSeats: [],
  booking: null,
  bookingMeta: {
    movieName: "",
    theatreName: "",
    city: "",
    showDate: "",
    showTime: "",
    poster: "",
    allShows: [],
  },
  loading: false,
  error: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,

  reducers: {
    selectSeat: (state, action) => {
      const seat = action.payload;
      const exists = state.selectedSeats.find((s) => s.id === seat.id);

      if (!exists) {
        state.selectedSeats.push(seat);
      }
    },

    removeSeat: (state, action) => {
      state.selectedSeats = state.selectedSeats.filter(
        (s) => s.id !== action.payload
      );
    },

    setBooking: (state, action) => { // ✅ added
      state.booking = action.payload;
    },

    setBookingMeta: (state, action) => { // ✅ added
      state.bookingMeta = action.payload;
    },

    resetBooking: (state) => {
      state.seats = [];
      state.selectedSeats = [];
      state.booking = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchSeatsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSeatsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeatsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(lockSeatThunk.fulfilled, (state, action) => {
        const seatId = action.payload;

        state.seats = state.seats.map((s) =>
          s.id === seatId ? { ...s, status: "LOCKED" } : s
        );
      })

      .addCase(createBookingThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.booking = action.payload;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectSeat,
  removeSeat,
  resetBooking,
  setBooking,      // ✅ export added
  setBookingMeta,  // ✅ export added
} = bookingSlice.actions;

export default bookingSlice.reducer;