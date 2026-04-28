import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getSeatLayout,
  lockSeats,
  createBooking,
} from "./bookingApi"; // ✅ FIXED

// 🎬 FETCH SEATS
export const fetchSeatsThunk = createAsyncThunk(
  "booking/fetchSeats",
  async (showId, thunkAPI) => {
    try {
      const res = await getSeatLayout(showId);
    
    console.log("API RESPONSE:", res);
      return res?.seats|| [];
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
      const res = await lockSeats(showId, [seatId]);
      return seatId; // OK

    } catch {
      return thunkAPI.rejectWithValue("Seat lock failed");
    }
  }
);

// 🧾 CREATE BOOKING
export const createBookingThunk = createAsyncThunk(
  "booking/createBooking",
  async ({ showId, seats}, thunkAPI) => {
    try {
      const res = await createBooking(showId, seats);
    
console.log("CREATE BOOKING RESPONSE:", res);
      return res?.booking;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Booking failed"
      );
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

  // ✅ separate loading states
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

  // ❌ DO NOT RESET bookingMeta
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
        console.log("REDUX SEATS:", action.payload); // 👈 check here
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
          // optional safety reset (important UX fix)
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