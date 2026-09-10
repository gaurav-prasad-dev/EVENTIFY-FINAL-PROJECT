
import MovieCard from "./MovieCard";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

const MovieRow = ({ title, movies = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 20);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 20);
    }
  };

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -480 : 480;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="relative group/row px-4 sm:px-6 py-6">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            {movies.length}
          </span>
        </div>

        <button
          onClick={() => navigate("/movies")}
          className="text-sm font-semibold text-purple-600 hover:text-purple-700 hover:underline flex items-center gap-1 transition"
        >
          See All
          <IoChevronForwardOutline className="text-xs" />
        </button>
      </div>

      {/* SCROLL BUTTONS */}
      <button
        type="button"
        onClick={() => handleScroll("left")}
        disabled={!canScrollLeft}
        className={`absolute left-2 top-[55%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollLeft ? "opacity-90 group-hover/row:opacity-100" : "opacity-0"
        }`}
        aria-label="Scroll Left"
      >
        <IoChevronBackOutline className="text-lg" />
      </button>

      <button
        type="button"
        onClick={() => handleScroll("right")}
        disabled={!canScrollRight}
        className={`absolute right-2 top-[55%] -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 shadow-xl border border-gray-100 flex items-center justify-center text-gray-700 hover:bg-black hover:text-white transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none ${
          canScrollRight ? "opacity-90 group-hover/row:opacity-100" : "opacity-0"
        }`}
        aria-label="Scroll Right"
      >
        <IoChevronForwardOutline className="text-lg" />
      </button>

      {/* MOVIE SCROLLER */}
      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-5 sm:gap-6 overflow-x-auto scroll-smooth scrollbar-hide py-2 px-1"
      >
        {movies.map((movie) => (
          <div key={movie.id || movie._id} className="flex-shrink-0">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* FADE GRADIENT (Right edge) */}
      <div className="pointer-events-none absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-gray-50 via-gray-50/50 to-transparent hidden md:block" />
    </div>
  );
};

export default MovieRow;