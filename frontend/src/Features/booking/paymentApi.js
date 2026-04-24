import { apiConnector } from "../../services/apiConnector";
import { paymentEndpoints } from "../../services/apis";

const { CREATE_ORDER, VERIFY_PAYMENT } = paymentEndpoints;

// 🧾 CREATE ORDER
export const createPaymentOrder = async (bookingId) => {
  try {
    const token = localStorage.getItem("token");

    const res = await apiConnector(
      "POST",
      CREATE_ORDER,
      { bookingId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res?.data;

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);
    throw error;
  }
};

// 🔐 VERIFY PAYMENT
export const verifyPayment = async (data) => {
  try {
    const token = localStorage.getItem("token");

    const res = await apiConnector(
      "POST",
      VERIFY_PAYMENT,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res?.data;

  } catch (error) {
    console.log("VERIFY ERROR:", error);
    throw error;
  }
};