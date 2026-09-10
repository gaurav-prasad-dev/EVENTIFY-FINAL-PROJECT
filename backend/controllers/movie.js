const mongoose = require("mongoose");
const Content = require("../models/Content");
const Show = require("../models/Show");

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
// DEFAULT CURATED MOVIES (AUTO-SEED)
// =====================================
const DEFAULT_CATALOG_MOVIES = [
  {
    title: "Dune: Part Two",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 693134,
    description: "Follow the mythic journey of Paul Atreides as he unites with Chani and the Fremen while on a path of revenge against the conspirators who destroyed his family.",
    duration: 166,
    languages: ["Hindi", "English"],
    genres: ["Action", "Adventure", "Sci-Fi"],
    releaseDate: new Date("2024-03-01"),
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5200bm.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=Way9Dexny3w",
    rating: "8.4",
    isFeatured: true,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Interstellar",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 157336,
    description: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel and conquer the vast distances involved in an interstellar voyage.",
    duration: 169,
    languages: ["English", "Hindi"],
    genres: ["Adventure", "Drama", "Sci-Fi"],
    releaseDate: new Date("2014-11-05"),
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/xJHokMbljvjADYdit5fK5VQsXEG.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=zSWdZVtXT7E",
    rating: "8.6",
    isFeatured: true,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Oppenheimer",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 872585,
    description: "The story of J. Robert Oppenheimer's role in the development of the atomic bomb during World War II.",
    duration: 180,
    languages: ["English", "Hindi"],
    genres: ["Biography", "Drama", "History"],
    releaseDate: new Date("2023-07-21"),
    poster: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/fm6K9vYI0209YvB69NQJq9ENENP.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=uYPbbksJxIg",
    rating: "8.1",
    isFeatured: true,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 569094,
    description: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society.",
    duration: 140,
    languages: ["Hindi", "English"],
    genres: ["Animation", "Action", "Adventure"],
    releaseDate: new Date("2023-06-02"),
    poster: "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/4HodYYKEIsGOdinkGi2Ucz6X9i0.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=cqGjhVJWtEg",
    rating: "8.4",
    isFeatured: false,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Fighter",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 1022690,
    description: "Top IAF aviators come together in the face of imminent danger to form Air Dragons, giving their all for the nation while going through the highs and lows of their internal battles.",
    duration: 166,
    languages: ["Hindi"],
    genres: ["Action", "Thriller", "War"],
    releaseDate: new Date("2024-01-25"),
    poster: "https://image.tmdb.org/t/p/w500/zDZowwb9pYFz5k3d70Z5v0t2p5L.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/3P52oz9HPCSW7vBh0PpJbmuEjql.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=6amIq_OKP4k",
    rating: "7.6",
    isFeatured: true,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Inception",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 27205,
    description: "Cobb, a skilled thief who steals corporate secrets through the use of dream-sharing technology, is given the inverse task of planting an idea into the mind of a C.E.O.",
    duration: 148,
    languages: ["English", "Hindi"],
    genres: ["Action", "Sci-Fi", "Adventure"],
    releaseDate: new Date("2010-07-16"),
    poster: "https://image.tmdb.org/t/p/w500/ljsZTbVsrQSqZgWeep2B1QiDKuh.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=YoHD9XEInc0",
    rating: "8.4",
    isFeatured: true,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Stree 2",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 1159311,
    description: "After the events of Stree, the town of Chanderi is being haunted again. This time, women are mysteriously abducted by a terrifying headless entity.",
    duration: 147,
    languages: ["Hindi"],
    genres: ["Comedy", "Horror"],
    releaseDate: new Date("2024-08-15"),
    poster: "https://image.tmdb.org/t/p/w500/a267j541fU64pYjh4uP0z654a1n.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/mKOBErGAKUt7G7BqH9J5mE9C0W4.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=78mKq5qjP0A",
    rating: "7.8",
    isFeatured: false,
    isActive: true,
    createdByRole: "organizer",
  },
  {
    title: "Jawan",
    type: "movie",
    sourceType: "tmdb",
    tmdbId: 872906,
    description: "A high-octane action thriller which outlines the emotional journey of a man who is set to rectify the wrongs in the society.",
    duration: 169,
    languages: ["Hindi", "Tamil", "Telugu"],
    genres: ["Action", "Thriller"],
    releaseDate: new Date("2023-09-07"),
    poster: "https://image.tmdb.org/t/p/w500/jNQfW00d5yHnQvL56xPzP5Z3W2v.jpg",
    backdrop: "https://image.tmdb.org/t/p/original/b9UCf9AcAeqB2i148585y688N5.jpg",
    trailerUrl: "https://www.youtube.com/watch?v=MWOlnZSnXWE",
    rating: "7.9",
    isFeatured: false,
    isActive: true,
    createdByRole: "organizer",
  },
];

// Seed helper
const ensureCatalogSeeded = async () => {
  try {
    const count = await Content.countDocuments({ type: "movie" });
    if (count === 0) {
      console.log("Seeding default platform catalog movies...");
      await Content.insertMany(DEFAULT_CATALOG_MOVIES);
    }
  } catch (err) {
    console.error("CATALOG SEED ERROR:", err.message);
  }
};

// =====================================
// FORMAT DB CONTENT (UI STANDARD)
// =====================================
const formatDbMovie = (movie) => ({
  id: movie._id ? movie._id.toString() : String(movie.tmdbId || ""),
  _id: movie._id ? movie._id.toString() : null,
  tmdbId: movie.tmdbId || null,
  title: movie.title,
  poster: movie.poster || "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80",
  backdrop: movie.backdrop || movie.poster || null,
  language: movie.languages?.[0] || "Hindi",
  languages: movie.languages || ["Hindi"],
  rating: movie.rating || (movie.tmdbId ? "8.2" : "8.0"),
  releaseDate: movie.releaseDate,
  overview: movie.description || "",
  genres: movie.genres || [],
  runtime: movie.duration || 140,
  duration: movie.duration || 140,
  certification: movie.certification || "UA16+",
  adult: false,
  isFeatured: Boolean(movie.isFeatured),
  trailerUrl: movie.trailerUrl || null,
});

// Format external TMDB movie
const formatTmdbMovie = (movie) => ({
  id: movie.id,
  tmdbId: movie.id,
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
// HOME DATA (ORGANIZER MOVIES ONLY)
// =====================================
exports.getHomeData = async (req, res) => {
  try {
    // 1. Ensure seed movies if catalog empty
    await ensureCatalogSeeded();

    // 2. Find content IDs that have shows created by organizers
    const organizerShowContentIds = await Show.distinct("content", {
      organizerId: { $exists: true, $ne: null },
    });

    // 3. Query ONLY movies made by organizers OR having organizer shows
    const allMovies = await Content.find({
      type: "movie",
      isActive: true,
      $or: [
        { createdByRole: "organizer" },
        { _id: { $in: organizerShowContentIds } },
      ],
    }).sort({ createdAt: -1 });

    // 4. Find movies with active shows
    const activeShowContentIds = await Show.distinct("content", {
      status: "Active",
    });
    const activeSet = new Set(activeShowContentIds.map((id) => id.toString()));

    // Split movies into rows
    // nowPlaying: Movies with active shows or first half of active catalog
    let nowPlaying = allMovies.filter((m) => activeSet.has(m._id.toString()));
    if (nowPlaying.length === 0) {
      nowPlaying = allMovies.slice(0, 5);
    }

    // popular: Movies with isFeatured === true or top rated
    let popular = allMovies.filter((m) => m.isFeatured);
    if (popular.length === 0) {
      popular = allMovies.slice(2, 7);
    }

    // upcoming: remaining or future releases
    let upcoming = allMovies.filter((m) => !m.isFeatured && !activeSet.has(m._id.toString()));
    if (upcoming.length === 0) {
      upcoming = allMovies.slice(4);
    }
    if (upcoming.length === 0) {
      upcoming = allMovies;
    }

    // Top featured movie for hero banner
    const heroMovie = allMovies.find((m) => m.isFeatured) || allMovies[0];

    return res.status(200).json({
      success: true,
      nowPlaying: nowPlaying.map(formatDbMovie),
      popular: popular.map(formatDbMovie),
      upcoming: upcoming.map(formatDbMovie),
      all: allMovies.map(formatDbMovie),
      heroMovie: heroMovie ? formatDbMovie(heroMovie) : null,
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
// SEARCH MOVIES (TMDB ONLY - FOR ORGANIZERS / ADMINS)
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
      data: movies.map(formatTmdbMovie),
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
// MOVIE DETAILS (DB FIRST -> TMDB ENRICHMENT)
// =====================================
exports.getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Look for movie in Content collection
    let content = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      content = await Content.findById(id);
    }
    if (!content && !isNaN(Number(id))) {
      content = await Content.findOne({ tmdbId: Number(id) });
    }

    // 2. If content found in DB
    if (content) {
      let cast = [];
      let crew = [];
      let reviews = [];
      let posters = [];
      let tmdbData = null;

      // If it has tmdbId, enrich with cast, crew, reviews from TMDB
      if (content.tmdbId) {
        try {
          const [credits, revs, imgs, details] = await Promise.allSettled([
            getMovieCredits(content.tmdbId),
            getMovieReviews(content.tmdbId),
            getMovieImages(content.tmdbId),
            getMovieDetailsTime(content.tmdbId),
          ]);

          if (credits.status === "fulfilled") {
            cast = credits.value.cast?.slice(0, 10) || [];
            crew = credits.value.crew?.slice(0, 5) || [];
          }
          if (revs.status === "fulfilled") {
            reviews = revs.value?.slice(0, 5) || [];
          }
          if (imgs.status === "fulfilled") {
            posters = imgs.value.posters?.slice(0, 6) || [];
          }
          if (details.status === "fulfilled") {
            tmdbData = details.value;
          }
        } catch (tmdbErr) {
          console.log("TMDB Enrichment optional error:", tmdbErr.message);
        }
      }

      return res.status(200).json({
        success: true,
        movie: {
          id: content._id.toString(),
          _id: content._id.toString(),
          tmdbId: content.tmdbId || null,
          title: content.title,
          poster: content.poster || (tmdbData?.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : null),
          backdrop: content.backdrop || (tmdbData?.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbData.backdrop_path}` : content.poster),
          language: content.languages?.[0] || tmdbData?.original_language || "Hindi",
          languages: content.languages || ["Hindi"],
          rating: content.rating || tmdbData?.vote_average?.toFixed(1) || "8.2",
          releaseDate: content.releaseDate || tmdbData?.release_date,
          overview: content.description || tmdbData?.overview || "",
          genres: content.genres?.length ? content.genres : (tmdbData?.genres?.map((g) => g.name) || []),
          runtime: content.duration || tmdbData?.runtime || 140,
          duration: content.duration || tmdbData?.runtime || 140,
          certification: "UA16+",
          trailerUrl: content.trailerUrl || null,
        },
        cast,
        crew,
        reviews,
        posters,
      });
    }

    // 3. Fallback to TMDB directly if not found in DB (e.g. previewing TMDB before import)
    const [movieData, credits, reviews, images] = await Promise.all([
      getMovieDetailsTime(id),
      getMovieCredits(id),
      getMovieReviews(id),
      getMovieImages(id),
    ]);

    return res.status(200).json({
      success: true,
      movie: formatTmdbMovie(movieData),
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

    // Check DB first
    let content = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      content = await Content.findById(id);
    }
    if (!content && !isNaN(Number(id))) {
      content = await Content.findOne({ tmdbId: Number(id) });
    }

    const tmdbIdToQuery = content?.tmdbId || id;

    // Try TMDB videos
    try {
      const videos = await getMovieVideos(tmdbIdToQuery);
      const trailer = videos.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );

      if (trailer || videos.length > 0) {
        return res.status(200).json({
          success: true,
          data: {
            videos,
            trailer: trailer || videos[0],
          },
        });
      }
    } catch (e) {
      console.log("TMDB Videos lookup error, trying DB fallback:", e.message);
    }

    // Fallback to content.trailerUrl if stored
    if (content?.trailerUrl) {
      const match = content.trailerUrl.match(/(?:v=|\/embed\/|\.be\/)([\w-]{11})/);
      const key = match ? match[1] : null;

      if (key) {
        return res.status(200).json({
          success: true,
          data: {
            videos: [{ key, name: `${content.title} Official Trailer`, site: "YouTube", type: "Trailer" }],
            trailer: { key, name: `${content.title} Official Trailer`, site: "YouTube", type: "Trailer" },
          },
        });
      }
    }

    return res.status(200).json({
      success: true,
      data: { videos: [], trailer: null },
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