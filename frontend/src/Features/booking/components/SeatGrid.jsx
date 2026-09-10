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
    <div className="flex justify-center mt-6 sm:mt-10 px-2 sm:px-4">
      <div className="bg-white w-full max-w-4xl px-3 sm:px-8 md:px-12 py-6 sm:py-10 rounded-2xl sm:rounded-3xl shadow-md border border-gray-100 overflow-hidden">

        {/* SCREEN */}
        <div className="mb-6 sm:mb-10 text-center">
          <div className="w-full max-w-[280px] sm:max-w-[420px] h-2 bg-gradient-to-r from-transparent via-purple-300 to-transparent rounded-full mx-auto shadow-xs"></div>
          <p className="text-[11px] sm:text-xs mt-2 text-gray-400 font-semibold tracking-widest uppercase">
            SCREEN THIS WAY
          </p>
        </div>

        {/* MOBILE SCROLL HINT */}
        <div className="block md:hidden text-center mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-medium border border-purple-100">
            ↔️ Swipe sideways to view all seats
          </span>
        </div>

        {/* SEATS CONTAINER (Smooth horizontal touch scrolling on mobile) */}
        <div className="overflow-x-auto pb-4 scrollbar-hide touch-pan-x">
          <div className="inline-block min-w-full text-center">
            {Object.keys(grouped).length === 0 && (
              <div className="text-center text-gray-500 py-6 text-sm">
                No seats available
              </div>
            )}

            {Object.keys(grouped).map((row) => (
              <div
                key={row}
                className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6 mb-2.5 sm:mb-3.5 whitespace-nowrap"
              >
                <span className="w-5 sm:w-6 text-xs sm:text-sm font-bold text-gray-500 text-center select-none shrink-0">
                  {row}
                </span>

                <div className="flex gap-1.5 sm:gap-2.5 items-center">
                  {grouped[row].map((seat) => {
                    const isMyLocked = seat.status === "MY_LOCKED";
                    const isSelected =
                      isMyLocked || selectedSeats.some((s) => s.id === seat.id);

                    const isDisabled =
                      seat.status === "BOOKED" ||
                      (seat.status === "LOCKED" && !isMyLocked) ||
                      lockingSeat;

                    return (
                      <div
                        key={seat.id}
                        onClick={() => {
                          if (seat.status === "BOOKED") return;
                          if (lockingSeat && !isSelected) return;
                          handleSeatClick(seat);
                        }}
                        className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center rounded-md text-[10px] sm:text-xs border font-semibold transition select-none shrink-0 active:scale-95
                        ${
                          seat.status === "BOOKED"
                            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
                            : isSelected
                            ? "bg-purple-600 text-white border-purple-600 scale-105 shadow-xs"
                            : seat.status === "LOCKED"
                            ? "bg-amber-300 text-amber-900 border-amber-400 cursor-not-allowed"
                            : "bg-white hover:border-purple-400 text-gray-700 border-gray-300 cursor-pointer"
                        }
                        ${isDisabled ? "opacity-75" : ""}
                        `}
                      >
                        {seat.number}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* LEGEND */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2.5 sm:gap-6 mt-8 sm:mt-10 text-xs sm:text-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium select-none shadow-xs justify-center sm:justify-start">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md border border-gray-300 bg-white inline-block"></span>
            <span>Available</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium select-none shadow-xs justify-center sm:justify-start">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-purple-600 border border-purple-600 inline-block shadow-xs"></span>
            <span>Selected</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium select-none shadow-xs justify-center sm:justify-start">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-amber-300 border border-amber-400 inline-block"></span>
            <span>Locked</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 font-medium select-none shadow-xs justify-center sm:justify-start">
            <span className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md bg-gray-200 border border-gray-200 inline-block"></span>
            <span>Booked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;