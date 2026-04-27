import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const { GET_EVENTS } = ENDPOINTS.EVENTS;

export const getEventData = async () => {
  try {
    const res = await apiClient.get(GET_EVENTS);
    return res.data;
  } catch (error) {
    console.log("GET EVENTS ERROR:", error);
    throw error;
  }
};