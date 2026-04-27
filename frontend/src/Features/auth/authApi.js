import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// 🔐 SEND OTP
export const sendOtpApi = async (data) => {
  try {
    const res = await apiClient.post(ENDPOINTS.AUTH.SEND_OTP, data);
    return res.data;
  } catch (error) {
    console.log("SEND OTP ERROR:", error);
    throw error;
  }
};

// 🔐 VERIFY OTP
export const verifyOtpApi = async (data) => {
  try {
    const res = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, data);
    return res.data;
  } catch (error) {
    console.log("VERIFY OTP ERROR:", error);
    throw error;
  }
};

// 🔐 GOOGLE LOGIN
export const googleLoginApi = async (data) => {
  try {
    const res = await apiClient.post(ENDPOINTS.AUTH.GOOGLE_LOGIN, data);
    return res.data;
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR:", error);
    throw error;
  }
};

// 🚪 LOGOUT
export const logoutUser = async () => {
  try {
    const res = await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
    return res.data;
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
    throw error;
  }
};