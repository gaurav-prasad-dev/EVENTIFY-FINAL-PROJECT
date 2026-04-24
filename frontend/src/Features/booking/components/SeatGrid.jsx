const SeatGrid = ({ seats, selectedSeats = [], handleSeatClick }) => {
  const grouped = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {});

  return (
    <div className="flex justify-center mt-16 px-4">

      <div className="bg-white px-10 py-12 rounded-3xl shadow-xl">

        {/* 🎬 SCREEN */}
        <div className="mb-14 flex flex-col items-center">
          <div className="w-[420px] h-2 bg-gradient-to-r from-gray-200 via-gray-400 to-gray-200 rounded-full shadow-inner"></div>
          <p className="text-xs text-gray-500 mt-2 tracking-widest">
            SCREEN THIS WAY
          </p>
        </div>

        {/* 🎟️ SEATS */}
        {Object.keys(grouped).map((row) => (
          <div key={row} className="flex items-center gap-6 mb-6">

            {/* Row label */}
            <span className="w-6 text-sm font-medium text-gray-600">
              {row}
            </span>

            {/* Seats */}
            <div className="flex gap-3">
              {grouped[row].map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.id === seat.id
                );

                return (
                  <div
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`w-11 h-11 flex items-center justify-center rounded-lg text-sm font-medium border transition-all duration-200

                    ${
                      seat.status === "BOOKED"
                        ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                        : isSelected
                        ? "bg-blue-500 text-white scale-110 shadow-md"
                        : "bg-white hover:border-blue-400 hover:scale-105 cursor-pointer"
                    }
                    `}
                  >
                    {seat.number}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 🎨 LEGEND */}
        <div className="flex justify-center gap-8 mt-10 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border rounded"></div>
            Available
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
            Booked
          </div>

          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            Selected
          </div>
        </div>

      </div>
    </div>
  );
};

export default SeatGrid;