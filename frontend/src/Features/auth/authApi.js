import { apiConnector } from "../../services/apiConnector";
import { authEndpoints } from "../../services/apis";

const { SEND_OTP_API,VERIFY_OTP_API,GOOGLE_LOGIN_API, LOGOUT_API} = authEndpoints;

export const sendOtpApi = async(data) => {
    try{

        const res = await apiConnector("POST", SEND_OTP_API,data);
        return res.data;

    }catch(error){
         console.log("GET CITIES ERROR:", error);

    }
}

export const verifyOtpApi = async(data) => {
    try{

        const res = await apiConnector("POST", VERIFY_OTP_API,data);
        return res.data;

    }catch(error){
         console.log("GET CITIES ERROR:", error);

    }
}

export const googleLoginApi = async(data) => {
    try{

        const res = await apiConnector("POST", GOOGLE_LOGIN_API,data);
        return res.data;

    }catch(error){
         console.log("GET CITIES ERROR:", error);

    }
}


export const logoutUser = async() => {
    try{
        const res = await apiConnector("POST",LOGOUT_API,{},{ withCredentials: true})

       
         return res.data;
        
    }catch(error){
         console.log("LOGOUT ERROR:", error);
    throw error;

    }
}

