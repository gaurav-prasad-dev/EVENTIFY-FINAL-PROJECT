import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { getMovieDetails } from "../../Features/movies/movieApi";
import { getShowById } from "../../Features/show/showApi";

import logo from "../../image/logo2.png";
import UserSection from "../../Features/user/components/UserSection";

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
    <div className="w-full h-[70px] bg-white px-6 flex items-center justify-between border-b">

      {/* LEFT */}
      <img src={logo} className="w-[130px]" alt="logo" />

      {/* CENTER */}
      <div className="flex flex-col items-center text-center">

        {mode === "review" ? (
          <h2 className="text-lg font-semibold">
            Review your booking
          </h2>
        ) : (
          <>
            {/* 🎬 MOVIE TITLE */}
            <h2 className="text-lg font-semibold">
              {movieData?.title || "Loading..."}
            </h2>

            {/* 🎭 THEATRE + CITY */}
            <p className="text-xs text-gray-500">
            {showData?.screen?.venue?.name || "Theatre"} | {city?.name || "City"}
            </p>

            {/* 📅 DATE + TIME */}
            <p className="text-xs text-gray-400">
              {formatDateTime(showData?.showDate, showData?.startTime)}
            </p>
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
  );
};

export default BookingNavbar;