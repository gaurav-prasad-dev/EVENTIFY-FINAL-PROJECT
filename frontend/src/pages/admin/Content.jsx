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

  const [search, setSearch] = useState("");

  const [movieSearch, setMovieSearch] =
    useState("");

  const [formData, setFormData] = useState({
    title: "",
    type: "movie",
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
    return contents.filter((item) =>
      item.title
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [contents, search]);

  // ======================================================
  // EVENT CREATE
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,

      genres: formData.genres
        .split(",")
        .map((g) => g.trim()),

      languages: formData.languages
        .split(",")
        .map((l) => l.trim()),
    };

    await dispatch(createContent(payload));

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
  };

  // ======================================================
  // TMDB SEARCH
  // ======================================================

  const handleMovieSearch = () => {
    if (!movieSearch.trim()) return;

    dispatch(searchTmdbMovies(movieSearch));
  };

  // ======================================================
  // JSX
  // ======================================================

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-purple-700">
              Content Management
            </h1>

            <p className="text-gray-500 mt-1">
              Manage movies & events
            </p>
          </div>

          <div className="bg-white px-4 py-3 rounded-2xl shadow border flex items-center gap-3">
            <FaFilm className="text-purple-600 text-2xl" />

            <div>
              <p className="text-sm text-gray-500">
                Total Content
              </p>

              <h2 className="font-bold text-xl">
                {contents.length}
              </h2>
            </div>
          </div>
        </div>

        {/* ====================================================== */}
        {/* CREATE SECTION */}
        {/* ====================================================== */}

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <div className="flex items-center gap-2 mb-5">
            <FaPlus className="text-purple-600" />

            <h2 className="text-xl font-bold text-gray-800">
              Add New Content
            </h2>
          </div>

          {/* TYPE SELECT */}

          <div className="mb-6">
            <label className="block mb-2 font-medium text-gray-700">
              Content Type
            </label>

<select
  value={formData.type}
  onChange={(e) => {
    const value = e.target.value;

    setFormData({
      ...formData,
      type: value,
    });

    // CLEAR TMDB SEARCH WHEN SWITCHING
    dispatch(clearTmdbMovies());

    setMovieSearch("");
  }}
  className="border rounded-xl p-3 w-full md:w-64 outline-none focus:ring-2 focus:ring-purple-500"
>
  <option value="movie">Movie</option>
  <option value="event">Event</option>
</select>
          
          </div>

          {/* ====================================================== */}
          {/* MOVIE SECTION */}
          {/* ====================================================== */}

          {formData.type === "movie" && (
            <div className="space-y-6">

              {/* SEARCH BAR */}

              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search movies from TMDB..."
                  value={movieSearch}
                  onChange={(e) =>
                    setMovieSearch(e.target.value)
                  }
                  className="flex-1 border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
                />

                <button
                  type="button"
                  onClick={handleMovieSearch}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 rounded-xl"
                >
                  Search
                </button>
              </div>

              {/* MOVIE RESULTS */}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                {tmdbMovies?.map((movie) => (
                  <div
                    key={movie.id}
                    className="border rounded-3xl overflow-hidden bg-gray-50 shadow-sm"
                  >

                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-72 object-cover"
                    />

                    <div className="p-5">

                      <h3 className="text-xl font-bold text-gray-800">
                        {movie.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-2">
                        {movie.releaseDate}
                      </p>

                      <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {movie.overview}
                      </p>

                      <button
                        type="button"
                        onClick={async () => {
  await dispatch(
    createFromTmdb(movie.id)
  );

  dispatch(clearTmdbMovies());

  setMovieSearch("");
}}
                        className="mt-5 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold"
                      >
                        Add Movie
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ====================================================== */}
          {/* EVENT SECTION */}
          {/* ====================================================== */}

          {formData.type === "event" && (
            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >

              {/* TITLE */}

              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* DURATION */}

              <input
                type="number"
                placeholder="Duration (minutes)"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* RELEASE DATE */}

              <input
                type="date"
                value={formData.releaseDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    releaseDate: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* GENRES */}

              <input
                type="text"
                placeholder="Genres (Music, Comedy)"
                value={formData.genres}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    genres: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* LANGUAGES */}

              <input
                type="text"
                placeholder="Languages (Hindi, English)"
                value={formData.languages}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    languages: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* POSTER */}

              <input
                type="text"
                placeholder="Poster URL"
                value={formData.poster}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    poster: e.target.value,
                  })
                }
                className="border rounded-xl p-3 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* TRAILER */}

              <input
                type="text"
                placeholder="Trailer URL"
                value={formData.trailerUrl}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trailerUrl: e.target.value,
                  })
                }
                className="border rounded-xl p-3 md:col-span-2 outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* DESCRIPTION */}

              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  })
                }
                className="border rounded-xl p-3 md:col-span-2 min-h-[120px] outline-none focus:ring-2 focus:ring-purple-500"
              />

              {/* BUTTON */}

              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold md:col-span-2"
              >
                Create Event
              </button>
            </form>
          )}
        </div>

        {/* ====================================================== */}
        {/* SEARCH */}
        {/* ====================================================== */}

        <div className="bg-white border rounded-2xl p-4 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400" />

          <input
            type="text"
            placeholder="Search content..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full outline-none"
          />
        </div>

        {/* ====================================================== */}
        {/* CONTENT GRID */}
        {/* ====================================================== */}

        {loading ? (
          <div className="text-center py-20 text-gray-500">
            Loading content...
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="bg-white rounded-3xl border p-12 text-center text-gray-500">
            No content found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredContent.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-lg transition"
              >

                {/* IMAGE */}

                <div className="relative h-72 overflow-hidden">
                  <img
                    src={item.poster}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {item.isFeatured && (
                    <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <FaStar />
                      Featured
                    </div>
                  )}
                </div>

                {/* BODY */}

                <div className="p-5 space-y-4">

                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-800">
                        {item.title}
                      </h2>

                      <span className="bg-purple-100 text-purple-700 text-xs px-3 py-1 rounded-full capitalize">
                        {item.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                      <FaCalendarAlt />

                      {item.releaseDate
                        ? new Date(
                            item.releaseDate
                          ).toDateString()
                        : "No date"}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {item.genres?.map(
                      (genre, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
                        >
                          {genre}
                        </span>
                      )
                    )}
                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-3 pt-2">

                    {item.isFeatured ? (
                      <button
                        onClick={() =>
                          dispatch(
                            unfeatureContent(
                              item._id
                            )
                          )
                        }
                        className="flex-1 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 py-2 rounded-xl text-sm font-semibold transition"
                      >
                        Unfeature
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          dispatch(
                            featureContent(
                              item._id
                            )
                          )
                        }
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-xl text-sm font-semibold transition"
                      >
                        Feature
                      </button>
                    )}

                    <button
                      onClick={() =>
                        dispatch(
                          deleteContent(item._id)
                        )
                      }
                      className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-xl transition"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Content;