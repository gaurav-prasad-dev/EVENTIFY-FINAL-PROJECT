import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    withCredentials:true,
})


// Api Connector

export const apiConnector =(
    method,
    url,
    bodyData = null,
    headers = {},
    params = {},
    config={}
) => {
    return axiosInstance({
        method,
        url,
        data: bodyData,
        headers,
        params,
        ...config
    });
};

// interceptor
axiosInstance.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// response interceptors

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>{
        console.log("API ERROR:", error.response?.data || error.message);

    if(error.response?.status === 401){
        localStorage.removeItem("token");
    }

    return Promise.reject(error);
}

)
