import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getAllContentApi,
  createContentApi,
  updateContentApi,
  deleteContentApi,
  featureContentApi,
  unfeatureContentApi,
  searchTmdbMoviesApi,
createFromTmdbApi,
} from "./AdminContentApi";

// ======================================================
// FETCH CONTENT
// ======================================================


// ======================================================
// SEARCH TMDB MOVIES
// ======================================================
export const searchTmdbMovies = createAsyncThunk(
  "content/searchTmdb",
  async (query, { rejectWithValue }) => {
    try {
      return await searchTmdbMoviesApi(query);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// CREATE FROM TMDB
// ======================================================
export const createFromTmdb = createAsyncThunk(
  "content/createFromTmdb",
  async (tmdbId, { rejectWithValue }) => {
    try {
      return await createFromTmdbApi(tmdbId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);




export const fetchContent = createAsyncThunk(
  "content/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await getAllContentApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// CREATE CONTENT
// ======================================================
export const createContent = createAsyncThunk(
  "content/create",
  async (data, { rejectWithValue }) => {
    try {
      return await createContentApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// UPDATE CONTENT
// ======================================================
export const updateContent = createAsyncThunk(
  "content/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await updateContentApi(id, data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// DELETE CONTENT
// ======================================================
export const deleteContent = createAsyncThunk(
  "content/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteContentApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// FEATURE CONTENT
// ======================================================
export const featureContent = createAsyncThunk(
  "content/feature",
  async (id, { rejectWithValue }) => {
    try {
      await featureContentApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ======================================================
// UNFEATURE CONTENT
// ======================================================
export const unfeatureContent = createAsyncThunk(
  "content/unfeature",
  async (id, { rejectWithValue }) => {
    try {
      await unfeatureContentApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  contents: [],
  tmdbMovies: [],
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: "content",
  initialState,

  reducers: { 
    clearTmdbMovies: (state) => {
        state.tmdbMovies = [];
    }
  },

  extraReducers: (builder) => {
    builder

    // ======================================================
// TMDB SEARCH
// ======================================================
.addCase(searchTmdbMovies.fulfilled, (state, action) => {
  state.tmdbMovies = action.payload?.data || [];
})

// ======================================================
// CREATE FROM TMDB
// ======================================================
.addCase(createFromTmdb.fulfilled, (state, action) => {
  state.contents.unshift(action.payload.data);
})
      // FETCH
      .addCase(fetchContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload?.data || [];
      })
      .addCase(fetchContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createContent.fulfilled, (state, action) => {
        state.contents.unshift(action.payload.data);
      })

      // UPDATE
      .addCase(updateContent.fulfilled, (state, action) => {
        const updated = action.payload.content;

        const index = state.contents.findIndex(
          (c) => c._id === updated._id
        );

        if (index !== -1) {
          state.contents[index] = updated;
        }
      })

      // DELETE
      .addCase(deleteContent.fulfilled, (state, action) => {
        state.contents = state.contents.filter(
          (c) => c._id !== action.payload
        );
      })

      // FEATURE
      .addCase(featureContent.fulfilled, (state, action) => {
        const item = state.contents.find(
          (c) => c._id === action.payload
        );

        if (item) item.isFeatured = true;
      })

      // UNFEATURE
      .addCase(unfeatureContent.fulfilled, (state, action) => {
        const item = state.contents.find(
          (c) => c._id === action.payload
        );

        if (item) item.isFeatured = false;
      });
  },
});

export const { clearTmdbMovies } =
  contentSlice.actions;

export default contentSlice.reducer;