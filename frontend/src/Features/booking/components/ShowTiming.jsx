import { useLocation } from "react-router-dom";

const ShowTiming = () => {
  const { state } = useLocation();

  return (
    <div className="bbg-white px-6 py-4 border-b">

      {/* 📅 DATE */}
      <p className="text-sm font-semibold text-gray-700 mb-3">
        {state?.showDate || "Today"}
      </p>

      {/* 🎬 SHOW TIMES */}
      <div className="flex gap-3 overflow-x-auto">
        {state?.allShows?.map((time) => (
          <button
            key={time}
            className={`px-4 py-2 rounded-lg border text-sm whitespace-nowrap transition
              ${
                time === state?.showTime
                  ? "bg-green-500 text-white border-green-500"
                  : "bg-white hover:border-green-400"
              }
            `}
          >
            {time}
          </button>
        ))}
      </div>

    </div>
  );
};

export default ShowTiming;