const BASE_URL = import.meta.env.VITE_BASE_URL;


export const authEndpoints = {
    SEND_OTP_API :BASE_URL + "/auth/send-otp",
    VERIFY_OTP_API: BASE_URL + "/auth/verify-otp",
    GOOGLE_LOGIN_API: BASE_URL + "/auth/google-login",
 LOGOUT_API: BASE_URL + "/auth/logout", 

}
export const cityEndpoints = {
    GET_CITIES_API: BASE_URL + "/city",
}

export const showEndpoints = {
    GET_SHOWS_API: BASE_URL + "/shows",
    
}

export const homeEndpoints ={
    GET_HOME_API: BASE_URL+"/home",
};

export const movieEndpoints = {
    SEARCH_MOVIES_API: BASE_URL + "/movies/search",
    GET_MOVIE_DETAILS_API: (id) => BASE_URL+`/movies/${id}`,
    GET_MOVIE_VIDEOS_API: (id) => BASE_URL+`/movies/${id}/videos`,
    GET_GENRES_API: BASE_URL + "/movies/genres",
}

export const eventEndpoints = {
    GET_EVENTS_API: BASE_URL+"/events/home",
    
}

export const bookingEndpoints = {
    GET_SEATS : (showId) => `${BASE_URL}/bookings/seats/${showId}`,
    LOCK_SEATS :`${BASE_URL}/bookings/lock-seats`,
    CREATE_BOOKING:`${BASE_URL}/bookings/create`,
    // CONFIRM_BOOKING:`${BASE_URL}/bookings/confirm`,
GET_BOOKING: (bookingId) => `${BASE_URL}/bookings/${bookingId}`,

};

export const paymentEndpoints = {
     CREATE_ORDER: `${BASE_URL}/payment/createOrder`,

  VERIFY_PAYMENT:`${BASE_URL}/payment/verify`,

}




