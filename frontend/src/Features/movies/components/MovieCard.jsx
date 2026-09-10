import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoStarSharp, IoTicketOutline } from "react-icons/io5";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { city } = useSelector((state) => state.location);
  const [imgError, setImgError] = useState(false);

  const handleClick = () => {
    const cityName = city || "Indore";
    navigate(`/movies/${movie.id || movie._id}/${encodeURIComponent(cityName)}`);
  };

  const formattedRating = movie.rating
    ? Number(movie.rating).toFixed(1)
    : "8.0";

  const primaryGenre =
    movie.genres && movie.genres.length > 0
      ? movie.genres.slice(0, 2).join(" • ")
      : "Drama";

  const language =
    movie.language ||
    (movie.languages && movie.languages[0]) ||
    "Hindi";

  return (
    <div
      onClick={handleClick}
      className="group relative min-w-[210px] max-w-[210px] sm:min-w-[225px] sm:max-w-[225px] cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-2xl border border-gray-100 hover:border-purple-200 transition-all duration-300 hover:-translate-y-2 flex flex-col"
    >
      {/* POSTER WRAPPER */}
      <div className="relative h-[290px] sm:h-[310px] w-full overflow-hidden bg-gray-900">
        <img
          src={
            !imgError && movie.poster
              ? movie.poster
              : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80"
          }
          alt={movie.title}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* FLOATING TOP BADGES */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none z-10">
          {/* RATING BADGE */}
          <div className="bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md border border-white/10">
            <IoStarSharp className="text-amber-400 text-xs" />
            <span>{formattedRating}</span>
          </div>

          {/* LANGUAGE PILL */}
          <span className="bg-purple-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {language}
          </span>
        </div>

        {/* HOVER GRADIENT OVERLAY & QUICK ACTION */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
          <button className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform duration-200 transform translate-y-2 group-hover:translate-y-0">
            <IoTicketOutline className="text-sm" />
            Book Tickets
          </button>
        </div>
      </div>

      {/* CONTENT DETAILS */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
        <div>
          <h3 className="font-bold text-sm text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1 leading-snug">
            {movie.title}
          </h3>

          <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
            <span className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-[10px] font-semibold">
              {movie.certification || "UA16+"}
            </span>
            {movie.duration && (
              <span>{movie.duration} min</span>
            )}
          </div>
        </div>

        <p className="text-[11px] font-medium text-gray-400 truncate mt-2">
          {primaryGenre}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;