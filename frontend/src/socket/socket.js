import { io } from "socket.io-client";

const getSocketUrl = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }
  if (import.meta.env.VITE_BASE_URL) {
    return import.meta.env.VITE_BASE_URL.replace(/\/api\/v1\/?$/, "");
  }
  return "http://localhost:4000";
};

export const socket = io(getSocketUrl(), {
  transports: ["websocket", "polling"],
  withCredentials: true,
});