import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// 🧾 CREATE ORDER
export const createPaymentOrder = async (bookingId) => {
  try {
    const res = await apiClient.post(
      ENDPOINTS.PAYMENT.CREATE_ORDER,
      { bookingId }
    );

    return res.data;
  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    throw error;
  }
};

// 🔐 VERIFY PAYMENT
export const verifyPayment = async (data) => {
  try {
    const res = await apiClient.post(
      ENDPOINTS.PAYMENT.VERIFY,
      data
    );

    return res.data;
  } catch (error) {
    console.log("VERIFY ERROR:", error);
    throw error;
  }
};