import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPaymentOrder,
  verifyPayment,
  markPaymentFailed
} from "./paymentApi";

// 💳 CREATE ORDER
export const createOrderThunk = createAsyncThunk(
  "payment/createOrder",
  async (bookingId, thunkAPI) => {
    try {
      const res = await createPaymentOrder(bookingId);
   console.log("✅ API RESPONSE:", res);
     return res.order;
    } catch (error) {
      console.log("🔥 AXIOS ERROR:", error); // 👈 ADD
      console.log("🔥 RESPONSE:", error.response); // 👈 ADD

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

export const markPaymentFailedThunk = createAsyncThunk(
  "payment/fail",
  async (bookingId, thunkAPI) => {
    try {
      const res = await markPaymentFailed(bookingId);
      return res;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Fail update error"
      );
    }
  }
);

const initialState = {
  order: null,

  // ✅ separate states
  creatingOrder: false,
  verifying: false,

  success: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,

  reducers: {
    resetPayment: () => initialState,
  },

  extraReducers: (builder) => {
    builder

      // CREATE ORDER
      .addCase(createOrderThunk.pending, (state) => {
        state.creatingOrder = true;
        state.error = null;
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.creatingOrder = false;
        state.order = action.payload;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.creatingOrder = false;
        state.error = action.payload;
      })

      // VERIFY PAYMENT
      .addCase(verifyPaymentThunk.pending, (state) => {
        state.verifying = true;
        state.error = null;
      })
      .addCase(verifyPaymentThunk.fulfilled, (state) => {
        state.verifying = false;
        state.success = true;
      })
      .addCase(verifyPaymentThunk.rejected, (state, action) => {
        state.verifying = false;
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;