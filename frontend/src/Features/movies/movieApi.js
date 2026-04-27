import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const {
 
  SEARCH,
  DETAILS,
  VIDEOS,
  GENRES,
} = ENDPOINTS.MOVIES;

const { GET } = ENDPOINTS.HOME;

// 🎬 HOME DATA
export const getHomeData = async () => {
  try {
    const res = await apiClient.get(GET);
    return res.data;
  } catch (error) {
    console.log("GET HOME ERROR:", error);
    throw error;
  }
};

// 🔍 SEARCH MOVIES
export const searchMovies = async (query) => {
  try {
    const res = await apiClient.get(SEARCH, {
      params: { query },
    });
    return res.data;
  } catch (error) {
    console.log("SEARCH MOVIES ERROR:", error);
    throw error;
  }
};

// 🎥 MOVIE DETAILS
export const getMovieDetails = async (id) => {
  try {
    const res = await apiClient.get(DETAILS(id));
     console.log("DETAIL RESPONSE:", res); // 👈 ADD

       return {
      movie: res.data.movie,
      cast: res.data.cast || [],
      crew: res.data.crew || [],
      reviews: res.data.reviews || [],
      posters: res.data.posters || [],
    };
  } catch (error) {
    console.log("GET MOVIE DETAILS ERROR:", error);
    throw error;
  }
};

// 🎬 MOVIE VIDEOS
export const getMovieVideos = async (id) => {
  try {
    const res = await apiClient.get(VIDEOS(id));
    console.log("DETAIL RESPONSE:", res); // 👈 ADD
     
    return res.data;
  } catch (error) {
    console.log("GET MOVIE VIDEOS ERROR:", error);
    throw error;
  }
};

// 🎭 GENRES
export const getGenres = async () => {
  try {
    const res = await apiClient.get(GENRES);
    return res.data;
  } catch (error) {
    console.log("GET GENRES ERROR:", error);
    throw error;
  }
};