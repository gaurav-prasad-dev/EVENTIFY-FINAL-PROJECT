import { createSlice } from "@reduxjs/toolkit";

const getStoredCity = () => {
  try {
    const data = localStorage.getItem("city");
    if (!data) return "Indore";
    const parsed = JSON.parse(data);

    return typeof parsed === "object" ? parsed?.name : parsed;
  } catch (err) {
    return "Indore";
  }
};

const getStoredCityObj = () => {
  try {
    const data = localStorage.getItem("selectedCityObj");
    if (!data) return null;
    return JSON.parse(data);
  } catch (err) {
    return null;
  }
};

const initialState = {
  city: getStoredCity(),
  selectedCity: getStoredCityObj(),
};

const locationTimeSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setCity: (state, action) => {
      const isObj = typeof action.payload === "object" && action.payload !== null;
      const cityName = isObj ? action.payload?.name : action.payload;

      state.city = cityName;
      state.selectedCity = isObj ? action.payload : { name: cityName };

      localStorage.setItem("city", JSON.stringify(cityName));
      if (isObj) {
        localStorage.setItem("selectedCityObj", JSON.stringify(action.payload));
      }
    },

    clearCity: (state) => {
      state.city = null;
      state.selectedCity = null;
      localStorage.removeItem("city");
      localStorage.removeItem("selectedCityObj");
    },
  },
});

export const { setCity, clearCity } = locationTimeSlice.actions;
export default locationTimeSlice.reducer;