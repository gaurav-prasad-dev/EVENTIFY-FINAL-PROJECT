import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getShows } from "./showApi";

export const fetchShows = createAsyncThunk(
  "shows/fetchShows",
  async ({ movieId, city, date }, thunkAPI) => {
    try {
      const data = await getShows(movieId, city, date); // ✅ fixed
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  shows: [],
  loading: false,
  error: null,
};

const showSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload || [];
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default showSlice.reducer;