import { useState, useEffect } from "react";
import { getHomeData } from "../Features/movies/movieApi";
import MovieRow from "../Features/movies/components/MovieRow";
import Footer from "../components/common/Footer";

function Movie() {
  const [movies, setMovies] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const res = await getHomeData();
      setMovies(res || {});
    } catch (error) {
      console.log("FETCH MOVIES ERROR:", error);
      setMovies({});
    } finally {
      setLoading(false);
    }
  };

  if (loading && !movies) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg animate-pulse text-gray-600">
          Loading movies...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Spacing for fixed navbar */}
      <div className="h-[70px]" />

      <div className="max-w-[1400px] mx-auto">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Explore Movies
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse the latest releases, popular hits, and upcoming movies in your city.
          </p>
        </div>

        {/* MOVIES SECTIONS */}
        <div className="space-y-10">
          <MovieRow
            title="🔥 Now Playing in Cinemas"
            movies={movies?.nowPlaying || []}
          />

          <MovieRow
            title="⭐ Most Popular Hits"
            movies={movies?.popular || []}
          />

          <MovieRow
            title="🎬 Coming Soon to Theatres"
            movies={movies?.upcoming || []}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Movie;