// ======================================================
// 📁 src/Features/admin/AdminContentApi.js
// ======================================================

import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// ======================================================
// 📥 GET ALL CONTENT
// ======================================================

// ======================================================
// 🎬 SEARCH TMDB MOVIES
// ======================================================
export const searchTmdbMoviesApi = async (query) => {
  const res = await apiClient.get(
    `/movies/search?query=${query}`
  );

  return res.data;
};

// ======================================================
// 🎬 CREATE CONTENT FROM TMDB
// ======================================================
export const createFromTmdbApi = async (tmdbId) => {
  const res = await apiClient.post(
    "/content/tmdb",
    { tmdbId }
  );

  return res.data;
};



export const getAllContentApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.CONTENT.GET_ALL
  );

  return res.data;
};

// ======================================================
// 📥 GET SINGLE CONTENT
// ======================================================
export const getContentByIdApi = async (id) => {
  const res = await apiClient.get(
    ENDPOINTS.CONTENT.GET_BY_ID(id)
  );

  return res.data;
};

// ======================================================
// ➕ CREATE CONTENT
// ======================================================
export const createContentApi = async (data) => {
  const res = await apiClient.post(
    ENDPOINTS.CONTENT.CREATE,
    data
  );

  return res.data;
};

// ======================================================
// ✏️ UPDATE CONTENT
// ======================================================
export const updateContentApi = async (id, data) => {
  const res = await apiClient.put(
    ENDPOINTS.CONTENT.UPDATE(id),
    data
  );

  return res.data;
};

// ======================================================
// ❌ DELETE CONTENT
// ======================================================
export const deleteContentApi = async (id) => {
  const res = await apiClient.delete(
    ENDPOINTS.CONTENT.DELETE(id)
  );

  return res.data;
};

// ======================================================
// ⭐ FEATURE CONTENT
// ======================================================
export const featureContentApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.CONTENT.FEATURE(id)
  );

  return res.data;
};

// ======================================================
// 🚫 UNFEATURE CONTENT
// ======================================================
export const unfeatureContentApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.CONTENT.UNFEATURE(id)
  );

  return res.data;
};

// ======================================================
// 🔍 SEARCH CONTENT
// ======================================================
export const searchContentApi = async (query) => {
  const res = await apiClient.get(
    `${ENDPOINTS.CONTENT.SEARCH}?query=${query}`
  );

  return res.data;
};