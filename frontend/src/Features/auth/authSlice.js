import { createSlice } from "@reduxjs/toolkit";

const getSavedAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth")) || null;
  } catch {
    return null;
  }
};

const savedAuth = getSavedAuth();
const initialToken = savedAuth?.token || savedAuth?.accessToken || null;

const initialState = {
  user: savedAuth?.user || null,
  token: initialToken,
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  openLogin: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const payloadToken =
        action.payload.token || action.payload.accessToken || null;

      state.user = action.payload.user;
      state.token = payloadToken;
      state.accessToken = payloadToken;
      state.isAuthenticated = !!payloadToken;

      localStorage.setItem(
        "auth",
        JSON.stringify({
          user: action.payload.user,
          token: payloadToken,
          accessToken: payloadToken,
        })
      );
    },

    updateAccessToken: (state, action) => {
      const newToken = action.payload;
      state.token = newToken;
      state.accessToken = newToken;
      state.isAuthenticated = !!newToken;

      const saved = getSavedAuth() || {};
      saved.token = newToken;
      saved.accessToken = newToken;
      localStorage.setItem("auth", JSON.stringify(saved));
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.accessToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("auth");
    },

    setOpenLogin: (state, action) => {
      state.openLogin = action.payload;
    },
  },
});

export const {
  setCredentials,
  updateAccessToken,
  logout,
  setOpenLogin,
} = authSlice.actions;

export default authSlice.reducer;