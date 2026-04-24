const BottomBar = ({ selectedSeats, onProceed }) => {
  if (selectedSeats.length === 0) return null; // 🔥 hide when no seat

  const total = selectedSeats.length * 200;

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
        className="px-8 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition text-sm font-medium"
      >
        Proceed
      </button>
    </div>
  );
};

export default BottomBar;