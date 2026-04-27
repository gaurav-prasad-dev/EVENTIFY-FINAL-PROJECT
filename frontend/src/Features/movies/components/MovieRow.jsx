
import MovieCard from "./MovieCard";
import { useRef } from "react";

const MovieRow = ({ title, movies }) => {
  const scrollRef = useRef();

  return (
    <div className="px-6 py-8 relative">

      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
          {title}
        </h2>

        <button className="text-sm text-red-500 hover:underline">
          See All
        </button>
      </div>

      {/* MOVIE SCROLLER */}
      <div
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto scroll-smooth scrollbar-hide pb-2"
      >
        {movies?.map((movie) => (
          <div key={movie.id} className="flex-shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* FADE EFFECT (Right Side) */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white to-transparent" />
    </div>
  );
};

export default MovieRow;