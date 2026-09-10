import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { IoSearchOutline, IoCloseCircleOutline, IoStarSharp } from "react-icons/io5";
import { searchCatalogMovies } from "../../Features/movies/movieApi";

const SearchBar = ({ className = "" }) => {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);

  const selectedCity = useSelector(
    (state) => state.location?.city || "Indore"
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Debounced live search across platform catalog
  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await searchCatalogMovies(trimmed);
        const list = Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res)
          ? res
          : res?.movies || [];
        setResults(list.slice(0, 8));
        setIsOpen(true);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleSelectMovie = (movie) => {
    setIsOpen(false);
    setQuery("");
    const citySlug = encodeURIComponent(selectedCity);
    navigate(`/movies/${movie.id}/${citySlug}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        handleSelectMovie(results[0]);
      } else if (query.trim()) {
        navigate(`/movies`);
        setIsOpen(false);
      }
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div
      ref={searchContainerRef}
      className={`relative w-full ${className}`}
    >
      {/* INPUT CONTAINER */}
      <div className="group relative flex items-center w-full">
        <IoSearchOutline className="absolute left-3.5 text-lg text-gray-400 group-focus-within:text-purple-600 transition-colors pointer-events-none" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search movies, events, shows..."
          className="w-full pl-10 pr-10 py-2 bg-gray-50/90 hover:bg-gray-100/80 focus:bg-white text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 rounded-full border border-gray-200/90 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all duration-200 shadow-xs focus:shadow-sm"
        />

        {/* LOADING SPINNER OR CLEAR BUTTON */}
        <div className="absolute right-3 flex items-center">
          {loading ? (
            <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          ) : query ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
            >
              <IoCloseCircleOutline className="text-lg" />
            </button>
          ) : null}
        </div>
      </div>

      {/* AUTOCOMPLETE DROPDOWN */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
          {results.length > 0 ? (
            <div className="py-2 divide-y divide-gray-50 max-h-[380px] overflow-y-auto">
              <div className="px-4 py-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400">
                <span>Platform Catalog</span>
                <span className="text-[10px] lowercase text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100">
                  shows available
                </span>
              </div>

              {results.map((movie) => {
                const year = movie.releaseDate
                  ? new Date(movie.releaseDate).getFullYear()
                  : null;

                return (
                  <div
                    key={movie.id}
                    onClick={() => handleSelectMovie(movie)}
                    className="px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50/60 cursor-pointer transition-colors group/item"
                  >
                    {/* POSTER THUMB */}
                    <div className="w-10 h-14 bg-gray-100 rounded-lg overflow-hidden shrink-0 flex items-center justify-center border border-gray-100 shadow-xs">
                      {movie.poster ? (
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="w-full h-full object-cover group-hover/item:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <span className="text-xs text-gray-400 font-semibold">
                          🎬
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800 truncate group-hover/item:text-purple-600 transition-colors">
                        {movie.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        {year && <span>{year}</span>}
                        {movie.certification && (
                          <span className="px-1.5 py-0.2 bg-gray-100 text-gray-600 rounded text-[10px] font-medium">
                            {movie.certification}
                          </span>
                        )}
                        {movie.genres && movie.genres.length > 0 && (
                          <span className="truncate max-w-[150px]">
                            • {movie.genres.slice(0, 2).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* RATING */}
                    {movie.rating && Number(movie.rating) > 0 && (
                      <div className="flex items-center gap-1 text-xs font-semibold text-amber-500 shrink-0 bg-amber-50 px-2 py-1 rounded-md">
                        <IoStarSharp className="text-xs" />
                        <span>{movie.rating}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : !loading && query.trim().length >= 2 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              <p className="font-medium text-gray-700">No titles found matching "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching by title or franchise name
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
