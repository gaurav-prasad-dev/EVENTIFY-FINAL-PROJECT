import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getCitiesApi,
  createCityApi,
  activateCityApi,
  deactivateCityApi,
} from "../../Features/admin/AdminCityApi";

// ================= FETCH =================
export const fetchCities = createAsyncThunk(
  "city/fetchCities",
  async (_, { rejectWithValue }) => {
    try {
      return await getCitiesApi();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ================= CREATE =================
export const createCity = createAsyncThunk(
  "city/createCity",
  async (data, { rejectWithValue }) => {
    try {
      return await createCityApi(data);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ================= ACTIVATE =================
export const activateCity = createAsyncThunk(
  "city/activateCity",
  async (id, { rejectWithValue }) => {
    try {
      await activateCityApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ================= DEACTIVATE =================
export const deactivateCity = createAsyncThunk(
  "city/deactivateCity",
  async (id, { rejectWithValue }) => {
    try {
      await deactivateCityApi(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// ================= INITIAL STATE =================
const initialState = {
  cities: [],
  loading: false,
  error: null,
};

// ================= SLICE =================
const citySlice = createSlice({
  name: "city",
  initialState,

  reducers: {
    clearCityError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchCities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCities.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload?.cities || [];
      })
      .addCase(fetchCities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // CREATE
      .addCase(createCity.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCity.fulfilled, (state, action) => {
        state.loading = false;

        const newCity = action.payload?.city;
        if (!newCity) return;

        const exists = state.cities.find(
          (c) => c._id === newCity._id
        );

        if (!exists) {
          state.cities.push(newCity);
        }
      })
      .addCase(createCity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ACTIVATE
      .addCase(activateCity.fulfilled, (state, action) => {
        const city = state.cities.find(
          (c) => c._id === action.payload
        );
        if (city) city.isActive = true;
      })

      // DEACTIVATE
      .addCase(deactivateCity.fulfilled, (state, action) => {
        const city = state.cities.find(
          (c) => c._id === action.payload
        );
        if (city) city.isActive = false;
      });
  },
});

export const { clearCityError } = citySlice.actions;
export default citySlice.reducer;