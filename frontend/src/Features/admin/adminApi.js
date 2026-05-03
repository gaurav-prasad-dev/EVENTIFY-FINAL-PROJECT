import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// ======================================================
// 📊 DASHBOARD
// ======================================================
export const getAdminStatsApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ADMIN.STATS);
  return res.data;
};

// ======================================================
// 👥 ORGANIZERS
// ======================================================
export const getPendingOrganizersApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_PENDING_ORGANIZERS
  );
  return res.data;
};

export const approveOrganizerApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.APPROVE_ORGANIZER(id)
  );
  return res.data;
};

export const rejectOrganizerApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.REJECT_ORGANIZER(id)
  );
  return res.data;
};

// ======================================================
// 👤 USERS
// ======================================================
export const getAllUsersApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ADMIN.GET_ALL_USERS);
  return res.data;
};

export const blockUserApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.BLOCK_USER(id)
  );
  return res.data;
};

export const unblockUserApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.UNBLOCK_USER(id)
  );
  return res.data;
};

// ======================================================
// 🎬 SHOWS
// ======================================================
export const getAllShowsApi = async () => {
  const res = await apiClient.get(ENDPOINTS.ADMIN.GET_ALL_SHOWS);
  return res.data;
};

export const deleteShowApi = async (id) => {
  const res = await apiClient.delete(
    ENDPOINTS.ADMIN.DELETE_SHOW(id)
  );
  return res.data;
};

// ======================================================
// 🏢 VENUES
// ======================================================
export const getPendingVenuesApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_PENDING_VENUES
  );
  return res.data;
};

export const approveVenueApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.APPROVE_VENUE(id)
  );
  return res.data;
};

export const rejectVenueApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.REJECT_VENUE(id)
  );
  return res.data;
};

// ======================================================
// 💳 TRANSACTIONS
// ======================================================
export const getTransactionsApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_TRANSACTIONS
  );
  return res.data;
};

// ======================================================
// 📈 ANALYTICS
// ======================================================
export const getRevenueTrendsApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_REVENUE_TRENDS
  );
  return res.data;
};

export const getTopContentApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_TOP_CONTENT
  );
  return res.data;
};

export const approveShowApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.SHOWS.APPROVE(id)
  );

  return res.data;
};

export const rejectShowApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.SHOWS.REJECT(id)
  );

  return res.data;
};

export const getPendingShowsApi =
  async () => {
    const res = await apiClient.get(
      ENDPOINTS.SHOWS.GET_PENDING
    );

    return res.data;
};