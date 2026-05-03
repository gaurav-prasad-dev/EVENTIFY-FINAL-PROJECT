import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

// ================= GET CITIES =================
export const getCitiesApi = async () => {
  const res = await apiClient.get(
    ENDPOINTS.ADMIN.GET_ALL_CITIES
  );

  console.log("Get cities", res.data);
  return res.data;
};

// ================= CREATE CITY =================
export const createCityApi = async (data) => {
  const res = await apiClient.post(
    ENDPOINTS.ADMIN.CREATE,
    data
  );
  
  return res.data;
};

// ================= ACTIVATsE =================
export const activateCityApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.ACTIVATE(id)
  );
  return res.data;
};

// ================= DEACTIVATE =================
export const deactivateCityApi = async (id) => {
  const res = await apiClient.patch(
    ENDPOINTS.ADMIN.DEACTIVATE(id)
  );
  return res.data;
};