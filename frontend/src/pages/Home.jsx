import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getHomeData } from "../Features/movies/movieApi";
import MovieRow from "../Features/movies/components/MovieRow";
import Footer from "../components/common/Footer";
import {
  IoPlayOutline,
  IoTicketOutline,
  IoStarSharp,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoQrCodeOutline,
  IoSparklesOutline,
} from "react-icons/io5";

const GENRE_FILTERS = [
  "All Movies",
  "Action",
  "Sci-Fi",
  "Adventure",
  "Drama",
  "Comedy",
  "Thriller",
  "Animation",
];

function Home() {
  const navigate = useNavigate();
  const { city } = useSelector((state) => state.location);
  const selectedCityName = city || "Indore";

  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState("All Movies");

  useEffect(() => {
    fetchHome();
  }, []);

  const fetchHome = async () => {
    try {
      setLoading(true);
      const res = await getHomeData();
      setMovies(res);
    } catch (error) {
      console.error("FETCH HOME ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const heroMovie = movies?.heroMovie || movies?.popular?.[0] || movies?.nowPlaying?.[0];

  // Filter movies by genre if selected
  const filterByGenre = (list = []) => {
    if (activeGenre === "All Movies") return list;
    return list.filter((m) =>
      m.genres?.some((g) => g.toLowerCase() === activeGenre.toLowerCase())
    );
  };

  const filteredNowPlaying = useMemo(
    () => filterByGenre(movies?.nowPlaying),
    [movies, activeGenre]
  );
  const filteredPopular = useMemo(
    () => filterByGenre(movies?.popular),
    [movies, activeGenre]
  );
  const filteredUpcoming = useMemo(
    () => filterByGenre(movies?.upcoming),
    [movies, activeGenre]
  );

  const handleBookNow = (movie) => {
    if (!movie) return;
    navigate(`/movies/${movie.id || movie._id}/${encodeURIComponent(selectedCityName)}`);
  };

  const handleWatchTrailer = (movie) => {
    if (!movie) return;
    navigate(`/trailer/${movie.id || movie._id}`);
  };

  if (loading && !movies) {
    return (
      <div className="bg-gray-50 min-h-screen">
        {/* SKELETON HERO */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-6">
          <div className="h-[380px] sm:h-[460px] rounded-3xl bg-gray-200 animate-pulse" />
        </div>

        {/* SKELETON ROWS */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-10">
          {[1, 2].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded-lg animate-pulse" />
              <div className="flex gap-6 overflow-hidden">
                {[1, 2, 3, 4, 5].map((card) => (
                  <div
                    key={card}
                    className="min-w-[210px] h-[320px] bg-gray-200 rounded-2xl animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 pb-16 sm:pb-0">
      {/* ==================================================== */}
      {/* 🌟 HERO SPOTLIGHT BANNER */}
      {/* ==================================================== */}
      {heroMovie && (
        <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[380px] sm:min-h-[460px] flex items-end bg-gray-900">
            {/* BACKDROP IMAGE */}
            <img
              src={heroMovie.backdrop || heroMovie.poster}
              alt={heroMovie.title}
              className="absolute inset-0 w-full h-full object-cover object-center scale-105"
            />

            {/* CINEMATIC GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent hidden sm:block" />

            {/* HERO CONTENT */}
            <div className="relative z-10 p-6 sm:p-10 max-w-2xl text-white">
              {/* TAGS */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-2.5 py-1 bg-purple-600 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-md">
                  <IoSparklesOutline className="text-xs" /> Featured
                </span>

                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-amber-400 border border-white/10">
                  <IoStarSharp className="text-xs" />
                  <span>{heroMovie.rating || "8.4"}/10</span>
                </div>

                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-medium text-gray-200">
                  {heroMovie.certification || "UA16+"}
                </span>

                {heroMovie.runtime && (
                  <span className="text-xs text-gray-300">
                    {heroMovie.runtime} min
                  </span>
                )}
              </div>

              {/* TITLE */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-md text-white">
                {heroMovie.title}
              </h1>

              {/* GENRES */}
              {heroMovie.genres && heroMovie.genres.length > 0 && (
                <p className="text-sm font-medium text-purple-300 mt-2">
                  {heroMovie.genres.slice(0, 3).join(" • ")}
                </p>
              )}

              {/* OVERVIEW */}
              <p className="text-sm text-gray-300 mt-2.5 line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-sm">
                {heroMovie.overview ||
                  "Experience top-tier cinema with premium surround sound and crystal clear screens in your city."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap items-center gap-3.5 mt-6">
                <button
                  onClick={() => handleBookNow(heroMovie)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 active:scale-95 text-white font-semibold rounded-xl text-sm shadow-xl flex items-center gap-2 transition duration-200"
                >
                  <IoTicketOutline className="text-base" />
                  Book Tickets
                </button>

                <button
                  onClick={() => handleWatchTrailer(heroMovie)}
                  className="px-5 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md active:scale-95 text-white font-semibold rounded-xl text-sm border border-white/20 flex items-center gap-2 transition duration-200"
                >
                  <IoPlayOutline className="text-base" />
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ==================================================== */}
      {/* 🏷️ GENRE / CATEGORY FILTER CHIPS */}
      {/* ==================================================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-8 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {GENRE_FILTERS.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeGenre === genre
                  ? "bg-black text-white shadow-md scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* ==================================================== */}
      {/* 🎬 MOVIE CATALOG ROWS */}
      {/* ==================================================== */}
      <main className="max-w-[1400px] mx-auto py-4 space-y-6">
        <MovieRow
          title="🔥 Now Playing in Cinemas"
          movies={filteredNowPlaying}
        />

        <MovieRow
          title="⭐ Popular & Trending Hits"
          movies={filteredPopular}
        />

        <MovieRow
          title="🎬 Upcoming to Theatres"
          movies={filteredUpcoming}
        />
      </main>

      {/* ==================================================== */}
      {/* 🛡️ PLATFORM TRUST & FEATURES STRIP */}
      {/* ==================================================== */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-3">
              <IoFlashOutline />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Instant E-Tickets</h4>
            <p className="text-xs text-gray-500 mt-1">Get confirmed tickets delivered right into your profile & SMS</p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-2xl mb-3">
              <IoQrCodeOutline />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Contactless QR Entry</h4>
            <p className="text-xs text-gray-500 mt-1">Scan verified QR at theatre gates for hassle-free check-in</p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-2xl mb-3">
              <IoTicketOutline />
            </div>
            <h4 className="font-bold text-sm text-gray-900">Live Seat Selection</h4>
            <p className="text-xs text-gray-500 mt-1">Real-time seat locking with a 10-minute hold guarantee</p>
          </div>

          <div className="flex flex-col items-center text-center p-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-3">
              <IoShieldCheckmarkOutline />
            </div>
            <h4 className="font-bold text-sm text-gray-900">100% Safe Payments</h4>
            <p className="text-xs text-gray-500 mt-1">Encrypted Razorpay transactions with instant refund support</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;