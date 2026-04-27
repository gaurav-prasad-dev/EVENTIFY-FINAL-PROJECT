import { useMemo } from "react";

const SeatGrid = ({
  seats = [],
  selectedSeats = [],
  handleSeatClick,
  lockingSeat = false,
}) => {

  const grouped = useMemo(() => {
    if (!Array.isArray(seats)) return {};

    return seats.reduce((acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = [];
      acc[seat.row].push(seat);
      return acc;
    }, {});
  }, [seats]);

  return (
    <div className="flex justify-center mt-12 px-4">
      <div className="bg-white px-12 py-10 rounded-3xl shadow-lg">

        {/* SCREEN */}
        <div className="mb-14 text-center">
          <div className="w-[420px] h-2 bg-gray-300 rounded-full mx-auto"></div>
          <p className="text-xs mt-2 text-gray-500 tracking-widest">
            SCREEN THIS WAY
          </p>
        </div>

        {/* SEATS */}
        {Object.keys(grouped).length === 0 && (
          <div className="text-center text-gray-500">
            No seats available
          </div>
        )}

        {Object.keys(grouped).map((row) => (
          <div key={row} className="flex items-center gap-6 mb-5">

            <span className="w-6 text-sm text-gray-600">{row}</span>

            <div className="flex gap-3 flex-wrap">
              {grouped[row].map((seat) => {
                const isSelected = selectedSeats.some(
                  (s) => s.id === seat.id
                );

                const isDisabled =
                  seat.status === "BOOKED" ||
                  seat.status === "LOCKED" ||
                  lockingSeat; // 🚨 prevent spam

                return (
                  <div
                    key={seat.id}
                    onClick={() => {
                     if (seat.status === "BOOKED") return;
if (lockingSeat && !isSelected) return;

handleSeatClick(seat);
                    }}
                    className={`w-10 h-10 flex items-center justify-center rounded-md text-xs border transition

                    ${
                      seat.status === "BOOKED"
                        ? "bg-gray-300 text-gray-400"
                        : seat.status === "LOCKED"
                        ? "bg-yellow-300 text-yellow-800"
                        : isSelected
                        ? "bg-purple-600 text-white scale-110"
                        : "bg-white hover:border-blue-400"
                    }

                    ${isDisabled ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                    `}
                  >
                    {seat.number}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* LEGEND */}
        <div className="flex justify-center gap-8 mt-10 text-sm">
          <span>⬜ Available</span>
          <span>🟡 Locked</span>
          <span>⬛ Booked</span>
          <span>🟪 Selected</span>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;