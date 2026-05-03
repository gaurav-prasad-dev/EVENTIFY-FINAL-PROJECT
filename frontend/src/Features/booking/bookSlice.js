import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSeatLayout,
  lockSeats,
  createBooking,
  getMyBookings,
} from "./bookingApi";

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
  async ({ showId, seats }, thunkAPI) => {
    try {
      const res = await createBooking(showId, seats);
      return res?.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Booking failed"
      );
    }
  }
);

// 📦 FETCH MY BOOKINGS
export const fetchMyBookingsThunk = createAsyncThunk(
  "booking/fetchMyBookings",
  async (_, thunkAPI) => {
    try {
      return await getMyBookings();
    } catch {
      return thunkAPI.rejectWithValue("Failed to fetch bookings");
    }
  }
);

const initialState = {
  seats: [],
  selectedSeats: [],
  booking: null,

  // ✅ NEW
  myBookings: [],
  loadingMyBookings: false,

  bookingMeta: {
    movieName: "",
    theatreName: "",
    city: "",
    showDate: "",
    showTime: "",
    poster: "",
    allShows: [],
  },

  loadingSeats: false,
  lockingSeat: false,
  creatingBooking: false,

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

    updateSeatStatus: (state, action) => {
      const { seatId, status } = action.payload;

      state.seats = state.seats.map((s) =>
        s.id === seatId ? { ...s, status } : s
      );
    },

    setBooking: (state, action) => {
      state.booking = action.payload;
    },

    setBookingMeta: (state, action) => {
      state.bookingMeta = {
        ...state.bookingMeta,
        ...action.payload,
      };
    },

    resetBooking: (state) => {
      state.seats = [];
      state.selectedSeats = [];
      state.booking = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🎬 FETCH SEATS
      .addCase(fetchSeatsThunk.pending, (state) => {
        state.loadingSeats = true;
      })
      .addCase(fetchSeatsThunk.fulfilled, (state, action) => {
        state.loadingSeats = false;
        state.seats = action.payload;
      })
      .addCase(fetchSeatsThunk.rejected, (state, action) => {
        state.loadingSeats = false;
        state.error = action.payload;
      })

      // 🔒 LOCK SEAT
      .addCase(lockSeatThunk.pending, (state) => {
        state.lockingSeat = true;
      })
      .addCase(lockSeatThunk.fulfilled, (state, action) => {
        state.lockingSeat = false;

        const seatId = action.payload;

        state.seats = state.seats.map((s) =>
          s.id === seatId ? { ...s, status: "LOCKED" } : s
        );
      })
      .addCase(lockSeatThunk.rejected, (state, action) => {
        state.lockingSeat = false;
        state.error = action.payload;

        // ✅ safety reset
        state.seats = state.seats.map((s) =>
          s.status === "LOCKED" ? { ...s, status: "AVAILABLE" } : s
        );
      })

      // 🧾 CREATE BOOKING
      .addCase(createBookingThunk.pending, (state) => {
        state.creatingBooking = true;
      })
      .addCase(createBookingThunk.fulfilled, (state, action) => {
        state.creatingBooking = false;
        state.booking = action.payload;
      })
      .addCase(createBookingThunk.rejected, (state, action) => {
        state.creatingBooking = false;
        state.error = action.payload;
      })

      // 📦 FETCH MY BOOKINGS (🔥 THIS WAS MISSING)
      .addCase(fetchMyBookingsThunk.pending, (state) => {
        state.loadingMyBookings = true;
      })
      .addCase(fetchMyBookingsThunk.fulfilled, (state, action) => {
        state.loadingMyBookings = false;
        state.myBookings = action.payload;
      })
      .addCase(fetchMyBookingsThunk.rejected, (state, action) => {
        state.loadingMyBookings = false;
        state.error = action.payload;
      });
  },
});

export const {
  selectSeat,
  removeSeat,
  resetBooking,
  setBooking,
  setBookingMeta,
  updateSeatStatus,
  clearError,
} = bookingSlice.actions;

export default bookingSlice.reducer;