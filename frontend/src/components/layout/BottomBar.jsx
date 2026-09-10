const BottomBar = ({ selectedSeats = [], onProceed }) => {

  const total = selectedSeats.reduce((acc, s) => acc + (s.price || 200), 0);

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg px-8 py-4 flex justify-between items-center border-t">

      <div>
        <p className="text-sm text-gray-500">
          {selectedSeats.length} Seats Selected
        </p>
        <p className="text-lg font-semibold">
          ₹{total}
        </p>
      </div>

      <button
        onClick={onProceed}
        disabled={selectedSeats.length === 0}
        className={`px-8 py-3 rounded-xl text-sm font-medium transition
          ${selectedSeats.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-black text-white hover:bg-gray-800 cursor-pointer"
          }`}>
        Proceed
      </button>
    </div>
  );
};

export default BottomBar;