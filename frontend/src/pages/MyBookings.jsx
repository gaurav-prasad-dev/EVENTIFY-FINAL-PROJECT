// pages/MyBookings.jsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookingsThunk } from "../Features/booking/bookSlice";

function MyBookings() {
  const dispatch = useDispatch();
  const { myBookings, loadingMyBookings } = useSelector(
    (state) => state.booking
  );

  const [movieMap, setMovieMap] = useState({});

  useEffect(() => {
    dispatch(fetchMyBookingsThunk());
  }, [dispatch]);

  // 🎬 Fetch movie details from TMDB
  useEffect(() => {
    const fetchMovies = async () => {
      const temp = {};

      for (let b of myBookings) {
        const show = b.show;

        if (show?.contentType === "movie" && show.movieId) {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/movie/${show.movieId}?api_key=YOUR_API_KEY`
            );
            const data = await res.json();
            temp[show.movieId] = data;
          } catch (err) {
            console.log(err);
          }
        }
      }

      setMovieMap(temp);
    };

    if (myBookings.length) fetchMovies();
  }, [myBookings]);

  if (loadingMyBookings) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <h2 className="text-xl font-semibold mb-4">My Bookings</h2>

      {myBookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        myBookings.map((b) => {
          const show = b.show;

          const isMovie = show?.contentType === "movie";

          const movieData = movieMap[show?.movieId];

          const title = isMovie
            ? movieData?.title || "Loading..."
            : show?.contentId?.title;

          const poster = isMovie
            ? movieData?.poster_path
              ? `https://image.tmdb.org/t/p/w200${movieData.poster_path}`
              : ""
            : show?.contentId?.poster;

          const venue =
            show?.screen?.venue?.name || "Unknown Venue";

          return (
            <div
              key={b._id}
              className="bg-white p-4 rounded-xl shadow mb-4 flex gap-4"
            >
              {poster && (
                <img
                  src={poster}
                  className="w-20 h-28 rounded object-cover"
                />
              )}

              <div>
                <h3 className="font-semibold">{title}</h3>

                <p className="text-sm text-gray-500">
                  {venue}
                </p>

                <p className="text-sm">
                  Screen: {show?.screen?.name}
                </p>

                <p className="text-sm">
                  Seats: {b.seats.join(", ")}
                </p>

                <p className="text-sm text-gray-500">
                  {new Date(show.startTime).toLocaleString()}
                </p>

                <p className="text-green-600 text-sm">
                  {b.bookingStatus}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

export default MyBookings;