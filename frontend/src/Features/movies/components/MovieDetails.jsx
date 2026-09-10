import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMovieDetails, fetchMovieVideos } from "../movieSlice";
import { getShowsByContent } from "../../show/showApi";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { movieDetails, loading } = useSelector((state) => state.movies);
  const { selectedCity } = useSelector((state) => state.location);

  const { contentId, city } = useParams();

  const [selectedDate, setSelectedDate] = useState(null);
  const [shows, setShows] = useState([]);

  // 📅 Next 5 days
  const dates = useMemo(() => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        fullDate: date,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
      });
    }
    return days;
  }, []);

  // 🎬 Load movie details & trailer
  useEffect(() => {
    if (!contentId) return;

    dispatch(fetchMovieDetails(contentId));
    dispatch(fetchMovieVideos(contentId));

    setSelectedDate(new Date());
  }, [dispatch, contentId]);

  // 🎭 Fetch shows
  useEffect(() => {
    const fetchShows = async () => {
      try {
        if (!contentId || !selectedDate) return;

        const formattedDate = selectedDate.toLocaleDateString("en-CA");
        const cityParam = selectedCity?._id || city || "Indore";

        const res = await getShowsByContent(
          contentId,
          formattedDate,
          cityParam
        );

        const data = res || [];

        if (!Array.isArray(data)) {
          setShows([]);
          return;
        }

        const formattedShows = data.map((venue) => ({
          theatreName: venue.venueName,
          shows: Array.isArray(venue.shows)
            ? venue.shows.map((s) => ({
                showId: s.showId,
                time: s.startTime,
              }))
            : [],
        }));

        setShows(formattedShows);
      } catch (err) {
        console.log("SHOW FETCH ERROR:", err);
        setShows([]);
      }
    };

    fetchShows();
  }, [contentId, selectedDate, selectedCity?._id, city]);

  // Format showtime cleanly (e.g. "02:30 PM")
  const formatShowTime = (timeStr) => {
    if (!timeStr) return "Showtime";
    const trimmed = String(timeStr).trim();
    if (/^\d{1,2}:\d{2}\s*(AM|PM)$/i.test(trimmed)) {
      return trimmed.toUpperCase();
    }
    if (/^\d{1,2}:\d{2}$/.test(trimmed)) {
      const [h, m] = trimmed.split(":").map(Number);
      const period = h >= 12 ? "PM" : "AM";
      const hour12 = h % 12 || 12;
      return `${String(hour12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
    }
    const d = new Date(timeStr);
    if (!isNaN(d.getTime())) {
      return d.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }
    return trimmed;
  };

  const genreList = useMemo(() => {
    if (!movieDetails?.genres) return [];
    if (Array.isArray(movieDetails.genres)) {
      return movieDetails.genres
        .map((g) => (typeof g === "string" ? g : g?.name))
        .filter(Boolean);
    }
    return [];
  }, [movieDetails?.genres]);

  // ⏳ Loading state
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-base font-medium animate-pulse text-gray-500">
          Loading movie details...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-16">

      {/* 🎬 HEADER */}
      <div className="bg-white border-b border-gray-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">

          {/* Poster */}
          <div
            className="relative cursor-pointer group shrink-0 rounded-2xl overflow-hidden shadow-sm bg-gray-100"
            onClick={() => navigate(`/trailer/${contentId}/${city || "Indore"}`)}
            title="Watch Trailer"
          >
            <img
              src={movieDetails?.poster}
              alt={movieDetails?.title}
              className="w-36 sm:w-44 h-auto object-cover transition-transform duration-200 group-hover:scale-105"
            />

            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
              <div className="w-10 h-10 bg-white/95 rounded-full flex items-center justify-center text-xs font-bold shadow-md text-gray-900 pl-0.5">
                ▶
              </div>
            </div>
          </div>

          {/* Movie Information */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              {movieDetails?.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sm text-gray-500 mt-2 flex-wrap">
              {movieDetails?.certification && (
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                  {movieDetails.certification}
                </span>
              )}
              <span>•</span>
              <span className="font-medium uppercase">
                {movieDetails?.language || "Hindi"}
              </span>
              <span>•</span>
              <span>{movieDetails?.runtime || movieDetails?.duration || 120} min</span>
              {movieDetails?.rating && (
                <>
                  <span>•</span>
                  <span className="text-amber-600 font-semibold">
                    ★ {movieDetails.rating}
                  </span>
                </>
              )}
            </div>

            {/* Genres */}
            {genreList.length > 0 && (
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-3 flex-wrap">
                {genreList.map((g, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs font-medium border border-gray-200/70"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}

            {/* Synopsis */}
            {movieDetails?.overview && (
              <p className="text-xs sm:text-sm text-gray-600 mt-3 max-w-2xl line-clamp-2 leading-relaxed">
                {movieDetails.overview}
              </p>
            )}

            {/* Actions */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
              <button
                type="button"
                onClick={() =>
                  navigate(`/movie/${contentId}/details`, {
                    state: { background: location },
                  })
                }
                className="px-4 py-2 border border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 text-gray-800 text-sm font-semibold rounded-xl transition shadow-2xs active:scale-95 cursor-pointer"
              >
                View details
              </button>

              <button
                type="button"
                onClick={() => navigate(`/trailer/${contentId}/${city || "Indore"}`)}
                className="px-4 py-2 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition shadow-2xs active:scale-95 cursor-pointer"
              >
                Watch trailer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 📅 DATE SELECTOR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          <span>Select Date</span>
          <span>•</span>
          <span>{new Date().toLocaleString("en-US", { month: "long" })}</span>
        </div>

        <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-1 no-scrollbar">
          {dates.map((d, i) => {
            const isActive =
              selectedDate?.toDateString() === d.fullDate.toDateString();

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedDate(d.fullDate)}
                className={`min-w-[64px] px-3.5 py-2.5 rounded-xl transition-all duration-150 text-center cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? "bg-gray-900 text-white shadow-sm"
                    : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200/90"
                }`}
              >
                <p className="text-base sm:text-lg font-bold leading-tight">{d.date}</p>
                <p className="text-[11px] font-medium uppercase tracking-wider opacity-80 mt-0.5">
                  {d.day}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 🎭 LEGEND */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-4 flex items-center gap-6 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>Available</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>Filling fast</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>Almost full</span>
        </span>
      </div>

      {/* 🎭 SHOWS LIST */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-5 space-y-4">
        {shows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200/80 p-10 text-center text-gray-500 shadow-xs">
            <p className="font-semibold text-gray-700">No shows available for this date</p>
            <p className="text-xs text-gray-400 mt-1">Please select another date above or check back later.</p>
          </div>
        ) : (
          shows.map((theatre, index) => (
            <div
              key={index}
              className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200/80 shadow-xs"
            >
              <h3 className="font-bold text-base sm:text-lg text-gray-900">
                {theatre.theatreName}
              </h3>

              <div className="flex gap-2.5 sm:gap-3 mt-4 flex-wrap">
                {theatre.shows.map((s) => (
                  <button
                    key={s.showId}
                    type="button"
                    onClick={() =>
                      navigate(`/seat-layout/${contentId}/${s.showId}`)
                    }
                    className="px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-300 hover:border-emerald-600 hover:text-emerald-700 bg-white hover:bg-emerald-50/40 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition duration-150 active:scale-95 cursor-pointer shadow-2xs"
                  >
                    {formatShowTime(s.time)}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieDetails;
