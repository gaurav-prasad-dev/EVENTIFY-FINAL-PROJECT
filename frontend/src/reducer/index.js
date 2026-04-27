import { combineReducers } from "@reduxjs/toolkit";
import { root } from "postcss";
import locationReduer from "../Features/location/locationTimeSlice";
import authReducer from "../Features/auth/authSlice";
import movieReducer from "../Features/movies/movieSlice";
import showsReducer from "../Features/show/showSlice";
import bookingReducer from "../Features/booking/bookSlice";
import paymentReducer from "../Features/payment/paymentTimeSlice"

const rootReducer = combineReducers({
    location: locationReduer,
    auth: authReducer,
    movies: movieReducer,
    shows: showsReducer,
    booking: bookingReducer,
    payment: paymentReducer,

});

export default rootReducer;