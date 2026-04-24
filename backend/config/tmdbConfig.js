const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_CONFIG = {
    BASE_URL,
    API_KEY: process.env.TMDB_API_KEY,
    IMAGE_BASE_URL: "https://image.tmdb.org/t/p/w500",

};

module.exports = TMDB_CONFIG;