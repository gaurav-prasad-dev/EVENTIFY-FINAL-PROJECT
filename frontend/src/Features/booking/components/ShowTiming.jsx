const ShowTiming = ({ showDate, currentShowId, allShows = [], onSelect }) => {

  const formatTime = (time) => {
    if (!time) return "";
    if (typeof time === "string" && time.includes(":") && !time.includes("T")) {
      const [h, m] = time.split(":");
      const hours = parseInt(h, 10);
      const minutes = parseInt(m, 10);
      if (!isNaN(hours) && !isNaN(minutes)) {
        const ampm = hours >= 12 ? "PM" : "AM";
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes} ${ampm}`;
      }
    }
    const d = new Date(time);
    if (isNaN(d.getTime())) return time;
    return d.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    if (isNaN(d.getTime())) return String(date);
    return d.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  return (
    <div className="bg-white px-6 py-4 border-b">

      <p className="text-sm font-semibold text-gray-700 mb-3">
        {showDate ? formatDate(showDate) : "Select Showtime"}
      </p>

      <div className="flex gap-3 overflow-x-auto">
        {allShows.map((s) => {
          const isSelected = String(s.showId || s._id) === String(currentShowId);
          return (
            <button
              key={s.showId || s._id}
              onClick={() => onSelect(s)}
              className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition
                ${
                  isSelected
                    ? "bg-purple-600 text-white border-purple-600 font-bold shadow-xs"
                    : "bg-white hover:border-purple-300 text-gray-700"
                }`}
            >
              {formatTime(s.time || s.startTime)}
            </button>
          );
        })}
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