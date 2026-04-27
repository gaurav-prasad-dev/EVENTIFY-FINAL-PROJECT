import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { city } = useSelector((state) => state.location);

  const handleClick = () => {
    const cityName = city || "Indore";
    navigate(`/movies/${movie.id}/${encodeURIComponent(cityName)}`);
  };

  return (
    <div
      onClick={handleClick}
      className="min-w-[200px] max-w-[200px] cursor-pointer rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative">
        <img
          src={movie.poster}
          alt={movie.title}
          className="h-[270px] w-full object-cover"
        />

        {/* Gradient overlay (subtle) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 hover:opacity-100 transition" />
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
          {movie.title}
        </h3>

        <p className="text-xs text-gray-500 mt-1">
          {movie.adult ? "A" : "UA16+"} | Hindi
        </p>
      </div>
    </div>
  );
};

export default MovieCard;