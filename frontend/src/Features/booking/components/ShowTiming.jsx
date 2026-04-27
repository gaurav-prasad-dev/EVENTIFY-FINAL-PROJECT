const ShowTiming = ({ showDate, showTime, allShows = [], onSelect }) => {

  const formatTime = (time) => {
    const d = new Date(time);
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="bg-white px-6 py-4 border-b">

      <p className="text-sm font-semibold text-gray-700 mb-3">
        {showDate ? formatDate(showDate) : "Loading..."}
      </p>

      <div className="flex gap-3 overflow-x-auto">
        {allShows.map((s) => (
          <button
            key={s.showId}
            onClick={() => onSelect(s)}
            className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap
              ${
                s.showId === showTime
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white hover:border-green-400"
              }`}
          >
            {formatTime(s.time)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowTiming;



//   return (
//     <div className="bg-white px-6 py-4 border-b">

//       {/* 📅 DATE */}
//     <p className="text-sm font-semibold text-gray-700 mb-3">
//   {showDate
//     ? new Date(showDate).toDateString()
//     : "Loading..."}
// </p>

//       {/* 🎬 SHOW TIMES */}
//       <div className="flex gap-3 overflow-x-auto">
//         {allShows.length === 0 ? (
//           <p className="text-gray-400 text-sm">No shows</p>
//         ) : (
//           allShows.map((show) => (
//             <button
//               key={show.showId}
//               onClick={() => onSelect(show)}
//               className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition
//                 ${
//                   show.time === showTime
//                     ? "bg-green-500 text-white border-green-500"
//                     : "bg-white hover:border-green-400"
//                 }
//               `}
//             >
//               {new Date(show.time).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   })}
//             </button>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default ShowTiming;