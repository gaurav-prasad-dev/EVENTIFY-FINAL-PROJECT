import { useParams, useNavigate } from "react-router-dom";
import { getShows } from "../../booking/showApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMovieDetails } from "../movieSlice";
import { setBookingMeta } from "../../booking/bookSlice";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { movieDetails, loading } = useSelector((state) => state.movies);

  const { movieId, city } = useParams();
  const decodedCity = decodeURIComponent(city);

  const [selectedDate, setSelectedDate] = useState(null);
  const [shows, setShows] = useState([]);

  // 📅 Dates
  const getNext5Days = () => {
    const days = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      days.push({
        fullDate: date,
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        date: date.getDate(),
      });
    }
    return days;
  };

  const dates = getNext5Days();

  // ✅ Set default date
  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

  // 🎬 Fetch movie details
  useEffect(() => {
    dispatch(fetchMovieDetails(movieId));
  }, [dispatch, movieId]);

  // 🎬 Fetch shows
  useEffect(() => {
    if (!selectedDate) return;

    const fetchShows = async () => {
      const formattedDate = selectedDate.toISOString().split("T")[0];
      const data = await getShows(movieId, decodedCity, formattedDate);

      console.log("SHOWS:", data); // ✅ debug

      setShows(data || []);
    };

    fetchShows();
  }, [selectedDate, movieId, decodedCity]);

  if (loading || !movieDetails) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto p-6 flex gap-6 items-center">
        <img
          src={movieDetails.poster}
          alt={movieDetails.title}
          className="w-32 rounded-xl"
        />

        <div>
          <h1 className="text-2xl font-semibold">
            {movieDetails.title}
          </h1>

          <p className="text-gray-500">
            {movieDetails.certification} | {movieDetails.language} |{" "}
            {movieDetails.runtime} min
          </p>
        </div>
      </div>

      {/* 📅 DATE SELECTOR */}
      <div className="max-w-6xl mx-auto px-6 mt-4 flex gap-3">
        {dates.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedDate(d.fullDate)}
            className={`px-4 py-2 rounded-lg border ${
              selectedDate?.toDateString() === d.fullDate.toDateString()
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            <div>{d.day}</div>
            <div>{d.date}</div>
          </button>
        ))}
      </div>

      {/* 🎬 SHOWS */}
      <div className="max-w-6xl mx-auto px-6 mt-8">

        {shows.length === 0 ? (
          <div className="text-gray-500 text-center mt-10">
            No shows available for this date
          </div>
        ) : (
          shows.map((theatre, index) => (
            <div key={index} className="bg-white p-5 mb-6 rounded-xl">

              <h3 className="font-semibold mb-3">
                {theatre.theatreName}
              </h3>

              {theatre.screens?.map((screen, i) => (
                <div key={i} className="mb-3">

                  <h4 className="text-sm text-gray-600">
                    {screen.screenName}
                  </h4>

                  <div className="flex gap-3 mt-2 flex-wrap">
                    {screen.shows?.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => {
                          dispatch(
                            setBookingMeta({
                              movieName: movieDetails.title,
                              theatreName: theatre.theatreName,
                              city: decodedCity,
                              showDate: selectedDate.toDateString(),
                              showTime: s.time,
                              poster: movieDetails.poster,
                              allShows: screen.shows.map(x => x.time),
                            })
                          );

                          navigate(`/seat-layout/${s.showId}`);
                        }}
                        className="border px-4 py-2 rounded-lg hover:bg-green-50"
                      >
                        {s.time}
                      </button>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default MovieDetails;