import { apiConnector } from "../../services/apiConnector";
import { bookingEndpoints } from "../../services/apis";

const { GET_BOOKING} = bookingEndpoints;


export const getBookingById = async (bookingId) => {
  try {
    const res = await apiConnector(
      "GET",
      GET_BOOKING(bookingId)
    );
    return res?.data;
  } catch (error) {
    console.log("GET BOOKING ERROR:", error);
    throw error;
  }
};