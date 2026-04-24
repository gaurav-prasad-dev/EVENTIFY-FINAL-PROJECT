import { apiConnector } from "../../services/apiConnector";
import { cityEndpoints } from "../../services/apis";


const { GET_CITIES_API } = cityEndpoints;


export const getCities = async() => {
    try{

        const res = await apiConnector("GET", GET_CITIES_API);
        return res;

    }catch(error){
         console.log("GET CITIES ERROR:", error);

    }
}