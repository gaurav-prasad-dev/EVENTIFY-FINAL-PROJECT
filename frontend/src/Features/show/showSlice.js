import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getShows, getShowById } from "./showApi";

// ✅ ALL SHOWS
export const fetchShows = createAsyncThunk(
  "shows/fetchShows",
  async (params, thunkAPI) => {
    try {
      const data = await getShows(params);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// ✅ SINGLE SHOW
export const fetchShowById = createAsyncThunk(
  "shows/fetchShowById",
  async (showId, thunkAPI) => {
    try {
      const data = await getShowById(showId);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  shows: [],
  currentShow: null,
  loading: false,
  error: null,
};

const showSlice = createSlice({
  name: "shows",
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // ✅ ALL SHOWS
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload || [];
        console.log("payload:", action.payload);
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ SINGLE SHOW
      .addCase(fetchShowById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShow = action.payload || null;
      })
      .addCase(fetchShowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default showSlice.reducer;