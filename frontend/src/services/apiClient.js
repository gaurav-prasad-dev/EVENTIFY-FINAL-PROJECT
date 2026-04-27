import axios from "axios";
import { store } from "../app/store";
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

// ✅ REQUEST INTERCEPTOR
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ✅ RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);

    if (error.response?.status === 401) {
      // optional: store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default apiClient;