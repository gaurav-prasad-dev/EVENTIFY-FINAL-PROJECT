const Content = require("../models/Content");

const {
  searchMovies,
  getMovieDetailsTime,
  getMovieVideos,
  getGenres,
  getNowPlaying,
  getPopular,
  getUpcoming,
  getMovieCredits,
  getMovieReviews,
  getMovieImages,
} = require("../services/tmdbService");

// =====================================
// FORMAT MOVIE (TMDB → UI STANDARD)
// =====================================
const formatMovie = (movie) => ({
  id: movie.id,
  tmdbId: movie.tmdbId,
  title: movie.title,
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
  genres: movie.genres?.map((g) => g.name) || [],
  runtime: movie.runtime,
  certification: movie.adult ? "A" : "U/A",
});

// =====================================
// HOME DATA (MOVIES ONLY)
// =====================================
exports.getHomeData = async (req, res) => {
  try {
    const [nowPlaying, popular, upcoming] = await Promise.all([
      getNowPlaying(),
      getPopular(),
      getUpcoming(),
    ]);

    return res.status(200).json({
      success: true,
      nowPlaying: nowPlaying.map(formatMovie),
      popular: popular.map(formatMovie),
      upcoming: upcoming.map(formatMovie),
    });

  } catch (error) {
    console.log("HOME ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch home data",
    });
  }
};

// =====================================
// SEARCH MOVIES (TMDB ONLY)
// =====================================
exports.search = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const movies = await searchMovies(query);

    return res.status(200).json({
      success: true,
      data: movies.map(formatMovie),
    });

  } catch (error) {
    console.log("SEARCH ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error searching movies",
    });
  }
};

// =====================================
// MOVIE DETAILS
// =====================================
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [movieData, credits, reviews, images] = await Promise.all([
      getMovieDetailsTime(id),
      getMovieCredits(id),
      getMovieReviews(id),
      getMovieImages(id),
    ]);

    return res.status(200).json({
      success: true,
      movie: formatMovie(movieData),
      cast: credits.cast?.slice(0, 10) || [],
      crew: credits.crew?.slice(0, 5) || [],
      reviews: reviews?.slice(0, 5) || [],
      posters: images.posters?.slice(0, 6) || [],
    });

  } catch (error) {
    console.log("DETAIL ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching movie details",
    });
  }
};

// =====================================
// MOVIE VIDEOS
// =====================================
exports.getVideos = async (req, res) => {
  try {
    const { id } = req.params;

    const videos = await getMovieVideos(id);

    const trailer = videos.find(
      (v) => v.type === "Trailer" && v.site === "YouTube"
    );

    return res.status(200).json({
      success: true,
      data: {
        videos,
        trailer,
      },
    });

  } catch (error) {
    console.log("VIDEO ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching videos",
    });
  }
};

// =====================================
// GENRES
// =====================================
exports.getAllGenres = async (req, res) => {
  try {
    const genres = await getGenres();

    return res.status(200).json({
      success: true,
      data: genres,
    });

  } catch (error) {
    console.log("GENRE ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching genres",
    });
  }
};

// =====================================
// CREATE CONTENT (DB - MOVIE / EVENT)
// =====================================
exports.createContent = async (req, res) => {
  try {
    const {
      title,
      type,
      description,
      duration,
      languages,
      genres,
      releaseDate,
      poster,
      trailerUrl,
      tmdbId,
    } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required",
      });
    }

    const existing = await Content.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      type,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Content already exists",
      });
    }

    const content = await Content.create({
      title,
      type,
      description,
      duration,
      languages,
      genres,
      releaseDate,
      poster,
      trailerUrl,
      tmdbId,
      isActive: true,
      approvalStatus: "approved",
    });

    return res.status(201).json({
      success: true,
      data: content,
    });

  } catch (error) {
    console.log("CREATE CONTENT ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating content",
    });
  }
};