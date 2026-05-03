import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getShowsByContent, getShowById } from "./showApi";

// 🎬 FETCH SHOWS BY CONTENT (Movie Page)
export const fetchShowsByContent = createAsyncThunk(
  "shows/fetchByContent",
  async ({ contentId, date, cityId }, thunkAPI) => {
    try {
      const res = await getShowsByContent(contentId, date, cityId);
      return res.data; // ✅ extract actual data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// 🎟️ FETCH SINGLE SHOW (Seat Page - next)
export const fetchShowById = createAsyncThunk(
  "shows/fetchById",
  async (showId, thunkAPI) => {
    try {
      const res = await getShowById(showId);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
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
  reducers: {
    clearShowError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // 🎬 FETCH SHOWS
      .addCase(fetchShowsByContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShowsByContent.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload || [];
      })
      .addCase(fetchShowsByContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🎟️ FETCH SINGLE SHOW
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

export const { clearShowError } = showSlice.actions;

export default showSlice.reducer;