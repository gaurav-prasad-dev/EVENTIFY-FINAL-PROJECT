import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";

import {
  fetchContent,
  createContent,
  deleteContent,
  featureContent,
  unfeatureContent,
  searchTmdbMovies,
  createFromTmdb,
  clearTmdbMovies,
} from "../../Features/admin/contentSlice";

import {
  FaSearch,
  FaStar,
  FaTrash,
  FaPlus,
  FaFilm,
  FaCalendarAlt,
  FaClock,
  FaTimes,
  FaGlobe,
} from "react-icons/fa";

const Content = () => {
  const dispatch = useDispatch();

  const {
    contents,
    tmdbMovies,
    loading,
  } = useSelector((state) => state.content);

  // ======================================================
  // STATES
  // ======================================================
  const [activeTab, setActiveTab] = useState("tmdb"); // "tmdb" | "manual"
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all" | "movie" | "event" | "featured"
  const [movieSearch, setMovieSearch] = useState("");
  const [addingTmdbId, setAddingTmdbId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    type: "event",
    description: "",
    duration: "",
    genres: "",
    languages: "",
    poster: "",
    trailerUrl: "",
    releaseDate: "",
  });

  // ======================================================
  // FETCH CONTENT
  // ======================================================
  useEffect(() => {
    dispatch(fetchContent());
  }, [dispatch]);

  // ======================================================
  // FILTER CONTENT
  // ======================================================
  const filteredContent = useMemo(() => {
    return contents.filter((item) => {
      const matchesSearch =
        item.title?.toLowerCase().includes(search.toLowerCase()) ||
        item.genres?.some((g) => g.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (filterType === "all") return true;
      if (filterType === "movie") return item.type === "movie";
      if (filterType === "event") return item.type === "event";
      if (filterType === "featured") return !!item.isFeatured;
      return true;
    });
  }, [contents, search, filterType]);

  const movieCount = useMemo(
    () => contents.filter((c) => c.type === "movie").length,
    [contents]
  );
  const eventCount = useMemo(
    () => contents.filter((c) => c.type === "event").length,
    [contents]
  );
  const featuredCount = useMemo(
    () => contents.filter((c) => c.isFeatured).length,
    [contents]
  );

  // ======================================================
  // EVENT / MOVIE CREATE (MANUAL)
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        duration: formData.duration ? Number(formData.duration) : undefined,
        genres: formData.genres
          ? formData.genres.split(",").map((g) => g.trim()).filter(Boolean)
          : [],
        languages: formData.languages
          ? formData.languages.split(",").map((l) => l.trim()).filter(Boolean)
          : [],
      };

      await dispatch(createContent(payload)).unwrap();

      setFormData({
        title: "",
        type: "event",
        description: "",
        duration: "",
        genres: "",
        languages: "",
        poster: "",
        trailerUrl: "",
        releaseDate: "",
      });
      alert("Content created successfully! 🎉");
    } catch (err) {
      alert(err || "Failed to create content");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ======================================================
  // TMDB SEARCH
  // ======================================================
  const handleMovieSearch = (e) => {
    e?.preventDefault();
    if (!movieSearch.trim()) return;
    dispatch(searchTmdbMovies(movieSearch.trim()));
  };

  const handleAddTmdbMovie = async (movieId) => {
    setAddingTmdbId(movieId);
    try {
      await dispatch(createFromTmdb(movieId)).unwrap();
      dispatch(clearTmdbMovies());
      setMovieSearch("");
      alert("Movie imported to catalog successfully! 🎬");
    } catch (err) {
      alert(err || "Failed to import movie from TMDB");
    } finally {
      setAddingTmdbId(null);
    }
  };

  const handleDeleteContent = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title || "this content"}"?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await dispatch(deleteContent(id)).unwrap();
    } catch (err) {
      alert(err || "Failed to delete");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ====================================================== */}
        {/* TOP HEADER & QUICK STATS */}
        {/* ====================================================== */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Content Catalog Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Search TMDB database, add custom movies & live events, and manage featured promotions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FaFilm className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Movies</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{movieCount}</p>
              </div>
            </div>

            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FaCalendarAlt className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Events</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{eventCount}</p>
              </div>
            </div>

            <div className="bg-white px-4 py-2.5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                <FaStar className="text-lg" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Featured</p>
                <p className="text-lg font-bold text-gray-900 leading-tight">{featuredCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* CREATION CENTER (ACCORDION / TABBED MODAL CARD) */}
        {/* ====================================================== */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header Switcher */}
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-6 bg-purple-600 rounded-full inline-block" />
              <h2 className="text-xl font-bold text-gray-900">Add New Content</h2>
            </div>

            <div className="inline-flex bg-gray-100/80 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab("tmdb")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "tmdb"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaGlobe className="text-xs" />
                TMDB Movie Search
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("manual")}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                  activeTab === "manual"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaPlus className="text-xs" />
                Custom Movie / Event
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* TAB 1: TMDB SEARCH */}
            {activeTab === "tmdb" && (
              <div className="space-y-6">
                <form onSubmit={handleMovieSearch} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search TMDB movies by title (e.g. Oppenheimer, Interstellar, Leo)..."
                      value={movieSearch}
                      onChange={(e) => setMovieSearch(e.target.value)}
                      className="w-full pl-11 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                    />
                    {movieSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setMovieSearch("");
                          dispatch(clearTmdbMovies());
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-medium px-7 py-3 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
                  >
                    <FaSearch className="text-sm" />
                    Search TMDB
                  </button>
                </form>

                {/* TMDB Results Grid */}
                {tmdbMovies?.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-600">
                      Found {tmdbMovies.length} results from TMDB:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {tmdbMovies.map((movie) => {
                        const movieId = movie.id || movie.tmdbId;
                        const isAdding = addingTmdbId === movieId;
                        return (
                          <div
                            key={movieId}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                          >
                            <div className="relative h-60 bg-gray-100 overflow-hidden">
                              {movie.poster ? (
                                <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                                  <FaFilm className="text-4xl mb-2 opacity-40" />
                                  <span className="text-xs">No Poster</span>
                                </div>
                              )}
                              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5">
                                <FaStar className="text-yellow-400" />
                                <span>{movie.voteAverage ? Number(movie.voteAverage).toFixed(1) : "N/A"}</span>
                              </div>
                            </div>

                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div>
                                <h3 className="font-bold text-gray-900 line-clamp-1 text-base">
                                  {movie.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-1">
                                  Release: {movie.releaseDate || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                                  {movie.overview || "No description available."}
                                </p>
                              </div>

                              <button
                                type="button"
                                disabled={isAdding}
                                onClick={() => handleAddTmdbMovie(movieId)}
                                className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 ${
                                  isAdding
                                    ? "bg-purple-100 text-purple-600 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                                }`}
                              >
                                {isAdding ? (
                                  <>Importing...</>
                                ) : (
                                  <>
                                    <FaPlus className="text-xs" />
                                    Import to Catalog
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: MANUAL CREATION FORM */}
            {activeTab === "manual" && (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Type Selection */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Type:</span>
                  <div className="inline-flex bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "movie" })}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                        formData.type === "movie"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Movie
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, type: "event" })}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                        formData.type === "event"
                          ? "bg-purple-600 text-white shadow-sm"
                          : "text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Live Event
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Arijit Singh Live or Inception"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 150"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Release / Event Date
                    </label>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => setFormData({ ...formData, releaseDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Genres (Comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Action, Sci-Fi, Live Music"
                      value={formData.genres}
                      onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Languages (Comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Hindi, English"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Poster Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://image.tmdb.org/t/p/w500/... or image link"
                      value={formData.poster}
                      onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Trailer Video URL (YouTube embed or video URL)
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/watch?v=..."
                      value={formData.trailerUrl}
                      onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Description / Synopsis
                    </label>
                    <textarea
                      placeholder="Enter synopsis, cast highlights, or event schedule..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-8 py-3 rounded-xl transition shadow-sm flex items-center gap-2"
                  >
                    <FaPlus className="text-sm" />
                    {isSubmitting ? "Creating..." : "Save to Catalog"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* ====================================================== */}
        {/* CATALOG BROWSER & FILTER SECTION */}
        {/* ====================================================== */}
        <div className="space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Platform Catalog ({filteredContent.length})
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                Browse, feature, or remove movies & events currently saved in the database.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterType("all")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterType === "all"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                All ({contents.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("movie")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterType === "movie"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Movies ({movieCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("event")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterType === "event"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Events ({eventCount})
              </button>
              <button
                type="button"
                onClick={() => setFilterType("featured")}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filterType === "featured"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                Featured ({featuredCount})
              </button>
            </div>
          </div>

          {/* Search bar inside Catalog */}
          <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
            <FaSearch className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search catalog by title, genre, language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="text-gray-400 hover:text-gray-600 mr-2 text-xs"
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Grid View */}
          {loading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
              <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm">Loading catalog content...</p>
            </div>
          ) : filteredContent.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
              <FaFilm className="text-4xl mx-auto opacity-30" />
              <p className="font-semibold text-gray-700">No content found</p>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No items match your search or filter criteria. Try changing filters or importing from TMDB above.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent.map((item) => {
                const isDeleting = deletingId === item._id;
                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between group"
                  >
                    {/* Poster */}
                    <div className="relative h-64 overflow-hidden bg-gray-100">
                      {item.poster ? (
                        <img
                          src={item.poster}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                          <FaFilm className="text-4xl opacity-30 mb-2" />
                          <span className="text-xs">No Image Available</span>
                        </div>
                      )}

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                            item.type === "movie"
                              ? "bg-purple-600 text-white"
                              : "bg-emerald-600 text-white"
                          }`}
                        >
                          {item.type}
                        </span>
                      </div>

                      {item.isFeatured && (
                        <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 shadow-sm">
                          <FaStar className="text-xs" />
                          FEATURED
                        </div>
                      )}
                    </div>

                    {/* Content Info */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition">
                          {item.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400" />
                            {item.releaseDate
                              ? new Date(item.releaseDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })
                              : "No date"}
                          </span>

                          {item.duration && (
                            <span className="flex items-center gap-1">
                              <FaClock className="text-gray-400" />
                              {item.duration}m
                            </span>
                          )}

                          {item.createdByRole && (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[11px] font-medium capitalize">
                              by {item.createdByRole}
                            </span>
                          )}
                        </div>

                        {item.description && (
                          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                            {item.description}
                          </p>
                        )}

                        {item.genres?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {item.genres.slice(0, 3).map((genre, idx) => (
                              <span
                                key={idx}
                                className="bg-purple-50 text-purple-700 text-[11px] font-medium px-2 py-0.5 rounded-full"
                              >
                                {genre}
                              </span>
                            ))}
                            {item.genres.length > 3 && (
                              <span className="text-[11px] text-gray-400 px-1">
                                +{item.genres.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                        {item.isFeatured ? (
                          <button
                            type="button"
                            onClick={() => dispatch(unfeatureContent(item._id))}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition flex items-center justify-center gap-1.5"
                          >
                            <FaStar className="text-amber-500" />
                            Unfeature
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => dispatch(featureContent(item._id))}
                            className="flex-1 py-2 px-3 rounded-xl text-xs font-semibold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100 transition flex items-center justify-center gap-1.5"
                          >
                            <FaStar className="text-purple-400" />
                            Feature
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => handleDeleteContent(item._id, item.title)}
                          className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition"
                          title="Delete content"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Content;