import { createSlice } from "@reduxjs/toolkit";
import { act } from "react";

const initialState = {
    city: null,   // redux-persist will rehydrate this automatically

}

const locationSlice = createSlice({
    name:"location",
    initialState,
    reducers:{
        setCity: (state,action) =>{
            state.city = action.payload;
        },
        clearCity: (state) =>{
            state.city = null;
        }
    },
});

export const { setCity, clearCity } = locationSlice.actions;
export default locationSlice.reducer;