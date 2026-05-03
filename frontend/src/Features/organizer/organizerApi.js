import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// ================= SHOW =================

export const createShowApi = async (data) => {
  const res = await apiClient.post(
    ENDPOINTS.ORGANIZER.SHOWS.CREATE,
    data
  );
  return res.data;
};

export const getOrganizerStatsApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ORGANIZER.DASHBOARD);
  return res.data;
};

export const getRecentBookingsApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ORGANIZER.RECENT_BOOKINGS);
  return res.data;
};

export const getUpcomingShowsApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ORGANIZER.UPCOMING_SHOWS);
  return res.data;
};

export const getMyShowsApi = async () => {
   console.log("GET MY SHOWS URL:", ENDPOINTS.ORGANIZER.SHOWS.GET_MY);
    console.log("GET MY SHOWS URL:", ENDPOINTS.ORGANIZER.SHOWS.GET_MY);
  const res = await apiClient.get(ENDPOINTS.ORGANIZER.SHOWS.GET_MY);
  return res.data;
};

export const deleteShowApi = async (id) => {
  const res = await apiClient.delete(
    ENDPOINTS.ORGANIZER.DELETE_SHOW(id)
  );
  return res.data;
};

export const updateShowApi = async (id, data) => {
  const res = await apiClient.put(
    ENDPOINTS.ORGANIZER.UPDATE_SHOW(id),
    data
  );
  return res.data;
};

export const publishShowApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ORGANIZER.PUBLISH(id)
  );
  return res.data;
};

export const getRevenueAnalyticsApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ORGANIZER.GET_REVENUE_ANALYTICS
  );
  return res.data;
};

export const getMyVenuesApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ORGANIZER.GET_MY_VENUES
  );
  return res.data;
};