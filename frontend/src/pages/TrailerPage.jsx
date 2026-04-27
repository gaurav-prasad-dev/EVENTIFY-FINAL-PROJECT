import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMovieDetails,
  fetchMovieVideos,
} from "../Features/movies/movieSlice";

const TrailerPage = () => {
  const { movieId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  

  const { movieDetails, trailerKey, loading } = useSelector(
    (state) => state.movies
  );

  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
    dispatch(fetchMovieVideos(movieId));
  }, [movieId, dispatch]);

  // ⏳ Loading
  if (loading || !movieDetails) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* 🔥 BLURRED BACKGROUND */}
      <div
        className="fixed inset-0 bg-cover bg-center blur-2xl scale-110 opacity-40 z-0"
        style={{
          backgroundImage: `url(${
            movieDetails.backdrop || movieDetails.poster
          })`,
        }}
      />

      {/* 🔙 BACK BUTTON */}
<button
  onClick={() => navigate(-1)}
  className="fixed mt-12 top-4 left-4 z-[100] bg-black/70 text-white px-3 py-2 rounded-full backdrop-blur-md"
>
  ←
</button>

{/* ❌ CLOSE BUTTON */}
<button
  onClick={() => navigate(-1)}
  className="fixed mt-12 top-4 right-4 z-[100] bg-black/70 text-white px-3 py-2 rounded-full backdrop-blur-md"
>
  ✕
</button>

      {/* 🎬 CONTENT */}
      <div className="relative z-10 flex flex-col items-center px-4 py-10">

        {/* 🎥 VIDEO PLAYER */}
        <div className="w-[95%] md:w-[80%] lg:w-[70%] h-[220px] md:h-[350px] lg:h-[420px] bg-black rounded-2xl overflow-hidden shadow-2xl">

          {trailerKey ? (
            <iframe
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              className="w-full h-full"
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center text-white h-full">
              Trailer not available
            </div>
          )}

        </div>

        {/* 🎥 MOVIE INFO */}
        <div className="max-w-3xl text-center mt-6">

          <h1 className="text-2xl md:text-3xl font-bold">
            {movieDetails.title}
          </h1>

          <p className="text-gray-300 mt-2 text-sm">
            {movieDetails.certification || "U/A"} •{" "}
            {movieDetails.language?.toUpperCase() || "EN"} •{" "}
            {movieDetails.runtime || "--"} min • ⭐{" "}
            {movieDetails.rating || "--"}
          </p>

          {/* 📖 DESCRIPTION */}
          <p className="text-gray-200 mt-4 text-sm leading-relaxed">
            {movieDetails.overview || "No description available."}
          </p>

        </div>

      </div>
    </div>
  );
};

export default TrailerPage;