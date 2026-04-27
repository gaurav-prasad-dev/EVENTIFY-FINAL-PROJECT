import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHomeData, getMovieDetails, getMovieVideos } from "./movieApi";

// 🔥 THUNK 1: Home Movies
export const fetchHomeMovies = createAsyncThunk(
  "movies/fetchHomeMovies",
  async (_, thunkAPI) => {
    try {
      const res = await getHomeData();
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🔥 THUNK 2: Movie Details (FULL DATA)
export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async (movieId, thunkAPI) => {
    try {
      const res = await getMovieDetails(movieId);
      console.log("THUNK DATA:", res);
      return res; // ✅ IMPORTANT: return full response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🎥 THUNK 3: Movie Videos
export const fetchMovieVideos = createAsyncThunk(
  "movies/fetchMovieVideos",
  async (movieId, thunkAPI) => {
    try {
      const res = await getMovieVideos(movieId);
      console.log("VIDEOS RESPONSE:", res);

      return res.trailer?.key || null; // ✅ only trailer key
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🧠 INITIAL STATE
const initialState = {
  homeMovies: [],
  movieDetails: null,
  trailerKey: null,

  cast: [],
  crew: [],
  reviews: [],
  posters: [],

  loading: false,
  error: null,
};

// 🎯 SLICE
const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // 🎬 HOME MOVIES
      .addCase(fetchHomeMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHomeMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.homeMovies = action.payload;
      })
      .addCase(fetchHomeMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🎥 MOVIE DETAILS
      .addCase(fetchMovieDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieDetails.fulfilled, (state, action) => {
        state.loading = false;

        console.log("REDUX STORED:", action.payload);

        // ✅ SPLIT DATA CORRECTLY
        state.movieDetails = action.payload.movie;
        state.cast = action.payload.cast || [];
        state.crew = action.payload.crew || [];
        state.reviews = action.payload.reviews || [];
        state.posters = action.payload.posters || [];
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🎬 TRAILER
      .addCase(fetchMovieVideos.fulfilled, (state, action) => {
        state.trailerKey = action.payload;
      });
  },
});

export default movieSlice.reducer;