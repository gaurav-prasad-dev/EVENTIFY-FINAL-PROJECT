// src/services/apis.js

export const ENDPOINTS = {
  // ======================================================
  // AUTH
  // ======================================================
  AUTH: {
    SEND_OTP: "/auth/send-otp",
    VERIFY_OTP: "/auth/verify-otp",
    GOOGLE_LOGIN: "/auth/google-login",
    LOGOUT: "/auth/logout",
  },

  // ======================================================
  // HOME
  // ======================================================
  HOME: {
    GET: "/home",
  },

  // ======================================================
  // CITY
  // ======================================================
  CITY: {
    GET_ALL: "/city",
    
  },

  // ======================================================
  // CONTENT
CONTENT: {
  // ================= PUBLIC =================
  GET_ALL: "/content",

  GET_BY_ID: (id) =>
    `/content/${id}`,

  SEARCH: "/content/search/all",

  // ================= ADMIN =================
  CREATE: "/content/create",

  UPDATE: (id) =>
    `/content/${id}`,

  DELETE: (id) =>
    `/content/${id}`,

  FEATURE: (id) =>
    `/content/${id}/feature`,

  UNFEATURE: (id) =>
    `/content/${id}/unfeature`,

  // ================= TMDB =================
  CREATE_FROM_TMDB:
    "/content/tmdb",
},

  // ======================================================
  // MOVIES
  // ======================================================
  MOVIES: {
    SEARCH: "/movies/search",
    DETAILS: (id) => `/movies/${id}`,
    VIDEOS: (id) => `/movies/${id}/videos`,
    GENRES: "/movies/genres",
  },

  // ======================================================
  // EVENTS
  // ======================================================
  EVENTS: {
    HOME: "/events/home",
  },

  // ======================================================
  // SHOWS
  // ======================================================
  SHOWS: {

      GET_BY_CONTENT: (contentId) => `/shows/${contentId}`, 

    GET_ALL: "/shows",
    GET_BY_ID: (id) => `/shows/${id}`,

    CREATE: "/shows/create",
    UPDATE: (id) => `/shows/${id}`,
    DELETE: (id) => `/shows/${id}`,

    PUBLISH: (id) => `/shows/${id}/publish`,

      // ✅ ADMIN APPROVAL
  GET_PENDING: "/admin/shows/pending",

  APPROVE: (id) => `/admin/shows/${id}/approve`,

  REJECT: (id) => `/admin/shows/${id}/reject`,
  },

  // ======================================================
  // VENUES
  // ======================================================
  VENUES: {
    GET_APPROVED: "/venues/approved/all",
    GET_BY_CITY: (cityId) => `/venues/city/${cityId}`,
    GET_BY_ID: (id) => `/venues/${id}`,
  },

  // ======================================================
  // BOOKINGS
  // ======================================================
  BOOKING: {
    GET_SEATS: (showId) => `/bookings/seats/${showId}`,
    LOCK_SEATS: "/bookings/lock-seats",
    CREATE: "/bookings/create",
    GET: (bookingId) => `/bookings/${bookingId}`,
    GET_MY_BOOKINGS: "/bookings/my",
  },

  // ======================================================
  // PAYMENT
  // ======================================================
  PAYMENT: {
    CREATE_ORDER: "/payment/create-order",
    VERIFY: "/payment/verify",
    FAIL: "/payment/fail",
  },

  // ======================================================
  // ADMIN
  // ======================================================
  ADMIN: {
    // ================= DASHBOARD =================
    STATS: "/admin/stats",

    CREATE: "/admin/city/create",
    GET_ALL_CITIES: "/admin/cities",
    DEACTIVATE: (id) => `/admin/city/deactivate/${id}`,
    ACTIVATE: (id) => `/admin/city/activate/${id}`,

    // ================= ORGANIZERS =================
    GET_PENDING_ORGANIZERS:
      "/admin/organizers/pending",

    APPROVE_ORGANIZER: (id) =>
      `/admin/organizers/${id}/approve`,

    REJECT_ORGANIZER: (id) =>
      `/admin/organizers/${id}/reject`,

    // ================= USERS =================
    USERS: "/admin/users",

    GET_ALL_USERS: "/admin/users",

    BLOCK_USER: (id) =>
      `/admin/users/${id}/block`,

    UNBLOCK_USER: (id) =>
      `/admin/users/${id}/unblock`,

    // ================= SHOWS =================
    SHOWS: "/admin/shows",

    GET_ALL_SHOWS: "/admin/shows",

    DELETE_SHOW: (id) =>
      `/admin/shows/${id}`,

    // ================= PENDING SHOWS =================
    GET_PENDING_SHOWS:
      "/admin/shows/pending",

    APPROVE_SHOW: (id) =>
      `/admin/shows/${id}/approve`,

    REJECT_SHOW: (id) =>
      `/admin/shows/${id}/reject`,

    // ================= CITIES =================
    CITIES: "/admin/cities",

    GET_CITIES: "/admin/cities",

    // ================= VENUES =================
    VENUES: {
      PENDING: "/admin/venues/pending",

      ALL: "/admin/venues",

      APPROVED: "/admin/venues/approved",

      REJECTED: "/admin/venues/rejected",

      BY_ID: (id) =>
        `/admin/venues/${id}`,

      APPROVE: (id) =>
        `/admin/venues/${id}/approve`,

      REJECT: (id) =>
        `/admin/venues/${id}/reject`,

      DELETE: (id) =>
        `/admin/venues/${id}`,
    },

    // FLAT VENUE APIS
    GET_PENDING_VENUES:
      "/admin/venues/pending",

    APPROVE_VENUE: (id) =>
      `/admin/venues/${id}/approve`,

    REJECT_VENUE: (id) =>
      `/admin/venues/${id}/reject`,

    // ================= TRANSACTIONS =================
    TRANSACTIONS: "/admin/transactions",

    GET_TRANSACTIONS:
      "/admin/transactions",

    // ================= REVENUE =================
    REVENUE: "/admin/revenue",

    // ================= ANALYTICS =================
    REVENUE_TRENDS:
      "/admin/analytics/revenue-trends",

    GET_REVENUE_TRENDS:
      "/admin/analytics/revenue-trends",

    TOP_CONTENT:
      "/admin/analytics/top-content",

    GET_TOP_CONTENT:
      "/admin/analytics/top-content",
  },

  // ======================================================
  // ORGANIZER
  // ======================================================
  ORGANIZER: {
    DASHBOARD: "/organizer/dashboard",

    SHOWS: {
      CREATE: "/organizer/shows/create",

      GET_MY: "/organizer/shows",

      UPDATE: (id) =>
        `/organizer/shows/${id}`,

      DELETE: (id) =>
        `/organizer/shows/${id}`,

      PUBLISH: (id) =>
        `/organizer/shows/${id}/publish`,

      // UPCOMING:
      //   "/organizer/shows/upcoming",
    },

    VENUES: {
      CREATE: "/organizer/venues/create",

      GET_MY: "/organizer/venues",

      UPDATE: (id) =>
        `/organizer/venues/${id}`,
    },

    BOOKINGS: {
      RECENT:
        "/organizer/bookings/recent",
    },

    ANALYTICS: {
      REVENUE:
        "/organizer/analytics/revenue",
    },
  },
};