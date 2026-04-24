import { apiConnector } from "../../services/apiConnector";
import { eventEndpoints } from "../../services/apis";


const { GET_EVENTS_API} = eventEndpoints;

export const getEventData = async() => {
    try{

        const res = await apiConnector("GET", GET_EVENTS_API);
        return res.data;

    }catch(error){
           console.log("GET Events ERROR:", error);
  throw error; // 🔥 important
    }
}