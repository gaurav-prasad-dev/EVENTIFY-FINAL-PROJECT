import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const { GET_ALL } = ENDPOINTS.CITY;

export const getCities = async () => {
  try {
    const res = await apiClient.get(GET_ALL);
    return res.data;
  } catch (error) {
    console.log("GET CITIES ERROR:", error);
    throw error;
  }
};