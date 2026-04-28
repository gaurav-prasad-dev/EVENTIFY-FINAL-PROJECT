import { createSlice } from "@reduxjs/toolkit";


const getStoredCity = () => {
  try {
    const data = localStorage.getItem("city");
    const parsed = JSON.parse(data);

    return typeof parsed === "object"
      ? parsed?.name
      : parsed;
  } catch (err) {
    localStorage.removeItem("city");
    return null;
  }
};

const initialState = {
  city: getStoredCity(),
};


const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
   setCity: (state, action) => {
  const value =
    typeof action.payload === "object"
      ? action.payload?.name
      : action.payload;

  state.city = value;

  localStorage.setItem("city", JSON.stringify(value));
},
   
    clearCity: (state) => {
      state.city = null;
      localStorage.removeItem("city"); // optional
    },
  },
});

export const { setCity, clearCity } = locationSlice.actions;
export default locationSlice.reducer;