import { createSlice } from "@reduxjs/toolkit";


const getStoredCity = () => {
  try {
    const data = localStorage.getItem("city");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.log("City parse error, resetting...");
    localStorage.removeItem("city"); // cleanup old bad data
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
  state.city = action.payload;
  localStorage.setItem("city", JSON.stringify(action.payload)); // ✅ FIX
},
   
    clearCity: (state) => {
      state.city = null;
      localStorage.removeItem("city"); // optional
    },
  },
});

export const { setCity, clearCity } = locationSlice.actions;
export default locationSlice.reducer;