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
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-10 space-y-10">
          <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />
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
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-[1400px] mx-auto pt-6 pb-12">
        <div className="px-4 sm:px-6 pb-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore Movies in Catalog
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse movies curated and scheduled by cinema organizers with live seat availability.
          </p>
        </div>

        {/* MOVIES SECTIONS */}
        <div className="space-y-6">
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