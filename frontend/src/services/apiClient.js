import axios from "axios";
import { store } from "../app/store";
import { updateAccessToken, logout } from "../Features/auth/authSlice";

const defaultBaseURL = import.meta.env.PROD
  ? "https://eventify-final-project.onrender.com/api/v1"
  : "http://localhost:4000/api/v1";

const envBaseURL = import.meta.env.VITE_BASE_URL?.trim();
const rawBaseURL =
  envBaseURL && (!import.meta.env.PROD || !envBaseURL.includes("localhost"))
    ? envBaseURL
    : defaultBaseURL;

// Sanitize baseURL to remove any accidental trailing slash
const baseURL = rawBaseURL.replace(/\/+$/, "");

if (import.meta.env.PROD && baseURL.includes("localhost")) {
  console.warn(
    "⚠️ Warning: VITE_BASE_URL is pointing to localhost in production. Falling back to live Render backend."
  );
}

const apiClient = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 45000, // 45s timeout to gracefully accommodate Render cold starts
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  let token = state?.auth?.token || state?.auth?.accessToken;

  if (!token) {
    try {
      const savedAuth = JSON.parse(localStorage.getItem("auth"));
      token = savedAuth?.token || savedAuth?.accessToken;
    } catch {}
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// REFRESH QUEUE STATE
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// RESPONSE INTERCEPTOR WITH AUTO REFRESH
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and request has not already been retried
    const isAuthError = error.response?.status === 401;
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh-token");
    const isLoginCall =
      originalRequest?.url?.includes("/auth/verify-otp") ||
      originalRequest?.url?.includes("/auth/google-login");

    if (isAuthError && !originalRequest._retry && !isRefreshCall && !isLoginCall) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        const newToken =
          refreshResponse.data?.accessToken || refreshResponse.data?.token;

        if (newToken) {
          store.dispatch(updateAccessToken(newToken));

          apiClient.defaults.headers.common.Authorization = `Bearer ${newToken}`;
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          processQueue(null, newToken);
          return apiClient(originalRequest);
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    if (!error.response && error.message === "Network Error") {
      console.error(
        `🚨 [Axios Network Error] Could not reach backend at "${baseURL}". Verify that:\n1. Your Render backend web service is active (not sleeping or crashed).\n2. VITE_BASE_URL on Vercel is set to https://your-backend.onrender.com/api/v1 (and you triggered a Redeploy on Vercel).\n3. In Google/Browser Developer Tools Network tab, check the failed request status and response headers.`
      );
    } else {
      console.log("API ERROR:", error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;