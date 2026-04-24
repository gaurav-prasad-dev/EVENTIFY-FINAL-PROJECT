import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getHomeData, getMovieDetails } from "./movieApi";

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

// 🔥 THUNK 2: Movie Details
export const fetchMovieDetails = createAsyncThunk(
  "movies/fetchMovieDetails",
  async (movieId, thunkAPI) => {
    try {
      const res = await getMovieDetails(movieId);
      return res.movie;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// 🧠 INITIAL STATE
const initialState = {
  homeMovies: [],
  movieDetails: null, // ✅ fixed
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
        state.movieDetails = action.payload;
      })
      .addCase(fetchMovieDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default movieSlice.reducer;