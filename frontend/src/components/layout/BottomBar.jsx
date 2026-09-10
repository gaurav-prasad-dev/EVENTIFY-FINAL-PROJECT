const BottomBar = ({ selectedSeats = [], onProceed }) => {

  const total = selectedSeats.reduce((acc, s) => acc + (s.price || 200), 0);

  const seatNames = selectedSeats.map((s) => s.id || `${s.row || ""}${s.number || ""}`).join(", ");

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 sm:px-8 py-3 sm:py-4 flex justify-between items-center border-t border-gray-200 pb-[max(0.75rem,env(safe-area-inset-bottom))] transition-all">
      <div className="min-w-0 pr-3">
        <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">
          {selectedSeats.length} {selectedSeats.length === 1 ? "Seat" : "Seats"} Selected
          {seatNames ? ` • ${seatNames}` : ""}
        </p>
        <p className="text-base sm:text-xl font-bold text-gray-900 mt-0.5">
          ₹{total.toLocaleString("en-IN")}
        </p>
      </div>

      <button
        onClick={onProceed}
        disabled={selectedSeats.length === 0}
        className={`px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 active:scale-95 shadow-sm
          ${
            selectedSeats.length === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-200"
              : "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer shadow-purple-500/25"
          }`}
      >
        Proceed to Book
      </button>
    </div>
  );
};

export default BottomBar;