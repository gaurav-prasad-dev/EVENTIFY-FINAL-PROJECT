import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const { city } = useSelector((state) => state.location);

  
const handleClick = () => {

  
  const cityName = city?.name || "Indore"; // fallback

  navigate(`/movies/${movie.id}/${encodeURIComponent(cityName)}`);
};

  return (
    <div onClick={handleClick} className="min-w-[180px] max-w-[180px] cursor-pointer">

      <img
        src={movie.poster}
        alt={movie.title}
        className="rounded-t-xl h-[260px] w-full object-cover"
      />

      <div className="p-3">
        <h3 className="font-semibold text-sm">{movie.title}</h3>

        <p className="text-xs text-gray-500">
          {movie.adult ? "A" : "UA"} | Hindi
        </p>
      </div>
    </div>
  );
};

export default MovieCard;