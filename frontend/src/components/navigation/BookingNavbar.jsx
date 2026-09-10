import { useParams, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getMovieDetails } from "../../Features/movies/movieApi";
import { getShowById } from "../../Features/show/showApi";

import logo from "../../image/logo2.png";
import UserSection from "../../Features/user/components/UserSection";
import { IoShieldCheckmarkOutline, IoCalendarOutline } from "react-icons/io5";

const BookingNavbar = ({ user, setOpen, setOpenLogin, movie, show, mode }) => {
  const { movieId, showId } = useParams();

  // ✅ Local state
  const [movieData, setMovieData] = useState(null);
  const [showData, setShowData] = useState(null);

  const { city } = useSelector((state) => state.location);

  // =========================
  // ✅ SYNC REDUX → LOCAL STATE
  // =========================
  useEffect(() => {
    if (movie) setMovieData(movie);
  }, [movie]);

  useEffect(() => {
    if (show) setShowData(show);
  }, [show]);

  // =========================
  // ✅ FALLBACK FETCH (ON REFRESH)
  // =========================
  useEffect(() => {
    const fetchFallback = async () => {
      try {
        // 🎬 Movie
        if (!movieData && movieId) {
          const res = await getMovieDetails(movieId);
          setMovieData(res?.movie || res?.data?.movie || null);
        }

        // 🎟️ Show
        if (!showData && showId) {
          const res = await getShowById(showId);
          setShowData(res?.data || res || null);
        }
      } catch (err) {
        console.log("NAVBAR FETCH ERROR:", err);
      }
    };

    fetchFallback();
  }, [movieId, showId, movieData, showData]);

  // =========================
  // 📅 FORMAT DATE + TIME
  // =========================
  const formatDateTime = (date, time) => {
    if (!date) return "";

    const d = new Date(date);

    const formattedDate = d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });

    let formattedTime = "";

    if (time) {
      const t = new Date(time);
      if (!isNaN(t)) {
        formattedTime = t.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      }
    }

    return `${formattedDate}${formattedTime ? " • " + formattedTime : ""}`;
  };

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all">
      <div className="max-w-[1440px] mx-auto min-h-[64px] sm:h-[68px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">

        {/* LEFT */}
        <NavLink
          to="/"
          className="shrink-0 flex items-center group transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
        >
          <img
            src={logo}
            className="w-[105px] sm:w-[138px] h-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            alt="Eventify"
          />
        </NavLink>

        {/* CENTER */}
        <div className="flex flex-col items-center text-center max-w-[46%] sm:max-w-[60%]">
          {mode === "review" ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <IoShieldCheckmarkOutline className="text-purple-600 text-lg sm:text-xl shrink-0" />
              <h2 className="text-sm sm:text-lg font-bold text-gray-900 tracking-tight">
                Review your booking
              </h2>
            </div>
          ) : (
            <>
              {/* 🎬 MOVIE TITLE */}
              <h2 className="text-xs sm:text-base font-bold text-gray-900 truncate max-w-[140px] sm:max-w-[360px] leading-tight">
                {movieData?.title || "Loading show..."}
              </h2>

              {/* 🎭 THEATRE + CITY */}
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5 truncate">
                <span className="truncate max-w-[120px] sm:max-w-[200px]">
                  {showData?.screen?.venue?.name || "Theatre"}
                </span>
                <span className="text-gray-300">•</span>
                <span className="shrink-0">{(typeof city === "object" ? city?.name : city) || "City"}</span>
              </div>

              {/* 📅 DATE + TIME PILL */}
              {showData?.showDate && (
                <div className="inline-flex items-center gap-1 text-[11px] font-medium text-purple-700 bg-purple-50 border border-purple-200/70 px-2 py-0.5 rounded-full mt-1">
                  <IoCalendarOutline className="text-[10px]" />
                  <span>{formatDateTime(showData.showDate, showData.startTime)}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* RIGHT */}
        <UserSection
          user={user}
          setOpen={setOpen}
          setOpenLogin={setOpenLogin}
        />
      </div>
    </nav>
  );
};

export default BookingNavbar;