import {
  createSlice,
  createAsyncThunk,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import {
  getOrganizerStatsApi,
  getRecentBookingsApi,
  getUpcomingShowsApi,
  getMyShowsApi,
  deleteShowApi,
  createShowApi,
  publishShowApi,
  getRevenueAnalyticsApi,
  getMyVenuesApi,
} from "./organizerApi";

// ======================================================
// 🎬 CREATE SHOW
// ======================================================

export const createShowThunk = createAsyncThunk(
  "organizer/createShow",
  async (data, { rejectWithValue }) => {
    try {
      const res = await createShowApi(data);
      return res.data; // 🔥 FIXED (backend returns {data})
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Create show failed"
      );
    }
  }
);

// ======================================================
// 📊 STATS
// ======================================================

export const fetchOrganizerStats = createAsyncThunk(
  "organizer/stats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getOrganizerStatsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch stats"
      );
    }
  }
);

// ======================================================
// 🧾 BOOKINGS
// ======================================================

export const fetchRecentBookings = createAsyncThunk(
  "organizer/bookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRecentBookingsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// ======================================================
// 📅 UPCOMING SHOWS
// ======================================================

export const fetchUpcomingShows = createAsyncThunk(
  "organizer/upcoming",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUpcomingShowsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch upcoming shows"
      );
    }
  }
);

// ======================================================
// 🎬 MY SHOWS
// ======================================================

export const fetchMyShows = createAsyncThunk(
  "organizer/myshows",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyShowsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch my shows"
      );
    }
  }
);

// ======================================================
// ❌ DELETE SHOW
// ======================================================

export const deleteShow = createAsyncThunk(
  "organizer/deleteShow",
  async (id, { rejectWithValue }) => {
    try {
      await deleteShowApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Delete failed"
      );
    }
  }
);

// ======================================================
// 🚀 PUBLISH SHOW
// ======================================================

export const publishShow = createAsyncThunk(
  "organizer/publishShow",
  async (id, { rejectWithValue }) => {
    try {
      await publishShowApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Publish failed"
      );
    }
  }
);

// ======================================================
// 💰 ANALYTICS
// ======================================================

export const fetchRevenueAnalytics = createAsyncThunk(
  "organizer/revenueAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getRevenueAnalyticsApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Analytics failed"
      );
    }
  }
);

// ======================================================
// 🏢 VENUES
// ======================================================

export const fetchMyVenues = createAsyncThunk(
  "organizer/myVenues",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyVenuesApi();
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch venues"
      );
    }
  }
);

// ======================================================
// 🧱 SLICE
// ======================================================

const organizerSlice = createSlice({
  name: "organizer",

  initialState: {
    stats: null,
    bookings: [],
    upcomingShows: [],
    myShows: [],
    revenueAnalytics: [],
    venues: [],

    loading: false,
    error: null,
    success: false,
  },

  reducers: {
    resetOrganizerState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {

    // ================= CREATE SHOW =================
    builder.addCase(createShowThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.success = true;

      if (action.payload) {
        state.myShows.unshift(action.payload);
      }
    });

    // ================= STATS =================
    builder.addCase(fetchOrganizerStats.fulfilled, (state, action) => {
      state.loading = false;
      state.stats = action.payload;
    });

    // ================= BOOKINGS =================
    builder.addCase(fetchRecentBookings.fulfilled, (state, action) => {
      state.loading = false;
      state.bookings = action.payload?.data || [];
    });

    // ================= UPCOMING =================
    builder.addCase(fetchUpcomingShows.fulfilled, (state, action) => {
      state.loading = false;
      state.upcomingShows = action.payload?.data || [];
    });

    // ================= MY SHOWS =================
    builder.addCase(fetchMyShows.fulfilled, (state, action) => {
      state.loading = false;
      state.myShows = action.payload?.data || [];
    });

    // ================= DELETE =================
    builder.addCase(deleteShow.fulfilled, (state, action) => {
      state.loading = false;
      state.myShows = state.myShows.filter(
        (show) => show._id !== action.payload
      );
    });

    // ================= PUBLISH =================
    builder.addCase(publishShow.fulfilled, (state, action) => {
      state.loading = false;

      state.myShows = state.myShows.map((show) =>
        show._id === action.payload
          ? { ...show, publishedStatus: "published" }
          : show
      );
    });

    // ================= REVENUE =================
    builder.addCase(fetchRevenueAnalytics.fulfilled, (state, action) => {
      state.loading = false;
      state.revenueAnalytics = action.payload?.data || [];
    });

    // ================= VENUES =================
    builder.addCase(fetchMyVenues.fulfilled, (state, action) => {
      state.loading = false;
      state.venues = action.payload?.data || [];
    });

    // ================= GLOBAL LOADING =================
    builder.addMatcher(
      isPending(
        createShowThunk,
        fetchOrganizerStats,
        fetchRecentBookings,
        fetchUpcomingShows,
        fetchMyShows,
        deleteShow,
        publishShow,
        fetchRevenueAnalytics,
        fetchMyVenues
      ),
      (state) => {
        state.loading = true;
        state.error = null;
      }
    );

    // ================= GLOBAL ERROR =================
    builder.addMatcher(
      isRejected(
        createShowThunk,
        fetchOrganizerStats,
        fetchRecentBookings,
        fetchUpcomingShows,
        fetchMyShows,
        deleteShow,
        publishShow,
        fetchRevenueAnalytics,
        fetchMyVenues
      ),
      (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }
    );
  },
});

export const { resetOrganizerState } = organizerSlice.actions;

export default organizerSlice.reducer;