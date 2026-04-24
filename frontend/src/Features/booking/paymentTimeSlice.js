import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPaymentOrder,
  verifyPayment,
} from "./paymentApi";

// 💳 CREATE ORDER
export const createOrderThunk = createAsyncThunk(
  "payment/createOrder",
  async (bookingId, thunkAPI) => {
    try {
      const res = await createPaymentOrder(bookingId);
      return res?.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Order creation failed"
      );
    }
  }
);

// 🔐 VERIFY PAYMENT
export const verifyPaymentThunk = createAsyncThunk(
  "payment/verifyPayment",
  async (data, thunkAPI) => {
    try {
      const res = await verifyPayment(data);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Payment verification failed"
      );
    }
  }
);

// 🧠 INITIAL STATE
const initialState = {
  order: null,
  loading: false,
  success: false,
  error: null,
};

// 🎯 SLICE
const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPayment: (state) => {
      state.order = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🧾 CREATE ORDER
      .addCase(createOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔐 VERIFY PAYMENT
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;

export default paymentSlice.reducer;