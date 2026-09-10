import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  const baseUrl = import.meta.env.VITE_BASE_URL?.trim();
  if (baseUrl && (!import.meta.env.PROD || !baseUrl.includes("localhost"))) {
    return baseUrl.replace(/\/api\/v1\/?$/, "");
  }
  return import.meta.env.PROD
    ? "https://eventify-final-project.onrender.com"
    : "http://localhost:4000";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket", "polling"],
  withCredentials: true,
});