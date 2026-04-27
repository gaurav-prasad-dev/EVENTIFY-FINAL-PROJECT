import { useState, useEffect } from "react";
import { getHomeData } from "../Features/movies/movieApi";
import MovieRow from "../Features/movies/components/MovieRow";
import { getEventData } from "../Features/events/eventApi";
import EventR from "../Features/events/components/EventR";
import Footer from "../components/common/Footer";

function Home() {
  const [movies, setMovies] = useState(null);
  const [events, setEvents] = useState(null);

  useEffect(() => {
    fetchEvents();
    fetchHome();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await getEventData();
      setEvents(res);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchHome = async () => {
    try {
      const res = await getHomeData();
      setMovies(res);
    } catch (error) {
      console.log(error);
    }
  };

  if (!movies) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg animate-pulse text-gray-600">
          Loading amazing content...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HERO SPACING (important for navbar overlap) */}
      <div className="h-[70px]" />

      {/* MAIN CONTENT */}
      <div className="max-w-[1400px] mx-auto">

        {/* MOVIES */}
        <div className="space-y-10">
          <MovieRow title="🔥 Top Movies Near You" movies={movies?.nowPlaying} />
          <MovieRow title="⭐ Popular Movies" movies={movies?.popular} />
          <MovieRow title="🎬 Upcoming Movies" movies={movies?.upcoming} />
        </div>

        {/* EVENTS */}
        <div className="mt-14 space-y-10">
          <EventR title="🎵 Music Events" events={events?.music} />
          <EventR title="🏏 Sports Events" events={events?.sports} />
          <EventR title="😂 Comedy Shows" events={events?.comedy} />
        </div>

      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default Home;