const { searchMovies, getMovieDetailsTime,getMovieVideos,getGenres, getNowPlaying, getPopular, getUpcoming, getMovieCredits,
  getMovieReviews,
  getMovieImages,} = require("../services/tmdbService");

 const formatMovie = (movie) => ({
    id: movie.id,
    title:movie.title,
     poster: movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null,

  backdrop: movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null,
language: movie.original_language,
    rating: movie.vote_average?.toFixed(1),
    releaseDate: movie.release_date,
    overview: movie.overview,
    genres: movie.genres?.map(g => g.name) || [],
    runtime: movie.runtime,
     certification: movie.adult ? "A" : "U/A", // ✅ send this
     
 })
exports.getHomeData = async(req,res) => {
    try{

        const[nowPlaying, popular,upcoming] = await Promise.all([
            getNowPlaying(),
            getPopular(),
            getUpcoming(),

        
        ])
            return res.status(200).json({
                success:true,
                nowPlaying: nowPlaying.map(formatMovie), 
                popular: popular.map(formatMovie), 
                upcoming:  upcoming.map(formatMovie), 
            });
      
    
    }catch(error){
          console.log("HOME ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch home data",
    });

    }
}

exports.search = async(req,res) => {
    try{

        const {query} = req.query;

        if(!query){
             return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
        }

        const movies = await searchMovies(query);

            return res.status(200).json({
      success: true,
      movies: movies.map(formatMovie),
    });

    }catch(error){

        console.log("SEARCH ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error searching movies",
    });


    }
}

exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [movieData, credits, reviews, images] = await Promise.all([
      getMovieDetailsTime(id),
      getMovieCredits(id),
      getMovieReviews(id),
      getMovieImages(id),
    ]);

    const movie = formatMovie(movieData);

    return res.status(200).json({
      success: true,
      movie,
      cast: credits.cast.slice(0, 10), // 👈 top 10 cast
      crew: credits.crew.slice(0, 5),
      reviews: reviews.slice(0, 5),
      posters: images.posters.slice(0, 6),
    });

  } catch (error) {
    console.log("DETAIL ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching movie details",
    });
  }
};


exports.getVideos = async(req,res) => {
    try{
        const { id } = req.params;

        const videos = await getMovieVideos(id);

        //get tariler only
        const trailer = videos.find(
            (v) => v.type === "Trailer" && v.site === "YouTube"
        );

        return res.status(200).json({
            success:true,
            videos,
            trailer,
        })

    }catch(error){
         console.log("VIDEO ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching videos",
    });

    }
}

exports.getAllGenres = async(req,res) =>{
    try{

        const genres = await getGenres();

        return res.status(200).json({
            success:true,
            genres,
        });

    }catch(error){

            console.log("GENRE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching genres",
    });

    }
}