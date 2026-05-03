import { combineReducers } from "@reduxjs/toolkit";
import { root } from "postcss";
import locationReduer from "../Features/location/locationTimeSlice";
import authReducer from "../Features/auth/authSlice";
import movieReducer from "../Features/movies/movieSlice";
import showsReducer from "../Features/show/showSlice";
import bookingReducer from "../Features/booking/bookSlice";
import paymentReducer from "../Features/payment/paymentTimeSlice"
import organizerReducer from "../Features/organizer/organizerSlice";

import cityReducer from "../Features/admin/citySlice";
import contentReducer from "../Features/admin/contentSlice";
import adminReducer  from "../Features/admin/adminSlice"

const rootReducer = combineReducers({
    location: locationReduer,
    auth: authReducer,
    movies: movieReducer,
    shows: showsReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    organizer: organizerReducer,
    admin: adminReducer,
    city: cityReducer,
    content: contentReducer,

});

export default rootReducer;