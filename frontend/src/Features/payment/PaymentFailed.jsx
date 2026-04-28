import { useNavigate, useParams } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        {/* ❌ ICON */}
        <div className="text-red-500 text-6xl mb-4">
          ❌
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-2">
          Payment Failed
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-600 mb-6">
          Oops! Your payment could not be completed.
          <br />
          Please try again or choose a different option.
        </p>

        {/* INFO BOX */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-700">
          <p>Booking ID:</p>
          <p className="font-semibold break-all">{bookingId}</p>
        </div>

        {/* ACTION BUTTONS */}
        <div className="space-y-3">

          {/* 🔁 RETRY */}
          <button
            onClick={() => navigate(`/checkout/${bookingId}`)}
            className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800"
          >
            Retry Payment
          </button>

          {/* 🪑 CHANGE SEATS */}
          <button
            onClick={() => navigate("/")}
            className="w-full border py-3 rounded-lg font-medium hover:bg-gray-50"
          >
            Choose Different Show
          </button>

        </div>

      </div>
    </div>
  );
};

export default PaymentFailed;