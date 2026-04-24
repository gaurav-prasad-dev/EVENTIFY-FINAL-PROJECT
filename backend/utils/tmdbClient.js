const axios = require("axios");

const { BASE_URL, API_KEY } = require("../config/tmdbConfig");

const tmdbClient = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    params:{
        api_key: API_KEY,
    }
});


module.exports = tmdbClient;