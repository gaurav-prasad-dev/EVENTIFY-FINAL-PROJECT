import { apiConnector } from "../../services/apiConnector";
import { showEndpoints } from "../../services/apis";

const { GET_SHOWS_API } = showEndpoints;

export const getShows = async (movieId, city, date) => {
  try {
    const url = `${GET_SHOWS_API}?movieId=${movieId}&city=${city}&date=${date}`;

    console.log("FINAL URL:", url); // ✅ moved before return

    const res = await apiConnector("GET", url);

    return res.data.data;
  } catch (error) {
    console.log("GET SHOWS ERROR:", error);
    return [];
  }
};