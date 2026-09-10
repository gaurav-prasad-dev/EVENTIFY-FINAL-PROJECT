import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { searchMovies } from "../movies/movieApi";

import {
  createShowThunk,
  resetOrganizerState,
} from "../../Features/organizer/organizerSlice";

import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";
import {
  IoSearchOutline,
  IoFilmOutline,
  IoCheckmarkCircle,
  IoStarSharp,
  IoAddCircleOutline,
  IoCloseOutline,
  IoTvOutline,
} from "react-icons/io5";

const CreateShow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector(
    (state) => state.organizer
  );

  const [form, setForm] = useState({
    content: "",
    venueId: "",
    screenId: "",
    date: "",
    startTime: "",
    endTime: "",
    basePrice: "",
    publishedStatus: "published",
  });

  const [contents, setContents] = useState([]);
  const [screens, setScreens] = useState([]);
  const [venues, setVenues] = useState([]);

  // Modal for quick adding screen
  const [showAddScreenModal, setShowAddScreenModal] = useState(false);
  const [newScreenForm, setNewScreenForm] = useState({
    name: "",
    venue: "",
    totalSeats: 60,
    features: ["Premium"],
  });
  const [creatingScreen, setCreatingScreen] = useState(false);

  // TMDB Search Tab state for Organizers
  const [activeMovieTab, setActiveMovieTab] = useState("catalog"); // "catalog" | "tmdb"
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [tmdbLoading, setTmdbLoading] = useState(false);
  const [importingTmdbId, setImportingTmdbId] = useState(null);
  const [selectedMoviePreview, setSelectedMoviePreview] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (field === "content") {
      const found = contents.find((c) => c._id === value);
      setSelectedMoviePreview(found || null);
    }
  };

  const handleTmdbSearch = async (e) => {
    e?.preventDefault();
    if (!tmdbQuery.trim()) return;

    setTmdbLoading(true);
    try {
      const res = await searchMovies(tmdbQuery.trim());
      const results = res?.data || res?.results || (Array.isArray(res) ? res : []);
      setTmdbResults(results);
    } catch (err) {
      console.error("TMDB SEARCH ERROR:", err);
      alert("Failed to search TMDB movies");
    } finally {
      setTmdbLoading(false);
    }
  };

  const handleImportAndSelect = async (movie) => {
    const rawId = movie.tmdbId || movie.id;
    if (!rawId) {
      alert("Movie TMDB ID is missing");
      return;
    }
    const targetId = rawId.toString();
    setImportingTmdbId(rawId);

    try {
      // 1. Check if movie already exists in loaded contents
      const existing = contents.find(
        (c) =>
          c.tmdbId?.toString() === targetId ||
          c.title?.toLowerCase() === movie.title?.toLowerCase()
      );

      if (existing) {
        setForm((prev) => ({ ...prev, content: existing._id }));
        setSelectedMoviePreview(existing);
        alert(`"${existing.title}" is already in catalog and selected!`);
        return;
      }

      // 2. Import into catalog via /content/create
      const res = await apiClient.post(ENDPOINTS.CONTENT.CREATE, {
        title: movie.title,
        type: "movie",
        tmdbId: targetId,
      });

      const newContent = res.data?.data;
      if (newContent) {
        setContents((prev) => [newContent, ...prev]);
        setForm((prev) => ({ ...prev, content: newContent._id }));
        setSelectedMoviePreview(newContent);
        alert(`"${newContent.title}" imported from TMDB and selected! 🎉`);
      }
    } catch (err) {
      console.error("IMPORT TMDB MOVIE ERROR:", err);
      const errMsg = err.response?.data?.message || "";
      if (errMsg.toLowerCase().includes("already exists")) {
        try {
          const refetchRes = await apiClient.get(ENDPOINTS.CONTENT.GET_ALL);
          const freshList = refetchRes.data?.data || [];
          setContents(freshList);
          const match = freshList.find(
            (c) =>
              c.tmdbId?.toString() === targetId ||
              c.title?.toLowerCase() === movie.title?.toLowerCase()
          );
          if (match) {
            setForm((prev) => ({ ...prev, content: match._id }));
            setSelectedMoviePreview(match);
            alert(`Selected existing catalog movie: "${match.title}"`);
            return;
          }
        } catch {
          // ignore
        }
      }
      alert(errMsg || "Failed to import movie from TMDB");
    } finally {
      setImportingTmdbId(null);
    }
  };

  // ================= FETCH CONTENT =================
  const fetchContent = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.CONTENT.GET_ALL);
      setContents(res.data.data || []);
    } catch (err) {
      console.log("CONTENT ERROR:", err);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  // ================= FETCH VENUES =================
  const fetchVenues = async () => {
    try {
      let list = [];
      try {
        const myRes = await apiClient.get(
          ENDPOINTS.ORGANIZER.VENUES?.GET_MY || "/organizer/venues"
        );
        const myList = Array.isArray(myRes.data)
          ? myRes.data
          : myRes.data?.data || [];
        list = myList.filter((v) => v.status === "approved" || !v.status);
      } catch (e) {
        console.log("MY VENUES FETCH ERROR:", e);
      }

      if (list.length === 0) {
        const res = await apiClient.get(
          ENDPOINTS.VENUES?.GET_APPROVED || "/venues/approved/all"
        );
        list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      }

      setVenues(list);
      if (list.length > 0) {
        setForm((prev) => (prev.venueId ? prev : { ...prev, venueId: list[0]._id }));
        setNewScreenForm((prev) => ({ ...prev, venue: list[0]._id }));
      }
    } catch (err) {
      console.log("VENUE FETCH ERROR:", err);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ================= FETCH SCREENS =================
  const fetchScreens = async () => {
    try {
      const res = await apiClient.get("/screen");
      const list = res.data?.data || [];
      setScreens(list);
    } catch (err) {
      console.log("SCREEN ERROR:", err);
    }
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  // Compute selected venue object
  const selectedVenue = useMemo(() => {
    return venues.find((v) => v._id === form.venueId) || null;
  }, [venues, form.venueId]);

  // Compute screens belonging strictly to the selected venue
  const venueScreens = useMemo(() => {
    if (!form.venueId) return [];
    return screens.filter((s) => {
      const vid = s.venue?._id || s.venue;
      return vid && vid.toString() === form.venueId.toString();
    });
  }, [screens, form.venueId]);

  // Ensure valid screen selection whenever venue changes
  useEffect(() => {
    if (venueScreens.length > 0) {
      setForm((prev) => {
        const isCurrentValid = venueScreens.some((s) => s._id === prev.screenId);
        return isCurrentValid ? prev : { ...prev, screenId: venueScreens[0]._id };
      });
    } else {
      setForm((prev) => (prev.screenId ? { ...prev, screenId: "" } : prev));
    }
  }, [venueScreens]);

  // ================= CREATE SCREEN QUICKLY =================
  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!newScreenForm.name.trim() || !newScreenForm.venue) {
      alert("Please enter a screen name and choose a venue");
      return;
    }

    setCreatingScreen(true);
    try {
      const res = await apiClient.post("/screen/create", {
        name: newScreenForm.name.trim(),
        venue: newScreenForm.venue,
        totalSeats: Number(newScreenForm.totalSeats) || 60,
        features: newScreenForm.features,
      });

      const created = res.data?.screen || res.data?.data;
      await fetchScreens();

      if (created?._id) {
        setForm((prev) => ({ ...prev, screenId: created._id }));
      }

      setShowAddScreenModal(false);
      setNewScreenForm({
        name: "",
        venue: venues[0]?._id || "",
        totalSeats: 60,
        features: ["Premium"],
      });
      alert("Screen created and selected successfully! 🎉");
    } catch (err) {
      console.error("CREATE SCREEN ERROR:", err);
      alert(err.response?.data?.message || "Failed to create screen");
    } finally {
      setCreatingScreen(false);
    }
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.content) {
      alert("Please select or import a movie first!");
      return;
    }

    if (!form.venueId) {
      alert("Please select a cinema hall / venue first!");
      return;
    }

    if (!form.screenId) {
      alert("Please select an auditorium / screen for this show!");
      return;
    }

    dispatch(
      createShowThunk({
        content: form.content,
        screenId: form.screenId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        basePrice: Number(form.basePrice),
        publishedStatus: form.publishedStatus,
      })
    );
  };

  // ================= SUCCESS =================
  useEffect(() => {
    if (success) {
      alert("Show Created Successfully 🎉");
      dispatch(resetOrganizerState());
      setForm({
        content: "",
        venueId: venues[0]?._id || "",
        screenId: "",
        date: "",
        startTime: "",
        endTime: "",
        basePrice: "",
        publishedStatus: "published",
      });
      setSelectedMoviePreview(null);
    }
  }, [success, dispatch, venues]);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2.5">
              <IoFilmOutline className="text-purple-600" />
              Schedule New Show
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Select a movie from catalog or search TMDB live database, assign screen and showtime.
            </p>
          </div>
        </div>

        {/* MOVIE SELECTION TABS */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-gray-800">
            Step 1: Choose or Import Movie
          </label>

          <div className="flex gap-2 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => setActiveMovieTab("catalog")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeMovieTab === "catalog"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Platform Catalog ({contents.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveMovieTab("tmdb")}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 ${
                activeMovieTab === "tmdb"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <IoSearchOutline className="text-sm" />
              Search Any TMDB Movie
            </button>
          </div>

          {/* TAB 1: PLATFORM CATALOG DROPDOWN */}
          {activeMovieTab === "catalog" && (
            <div>
              <select
                value={form.content}
                onChange={(e) => handleChange("content", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm text-gray-800 transition"
              >
                <option value="">-- Choose from existing catalog --</option>
                {contents.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title} ({item.type || "movie"}) {item.duration ? `• ${item.duration}m` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* TAB 2: TMDB SEARCH & ONE-CLICK IMPORT */}
          {activeMovieTab === "tmdb" && (
            <div className="space-y-4">
              <form onSubmit={handleTmdbSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Search TMDB movies (e.g., Inception, Avatar, Dunki, Animal)..."
                    value={tmdbQuery}
                    onChange={(e) => setTmdbQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={tmdbLoading}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-sm transition disabled:opacity-50"
                >
                  {tmdbLoading ? "Searching..." : "Search TMDB"}
                </button>
              </form>

              {tmdbResults.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-1 border border-gray-100 rounded-xl">
                  {tmdbResults.map((movie) => {
                    const mid = movie.tmdbId || movie.id;
                    const isSelected = form.content && selectedMoviePreview?.title === movie.title;
                    const isImporting = importingTmdbId === mid;

                    return (
                      <div
                        key={mid}
                        className={`border rounded-xl p-3 flex gap-3 items-center hover:border-purple-300 transition ${
                          isSelected ? "bg-purple-50 border-purple-500 ring-2 ring-purple-100" : "bg-white"
                        }`}
                      >
                        <div className="w-12 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {movie.poster ? (
                            <img src={movie.poster} alt={movie.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No img</div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-xs text-gray-900 truncate">{movie.title}</h4>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            {movie.releaseDate ? movie.releaseDate.slice(0, 4) : "N/A"}
                          </p>
                          {movie.voteAverage && (
                            <p className="text-[11px] text-amber-500 font-medium flex items-center gap-1 mt-0.5">
                              <IoStarSharp className="text-xs" /> {Number(movie.voteAverage).toFixed(1)}
                            </p>
                          )}

                          <button
                            type="button"
                            disabled={isImporting}
                            onClick={() => handleImportAndSelect(movie)}
                            className={`mt-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition ${
                              isSelected
                                ? "bg-emerald-600 text-white"
                                : "bg-purple-600 hover:bg-purple-700 text-white"
                            }`}
                          >
                            {isImporting ? "Importing..." : isSelected ? "Selected ✓" : "+ Import & Pick"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected Movie Preview Card */}
          {selectedMoviePreview && (
            <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-3">
              <IoCheckmarkCircle className="text-purple-600 text-xl flex-shrink-0" />
              {selectedMoviePreview.poster && (
                <img src={selectedMoviePreview.poster} alt="" className="w-10 h-14 object-cover rounded-md shadow-sm" />
              )}
              <div className="flex-1">
                <p className="text-xs text-purple-700 font-bold uppercase tracking-wider">Selected Movie</p>
                <p className="text-sm font-semibold text-gray-900">{selectedMoviePreview.title}</p>
                {selectedMoviePreview.duration && (
                  <p className="text-xs text-gray-500">Duration: {selectedMoviePreview.duration} minutes</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* STEP 2: SHOWTIME & PRICING FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-bold text-gray-800">
            Step 2: Venue, Auditorium, Date, Showtime & Pricing
          </label>

          {/* 1. VENUE SELECTION FIRST */}
          <div className="space-y-2 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  1. Select Cinema Hall / Venue *
                </label>
                <p className="text-[11px] text-gray-400">
                  Select the venue first; its attached screens will load automatically.
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/organizer/venues/create")}
                className="text-xs font-semibold text-purple-700 hover:text-purple-900 transition underline"
              >
                + Register New Venue
              </button>
            </div>

            {venues.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <span>No approved venues found. Please register a venue first.</span>
                <button
                  type="button"
                  onClick={() => navigate("/organizer/venues/create")}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Register Venue Now
                </button>
              </div>
            ) : (
              <select
                value={form.venueId}
                onChange={(e) => {
                  const vid = e.target.value;
                  setForm((prev) => ({ ...prev, venueId: vid }));
                  setNewScreenForm((prev) => ({ ...prev, venue: vid }));
                }}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm font-semibold text-gray-800 transition"
                required
              >
                <option value="">-- Choose Cinema Hall / Venue --</option>
                {venues.map((v) => {
                  const cityName = v.city?.name || v.city || "Unknown City";
                  return (
                    <option key={v._id} value={v._id}>
                      {v.name} • {cityName} ({v.type || "Theatre"})
                    </option>
                  );
                })}
              </select>
            )}
          </div>

          {/* 2. SCREEN SELECTION ATTACHED TO CHOSEN VENUE */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  2. Select Auditorium / Screen *
                </label>
                <p className="text-[11px] text-gray-400">
                  {selectedVenue
                    ? `Screens configured for ${selectedVenue.name}:`
                    : "Please choose a venue above first."}
                </p>
              </div>

              {form.venueId && (
                <button
                  type="button"
                  onClick={() => {
                    setNewScreenForm((prev) => ({
                      ...prev,
                      venue: form.venueId,
                    }));
                    setShowAddScreenModal(true);
                  }}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition border border-purple-200 shadow-2xs"
                >
                  <IoAddCircleOutline className="text-base" />
                  + Add Screen to this Venue
                </button>
              )}
            </div>

            {!form.venueId ? (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 text-center">
                👆 Select a cinema hall / venue above to view and choose its auditoriums.
              </div>
            ) : venueScreens.length === 0 ? (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-amber-800">
                  <span className="font-bold">No screens configured</span> for{" "}
                  {selectedVenue?.name || "this venue"}.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewScreenForm((prev) => ({
                      ...prev,
                      venue: form.venueId,
                    }));
                    setShowAddScreenModal(true);
                  }}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-xs transition"
                >
                  Add Screen 1 to this Venue
                </button>
              </div>
            ) : (
              <>
                {/* Visual Interactive Screen Grid for Chosen Venue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {venueScreens.map((screen) => {
                    const isSelected = form.screenId === screen._id;

                    return (
                      <div
                        key={screen._id}
                        onClick={() => handleChange("screenId", screen._id)}
                        className={`cursor-pointer p-3.5 rounded-xl border transition-all relative ${
                          isSelected
                            ? "bg-purple-50/90 border-purple-600 ring-2 ring-purple-200 shadow-xs"
                            : "bg-gray-50 hover:bg-white hover:border-purple-300"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-extrabold text-gray-900 truncate">
                              {screen.name}
                            </p>
                            <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                              {selectedVenue?.name || "Venue"}
                            </p>
                          </div>
                          {isSelected ? (
                            <IoCheckmarkCircle className="text-purple-600 text-xl shrink-0" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-gray-300 shrink-0 mt-0.5" />
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-gray-200/60 text-[10px]">
                          <span className="bg-white px-2 py-0.5 rounded border border-gray-200 font-bold text-gray-700">
                            {screen.totalSeats || 60} Seats
                          </span>
                          {screen.features?.slice(0, 2).map((f) => (
                            <span
                              key={f}
                              className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Dropdown for quick lookup */}
                <select
                  value={form.screenId}
                  onChange={(e) => handleChange("screenId", e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-xs text-gray-700 transition"
                  required
                >
                  <option value="">-- Or choose from dropdown --</option>
                  {venueScreens.map((screen) => (
                    <option key={screen._id} value={screen._id}>
                      {screen.name} • {screen.totalSeats || 60} Seats
                    </option>
                  ))}
                </select>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* DATE */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Show Date *</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition"
                required
              />
            </div>

            {/* START TIME */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Start Time *</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => handleChange("startTime", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition"
                required
              />
            </div>

            {/* END TIME */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">End Time *</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => handleChange("endTime", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition"
                required
              />
            </div>

            {/* BASE PRICE */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Base Ticket Price (₹) *</label>
              <input
                type="number"
                placeholder="e.g. 250"
                value={form.basePrice}
                onChange={(e) => handleChange("basePrice", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Publish Status</label>
              <select
                value={form.publishedStatus}
                onChange={(e) => handleChange("publishedStatus", e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none text-sm transition"
              >
                <option value="published">Publish Now (Visible after Admin Approval)</option>
                <option value="draft">Save as Draft (Private)</option>
              </select>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-gray-800 active:scale-[0.99] text-white font-semibold p-3.5 rounded-xl transition shadow-md disabled:opacity-50 mt-3"
          >
            {loading ? "Scheduling Show..." : "🚀 Schedule & Submit Show"}
          </button>

          {error && (
            <p className="text-red-500 text-sm font-medium mt-2">{error}</p>
          )}
        </form>

        {/* QUICK ADD SCREEN MODAL */}
        {showAddScreenModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <IoTvOutline />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Add New Screen / Auditorium
                    </h3>
                    <p className="text-xs text-gray-500">
                      Add a screen to your approved venue.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddScreenModal(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCreateScreen} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Venue *
                  </label>
                  <select
                    value={newScreenForm.venue}
                    onChange={(e) =>
                      setNewScreenForm((prev) => ({
                        ...prev,
                        venue: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">-- Choose Venue --</option>
                    {venues.map((v) => (
                      <option key={v._id} value={v._id}>
                        {v.name} ({v.city?.name || v.city || "Venue"})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Screen Name / Auditorium Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Screen 4 - Audi 4 (Dolby Atmos)"
                    value={newScreenForm.name}
                    onChange={(e) =>
                      setNewScreenForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={newScreenForm.totalSeats}
                    onChange={(e) =>
                      setNewScreenForm((prev) => ({
                        ...prev,
                        totalSeats: e.target.value,
                      }))
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Screen Amenities / Features
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Premium", "Recliner", "Wheelchair"].map((feat) => {
                      const hasFeat = newScreenForm.features.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() =>
                            setNewScreenForm((prev) => ({
                              ...prev,
                              features: hasFeat
                                ? prev.features.filter((f) => f !== feat)
                                : [...prev.features, feat],
                            }))
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            hasFeat
                              ? "bg-purple-600 text-white font-bold"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {hasFeat ? `✓ ${feat}` : `+ ${feat}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setShowAddScreenModal(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingScreen}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {creatingScreen ? "Creating..." : "Create & Select Screen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CreateShow;