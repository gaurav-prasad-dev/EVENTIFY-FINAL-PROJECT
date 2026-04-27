// ✅ NO BASE_URL HERE (handled in axios apiClient)

export const ENDPOINTS = {
  AUTH: {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    GOOGLE_LOGIN: "/auth/google-login",
    LOGOUT: "/auth/logout",
  },

  CITY: {
    GET_ALL: "/city",
  },

  SHOWS: {
    // GET: "/shows",
    GET_ALL: "/shows", 
  GET_BY_ID: (id) => `/shows/${id}`
  },

  HOME: {
    GET: "/home",
    
  },

  MOVIES: {
    SEARCH: "/movies/search",
    DETAILS: (id) => `/movies/${id}`,
    VIDEOS: (id) => `/movies/${id}/videos`,
    GENRES: "/movies/genres",
  },

  EVENTS: {
    GET_HOME: "/events/home",
  },

  BOOKING: {
    GET_SEATS: (showId) => `/bookings/seats/${showId}`,
    LOCK_SEATS: "/bookings/lock-seats",
    CREATE: "/bookings/create",
    GET: (bookingId) => `/bookings/${bookingId}`,
  },

  PAYMENT: {
    CREATE_ORDER:"/payment/createOrder",
    VERIFY: "/payment/verify",
  },
};