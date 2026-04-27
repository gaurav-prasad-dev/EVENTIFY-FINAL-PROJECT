const tmdbClient = require("../utils/tmdbClient");

exports.getNowPlaying = async() =>{
    try{
        const res = await tmdbClient.get("/movie/now_playing",{
            params:{
                region:"IN",
                page:1,
            }
        }
        )

        return res.data.results;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
}


exports.getPopular = async() =>{
    try{
        const res = await tmdbClient.get("/movie/popular",{
            params:{
                region:"IN",
                page:1,
            }
        }
        )

        return res.data.results;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
}



exports.getUpcoming = async() =>{
    try{
        const res = await tmdbClient.get("/movie/upcoming",{
            params:{
                region:"IN",
                page:1,
            }
        }
        )

        return res.data.results;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
}


exports.searchMovies= async(query) =>{
    try{
        const res = await tmdbClient.get("/search/movie",{
            params:{
                query,
            },
        }
        );

        return res.data.results;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
}


exports.getMovieDetailsTime = async (movieId) => {
  try {
    const res = await tmdbClient.get(`/movie/${movieId}`, {
      params: {
        append_to_response: "videos,credits,reviews,images",
      },
    });

    return res.data;
  } catch (error) {
    console.log("TMDB Error:", error.message);
    throw error;
  }
};

exports.getMovieVideos = async(movieId) =>{
    try{
        const res = await tmdbClient.get(`/movie/${movieId}/videos`);
        

        return res.data.results;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
}

exports.getGenres = async() =>{
    try{
        const res = await tmdbClient.get(`/genre/movie/list`);
        

        return res.data.genres;

    }catch(error){
        console.log("TMDB Error:", error.message);
    throw error;

    }
};

exports.getMovieCredits = async (movieId) => {
  const res = await tmdbClient.get(`/movie/${movieId}/credits`);
  return res.data;
};

exports.getMovieReviews = async (movieId) => {
  const res = await tmdbClient.get(`/movie/${movieId}/reviews`);
  return res.data.results;
};

exports.getMovieImages = async (movieId) => {
  const res = await tmdbClient.get(`/movie/${movieId}/images`);
  return res.data;
};