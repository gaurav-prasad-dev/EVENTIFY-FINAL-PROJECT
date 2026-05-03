import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchMovieDetails, fetchMovieVideos } from "../movieSlice";
import { getShowsByContent } from "../../show/showApi";

const MovieDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { movieDetails, loading } = useSelector((state) => state.movies);
  const { selectedCity } = useSelector((state) => state.location);

  const { contentId, city } = useParams();

  const [selectedDate, setSelectedDate] = useState(null);
  const [shows, setShows] = useState([]);

  // 📅 next 5 days
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

  // 🎬 load movie
  useEffect(() => {
    if (!contentId) return;

    dispatch(fetchMovieDetails(contentId));
    dispatch(fetchMovieVideos(contentId));

    setSelectedDate(new Date());
  }, [dispatch, contentId]);

  // 🎭 fetch shows (FIXED COMPLETELY)
  useEffect(() => {
    const fetchShows = async () => {
      try {
        if (!contentId || !selectedDate) return;

        const formattedDate = selectedDate.toLocaleDateString("en-CA");

        const cityId =
          selectedCity?._id || "69de98e1c1642617c42255c4";

        const res = await getShowsByContent(
          contentId,
          formattedDate,
          cityId
        );

        console.log("RAW RESPONSE:", res);

        // ✅ FIX: correct extraction
        const data = res || [];

        console.log("EXTRACTED DATA:", data);

        if (!Array.isArray(data)) {
          setShows([]);
          return;
        }

        const formattedShows = data.map((venue) => ({
          theatreName: venue.venueName,
          shows: Array.isArray(venue.shows)
            ? venue.shows.map((s) => ({
                showId: s.showId,
                time: s.startTime,
              }))
            : [],
        }));

        console.log("FORMATTED SHOWS:", formattedShows);

        setShows(formattedShows);
      } catch (err) {
        console.log("SHOW FETCH ERROR:", err);
        setShows([]);
      }
    };

    fetchShows();
  }, [contentId, selectedDate, selectedCity?._id]);

  // ⏳ loading
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg animate-pulse text-gray-600">
          Loading movie...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🎬 HEADER */}
      <div className="max-w-6xl mx-auto p-6 flex gap-6 items-center">

        <div
          className="relative cursor-pointer group"
          onClick={() => navigate(`/trailer/${contentId}/${city}`)}
        >
          <img
            src={movieDetails?.poster}
            alt={movieDetails?.title}
            className="w-40 rounded-xl shadow-lg"
          />

          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl">
            <div className="bg-white p-3 rounded-full">▶</div>
          </div>
        </div>

        <div>
          <h1 className="text-3xl font-semibold">
            {movieDetails?.title}
          </h1>

          <p className="text-gray-500 mt-2 text-sm">
            {movieDetails?.certification} |{" "}
            {movieDetails?.language?.toUpperCase()} |{" "}
            {movieDetails?.runtime} min
          </p>

          <button
            onClick={() =>
              navigate(`/movie/${contentId}/details`, {
                state: { background: location },
              })
            }
            className="mt-3 px-4 py-2 border rounded-lg hover:bg-gray-200"
          >
            View details
          </button>
        </div>
      </div>

      {/* 📅 DATE SELECTOR */}
      <div className="max-w-6xl mx-auto px-6 mt-4 flex gap-3 items-center">

        <div className="bg-gray-200 px-3 py-6 rounded-lg text-xs font-semibold text-gray-600 rotate-[-90deg]">
          {new Date().toLocaleString("en-US", { month: "short" })}
        </div>

        {dates.map((d, i) => {
          const isActive =
            selectedDate?.toDateString() === d.fullDate.toDateString();

          return (
            <button
              key={i}
              onClick={() => setSelectedDate(d.fullDate)}
              className={`px-4 py-2 rounded-xl transition ${
                isActive
                  ? "bg-black text-white"
                  : "bg-white hover:bg-gray-200"
              }`}
            >
              <p className="text-lg font-semibold">{d.date}</p>
              <p className="text-xs">{d.day}</p>
            </button>
          );
        })}
      </div>

      {/* 🎭 LEGEND */}
      <div className="max-w-6xl mx-auto px-6 mt-6 bg-gray-200 py-3 rounded-lg flex gap-6 text-sm text-gray-600">
        <span>⚫ Available</span>
        <span>🟡 Filling fast</span>
        <span>🔴 Almost full</span>
      </div>

      {/* 🎭 SHOWS */}
      <div className="max-w-6xl mx-auto px-6 mt-6">

        {shows.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            No shows available
          </div>
        ) : (
          shows.map((theatre, index) => (
            <div
              key={index}
              className="bg-white p-5 mb-6 rounded-2xl shadow-sm"
            >
              <h3 className="font-semibold text-lg">
                {theatre.theatreName}
              </h3>

              <div className="flex gap-3 mt-4 flex-wrap">
                {theatre.shows.map((s) => (
                  <button
                    key={s.showId}
                    onClick={() =>
                      navigate(`/seat-layout/${contentId}/${s.showId}`)
                    }
                    className="px-4 py-2 border rounded-lg text-sm hover:bg-green-50"
                  >
                    {s.time}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MovieDetails;







//gggg



// import { useParams, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import { fetchMovieDetails, fetchMovieVideos } from "../movieSlice";
// import { getShowsByContent } from "../../show/showApi";

// const MovieDetails = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { movieDetails, loading } = useSelector((state) => state.movies);
//   const { selectedCity } = useSelector((state) => state.location);

//   // ✅ route params
//   const { contentId, city } = useParams();
//   const decodedCity = decodeURIComponent(city);

//   const [selectedDate, setSelectedDate] = useState(null);
//   const [shows, setShows] = useState([]);

//   // 📅 next 5 days
//   const getNext5Days = () => {
//     const days = [];
//     for (let i = 0; i < 5; i++) {
//       const date = new Date();
//       date.setDate(date.getDate() + i);

//       days.push({
//         fullDate: date,
//         day: date.toLocaleDateString("en-US", { weekday: "short" }),
//         date: date.getDate(),
//       });
//     }
//     return days;
//   };

//   const dates = getNext5Days();

//   // 🎬 load movie (TMDB details only)
//   useEffect(() => {
//     if (!contentId) return;

//     dispatch(fetchMovieDetails(contentId));
//     dispatch(fetchMovieVideos(contentId));

//     setSelectedDate(new Date());
//   }, [dispatch, contentId]);

//   // 🎭 fetch shows (IMPORTANT FIXED)
//   useEffect(() => {
//     const fetchShows = async () => {
//       try {
//         if (!contentId || !selectedDate) return;

//         const formattedDate = selectedDate.toLocaleDateString("en-CA");

//         const cityId =
//           selectedCity?._id || "69de98e1c1642617c42255c4";

//         const res = await getShowsByContent(
//           contentId,
//           formattedDate,
//           cityId
//         );

//         console.log(res);

//         if (!Array.isArray(res)) {
//   setShows([]);
//   return;
// }

//         const data = res?.data?.data || [];


//         const formattedShows = data.map((venue) => ({
//           theatreName: venue.venueName,
//           shows: venue.shows.map((s) => ({
//             showId: s.showId,
//             time: s.startTime,
//           })),
//         }));

//         console.log(formattedShows);
//         setShows(formattedShows);
//       } catch (err) {
//         console.log("SHOW FETCH ERROR:", err);
//         setShows([]);
//       }
//     };

//     fetchShows();
//   }, [contentId, selectedDate, selectedCity?._id]);

//   // ⏳ loading
//   if (loading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-gray-100">
//         <div className="text-lg animate-pulse text-gray-600">
//           Loading movie...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 min-h-screen">

//       {/* 🎬 HEADER */}
//       <div className="max-w-6xl mx-auto p-6 flex gap-6 items-center">

//         <div
//           className="relative cursor-pointer group"
//           onClick={() => navigate(`/trailer/${contentId}/${city}`)}
//         >
//           <img
//             src={movieDetails?.poster}
//             alt={movieDetails?.title}
//             className="w-40 rounded-xl shadow-lg"
//           />

//           <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl">
//             <div className="bg-white p-3 rounded-full">▶</div>
//           </div>
//         </div>

//         <div>
//           <h1 className="text-3xl font-semibold">
//             {movieDetails?.title}
//           </h1>

//           <p className="text-gray-500 mt-2 text-sm">
//             {movieDetails?.certification} |{" "}
//             {movieDetails?.language?.toUpperCase()} |{" "}
//             {movieDetails?.runtime} min
//           </p>

//           <button
//             onClick={() =>
//               navigate(`/movie/${contentId}/details`, {
//                 state: { background: location },
//               })
//             }
//             className="mt-3 px-4 py-2 border rounded-lg hover:bg-gray-200"
//           >
//             View details
//           </button>
//         </div>
//       </div>

//       {/* 📅 DATE SELECTOR */}
//       <div className="max-w-6xl mx-auto px-6 mt-4 flex gap-3 items-center">

//         <div className="bg-gray-200 px-3 py-6 rounded-lg text-xs font-semibold text-gray-600 rotate-[-90deg]">
//           {new Date().toLocaleString("en-US", { month: "short" })}
//         </div>

//         {dates.map((d, i) => {
//           const isActive =
//             selectedDate?.toDateString() === d.fullDate.toDateString();

//           return (
//             <button
//               key={i}
//               onClick={() => setSelectedDate(d.fullDate)}
//               className={`px-4 py-2 rounded-xl transition ${
//                 isActive
//                   ? "bg-black text-white"
//                   : "bg-white hover:bg-gray-200"
//               }`}
//             >
//               <p className="text-lg font-semibold">{d.date}</p>
//               <p className="text-xs">{d.day}</p>
//             </button>
//           );
//         })}
//       </div>

//       {/* 🎭 LEGEND */}
//       <div className="max-w-6xl mx-auto px-6 mt-6 bg-gray-200 py-3 rounded-lg flex gap-6 text-sm text-gray-600">
//         <span>⚫ Available</span>
//         <span>🟡 Filling fast</span>
//         <span>🔴 Almost full</span>
//       </div>

//       {/* 🎭 SHOWS */}
//       <div className="max-w-6xl mx-auto px-6 mt-6">

//         {shows.length === 0 ? (
//           <div className="text-center text-gray-500 mt-10">
//             No shows available
//           </div>
//         ) : (
//           shows.map((theatre, index) => (
//             <div
//               key={index}
//               className="bg-white p-5 mb-6 rounded-2xl shadow-sm"
//             >
//               <h3 className="font-semibold text-lg">
//                 {theatre.theatreName}
//               </h3>

//               <div className="flex gap-3 mt-4 flex-wrap">
//                 {theatre.shows.map((s) => (
//                   <button
//                     key={s.showId}
//                     onClick={() =>
//                       navigate(`/seat-layout/${contentId}/${s.showId}`)
//                     }
//                     className="px-4 py-2 border rounded-lg text-sm hover:bg-green-50"
//                   >
//                     {s.time}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default MovieDetails;

