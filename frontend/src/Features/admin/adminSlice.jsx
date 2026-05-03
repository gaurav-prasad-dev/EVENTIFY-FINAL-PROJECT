import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getAdminStatsApi,
  getPendingOrganizersApi,
  approveOrganizerApi,
  rejectOrganizerApi,
  getAllUsersApi,
  blockUserApi,
  unblockUserApi,
  getAllShowsApi,
  deleteShowApi,
  approveShowApi,
  rejectShowApi,
  getPendingVenuesApi,
  approveVenueApi,
  rejectVenueApi,
  getTransactionsApi,
  getRevenueTrendsApi,
  getTopContentApi,
} from "./adminApi";

// ======================================================
// 📊 DASHBOARD
// ======================================================

export const fetchAdminStats =
  createAsyncThunk(
    "admin/fetchStats",
    async (_, { rejectWithValue }) => {
      try {
        return await getAdminStatsApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 👥 ORGANIZERS
// ======================================================

export const fetchPendingOrganizers =
  createAsyncThunk(
    "admin/fetchPendingOrganizers",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingOrganizersApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const approveOrganizer =
  createAsyncThunk(
    "admin/approveOrganizer",
    async (id, { rejectWithValue }) => {
      try {
        return await approveOrganizerApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const rejectOrganizer =
  createAsyncThunk(
    "admin/rejectOrganizer",
    async (id, { rejectWithValue }) => {
      try {
        return await rejectOrganizerApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 👤 USERS
// ======================================================

export const fetchUsers =
  createAsyncThunk(
    "admin/fetchUsers",
    async (_, { rejectWithValue }) => {
      try {
        return await getAllUsersApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const blockUser =
  createAsyncThunk(
    "admin/blockUser",
    async (id, { rejectWithValue }) => {
      try {
        return await blockUserApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const unblockUser =
  createAsyncThunk(
    "admin/unblockUser",
    async (id, { rejectWithValue }) => {
      try {
        return await unblockUserApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 🎬 SHOWS
// ======================================================

export const fetchShows =
  createAsyncThunk(
    "admin/fetchShows",
    async (_, { rejectWithValue }) => {
      try {
        return await getAllShowsApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const deleteShow =
  createAsyncThunk(
    "admin/deleteShow",
    async (id, { rejectWithValue }) => {
      try {
        await deleteShowApi(id);

        return id;
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// ✅ APPROVE SHOW
// ======================================================

export const approveShow =
  createAsyncThunk(
    "admin/approveShow",
    async (id, { rejectWithValue }) => {
      try {
        return await approveShowApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// ❌ REJECT SHOW
// ======================================================

export const rejectShow =
  createAsyncThunk(
    "admin/rejectShow",
    async (id, { rejectWithValue }) => {
      try {
        return await rejectShowApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 🏢 VENUES
// ======================================================

export const fetchPendingVenues =
  createAsyncThunk(
    "admin/fetchPendingVenues",
    async (_, { rejectWithValue }) => {
      try {
        return await getPendingVenuesApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const approveVenue =
  createAsyncThunk(
    "admin/approveVenue",
    async (id, { rejectWithValue }) => {
      try {
        return await approveVenueApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const rejectVenue =
  createAsyncThunk(
    "admin/rejectVenue",
    async (id, { rejectWithValue }) => {
      try {
        return await rejectVenueApi(id);
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 💳 TRANSACTIONS
// ======================================================

export const fetchTransactions =
  createAsyncThunk(
    "admin/fetchTransactions",
    async (_, { rejectWithValue }) => {
      try {
        return await getTransactionsApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// 📈 ANALYTICS
// ======================================================

export const fetchRevenueTrends =
  createAsyncThunk(
    "admin/fetchRevenueTrends",
    async (_, { rejectWithValue }) => {
      try {
        return await getRevenueTrendsApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

export const fetchTopContent =
  createAsyncThunk(
    "admin/fetchTopContent",
    async (_, { rejectWithValue }) => {
      try {
        return await getTopContentApi();
      } catch (err) {
        return rejectWithValue(
          err.response?.data || err.message
        );
      }
    }
  );

// ======================================================
// INITIAL STATE
// ======================================================

const initialState = {
  stats: {},

  pendingOrganizers: [],
  pendingVenues: [],

  organizers: [],
  users: [],
  shows: [],
  venues: [],

  transactions: [],
  revenueTrends: [],
  topContent: [],

  loading: false,
  error: null,
};

// ======================================================
// SLICE
// ======================================================

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ======================================================
      // 📊 ADMIN STATS
      // ======================================================

      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchAdminStats.fulfilled,
        (state, action) => {
          state.loading = false;

          // FIXED
          state.stats =
            action.payload?.data || {};
        }
      )

      .addCase(
        fetchAdminStats.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ======================================================
      // 👥 PENDING ORGANIZERS
      // ======================================================

      .addCase(
        fetchPendingOrganizers.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchPendingOrganizers.fulfilled,
        (state, action) => {
          state.loading = false;

          // FIXED
          state.pendingOrganizers =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchPendingOrganizers.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ======================================================
      // ✅ APPROVE ORGANIZER
      // ======================================================

      .addCase(
        approveOrganizer.fulfilled,
        (state, action) => {
          const approvedId =
            action.payload?.data?._id;

          state.pendingOrganizers =
            state.pendingOrganizers.filter(
              (org) =>
                org._id !== approvedId
            );
        }
      )

      // ======================================================
      // ❌ REJECT ORGANIZER
      // ======================================================

      .addCase(
        rejectOrganizer.fulfilled,
        (state, action) => {
          const rejectedId =
            action.payload?.data?._id;

          state.pendingOrganizers =
            state.pendingOrganizers.filter(
              (org) =>
                org._id !== rejectedId
            );
        }
      )

      // ======================================================
      // 🎬 FETCH SHOWS
      // ======================================================

      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })

      .addCase(
        fetchShows.fulfilled,
        (state, action) => {
          state.loading = false;

          state.shows =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchShows.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ======================================================
      // 🗑 DELETE SHOW
      // ======================================================

      .addCase(
        deleteShow.fulfilled,
        (state, action) => {
          state.shows =
            state.shows.filter(
              (show) =>
                show._id !==
                action.payload
            );
        }
      )

      // ======================================================
      // ✅ APPROVE SHOW
      // ======================================================

      .addCase(
        approveShow.fulfilled,
        (state, action) => {
          const updatedShow =
            action.payload?.data;

          if (!updatedShow) return;

          const index =
            state.shows.findIndex(
              (show) =>
                show._id ===
                updatedShow._id
            );

          if (index !== -1) {
            state.shows[index] =
              updatedShow;
          }
        }
      )

      // ======================================================
      // ❌ REJECT SHOW
      // ======================================================

      .addCase(
        rejectShow.fulfilled,
        (state, action) => {
          const updatedShow =
            action.payload?.data;

          if (!updatedShow) return;

          const index =
            state.shows.findIndex(
              (show) =>
                show._id ===
                updatedShow._id
            );

          if (index !== -1) {
            state.shows[index] =
              updatedShow;
          }
        }
      )

      // ======================================================
      // 🏢 FETCH PENDING VENUES
      // ======================================================

      .addCase(
        fetchPendingVenues.pending,
        (state) => {
          state.loading = true;
        }
      )

      .addCase(
        fetchPendingVenues.fulfilled,
        (state, action) => {
          state.loading = false;

          // FIXED
          state.pendingVenues =
            action.payload?.data || [];
        }
      )

      .addCase(
        fetchPendingVenues.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ======================================================
      // ✅ APPROVE VENUE
      // ======================================================

      .addCase(
        approveVenue.fulfilled,
        (state, action) => {
          const approvedVenueId =
            action.payload?.data?._id;

          state.pendingVenues =
            state.pendingVenues.filter(
              (venue) =>
                venue._id !==
                approvedVenueId
            );
        }
      )

      // ======================================================
      // ❌ REJECT VENUE
      // ======================================================

      .addCase(
        rejectVenue.fulfilled,
        (state, action) => {
          const rejectedVenueId =
            action.payload?.data?._id;

          state.pendingVenues =
            state.pendingVenues.filter(
              (venue) =>
                venue._id !==
                rejectedVenueId
            );
        }
      )

      // ======================================================
      // 👤 FETCH USERS
      // ======================================================

      .addCase(
        fetchUsers.fulfilled,
        (state, action) => {
          state.users =
            action.payload?.data || [];
        }
      )

      // ======================================================
      // 💳 TRANSACTIONS
      // ======================================================

      .addCase(
        fetchTransactions.fulfilled,
        (state, action) => {
          state.transactions =
            action.payload?.data || [];
        }
      )

      // ======================================================
      // 📈 REVENUE TRENDS
      // ======================================================

      .addCase(
        fetchRevenueTrends.fulfilled,
        (state, action) => {
          state.revenueTrends =
            action.payload?.data || [];
        }
      )

      // ======================================================
      // 🎥 TOP CONTENT
      // ======================================================

      .addCase(
        fetchTopContent.fulfilled,
        (state, action) => {
          state.topContent =
            action.payload?.data || [];
        }
      );
  },
});

export default adminSlice.reducer;