import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const {
  GET_SEATS,
  LOCK_SEATS,
  CREATE,
  GET,
} = ENDPOINTS.BOOKING;

// 🎬 GET SEATS
export const getSeatLayout = async (showId) => {
  try {
    const res = await apiClient.get(GET_SEATS(showId));
    return res.data;
  } catch (error) {
    console.log("GET SEATS ERROR:", error);
    return { seats: [] };
  }
};

// 🔒 LOCK SEATS
export const lockSeats = async (showId, seats) => {
  try {
    const res = await apiClient.post(LOCK_SEATS, {
      showId,
      seats,
    });
    return res.data;
  } catch (error) {
    console.log("LOCK ERROR:", error);
    throw error;
  }
};

// 🧾 CREATE BOOKING
export const createBooking = async (showId, seats) => {
  try {
    const res = await apiClient.post(CREATE, {
      showId,
      seats,
    });
    return res.data;
  } catch (error) {
    console.log("CREATE BOOKING ERROR:", error);
    throw error;
  }
};


// 🔍 GET BOOKING BY ID
export const getBookingById = async (bookingId) => {
  try {
    const res = await apiClient.get(BOOKING.GET(bookingId));
    return res.data;
  } catch (error) {
    console.log("GET BOOKING ERROR:", error);
    throw error;
  }
};


// 📦 GET ALL MY BOOKINGS
export const getMyBookings = async () => {
  try {
    const res = await apiClient.get(BOOKING.GET_MY_BOOKINGS);
    return res.data.bookings;
  } catch (error) {
    console.log("GET MY BOOKINGS ERROR:", error);
    throw error;
  }
};