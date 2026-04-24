import { apiConnector } from "../../services/apiConnector";
import { bookingEndpoints } from "../../services/apis";

const {
  GET_SEATS,
  LOCK_SEATS,
  CREATE_BOOKING,
} = bookingEndpoints;

// 🎬 GET SEATS
export const getSeatLayout = async (showId) => {
  try {
    const res = await apiConnector("GET", GET_SEATS(showId));
    return res?.data;
  } catch (error) {
    console.log("GET SEATS ERROR:", error);
    return { seats: [] };
  }
};

// 🔒 LOCK SEATS
export const lockSeats = async (showId, seats) => {
  try {
    const res = await apiConnector("POST", LOCK_SEATS, {
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
    const res = await apiConnector("POST", CREATE_BOOKING, {
      showId,
      seats,
    });

    return res?.data;
  } catch (error) {
    console.log("CREATE BOOKING ERROR:", error);
    throw error;
  }
};