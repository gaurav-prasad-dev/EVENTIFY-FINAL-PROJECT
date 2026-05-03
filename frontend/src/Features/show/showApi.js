import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// 🎬 GET SHOWS

export const getShowsByContent = async (contentId, date, cityId) => {
  try {
    const res = await apiClient.get(`/shows/by-content/${contentId}`,{
      params: {
        date,
        cityId,
      },
    });

    return res.data.data;
  } catch (error) {
    console.log("GET SHOWS ERROR:", error);
    throw error;
  }
};
export const getShows = async ({ contentId, city, date }) => {
  try {
    const res = await apiClient.get(ENDPOINTS.SHOWS.GET_ALL, {
      params: {
        contentId,
        city,
        date,
      },
    });
console.log("SHOW API RAW:", res.data);
    return res.data?.data || [];
  } catch (error) {
    console.log("GET SHOWS ERROR:", error);
    return [];
  }
};

// 🎬 GET SINGLE SHOW BY ID
export const getShowById = async (showId) => {
  try {
    const res = await apiClient.get(
      ENDPOINTS.SHOWS.GET_BY_ID(showId)
    );

    // ✅ STRICT & SAFE
    if (!res.data?.success) return null;
 console.log("show api raw:", res.data);
    return res.data?.data || null;
  } catch (error) {
    console.log("GET SHOW BY ID ERROR:", error);
    return null;
  }
};