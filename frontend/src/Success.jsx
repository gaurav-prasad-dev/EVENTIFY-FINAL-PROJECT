import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById } from "./Features/booking/bookingApi";

const Success = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.booking);
      } catch (err) {
        console.error("GET BOOKING ERROR:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading your ticket...</div>;
  }

  if (!booking) {
    return (
      <div className="text-center mt-10">
        <p className="text-gray-500 mb-4">Booking not found</p>
        <button
          onClick={() => navigate("/")}
          className="bg-black text-white px-4 py-2 rounded-lg cursor-pointer"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const show = booking.show;
  const content = show?.content;
  const movieTitle = content?.title || show?.movieName || "Movie";
  const venueName = show?.screen?.venue?.name || show?.theatreName || "Cinema";

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">
        {/* ✅ SUCCESS TITLE */}
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Payment Successful 🎉
        </h2>

        {/* 🎬 MOVIE DETAILS */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">{movieTitle}</h3>
          <p className="text-gray-500 text-sm">{venueName}</p>
        </div>

        <hr className="my-4" />

        {/* 💺 SEATS */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Seats</span>
          <span className="font-medium">{(booking.seats || []).join(", ")}</span>
        </div>

        {/* 💳 PAYMENT */}
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Payment ID</span>
          <span className="font-medium text-xs truncate max-w-[200px]">
            {booking.paymentId || booking.orderId || booking.bookingId}
          </span>
        </div>

        {/* 🎟 QR CODE */}
        <div className="mt-6 flex flex-col items-center justify-center">
          {booking.qrCode ? (
            <img
              src={booking.qrCode}
              alt="Ticket QR Code"
              className="w-44 h-44 object-contain border p-2 rounded-xl shadow-xs"
            />
          ) : (
            <div className="w-44 h-44 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-xs">
              QR Code generating...
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Show this QR at entry
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 w-full bg-black text-white py-2.5 rounded-xl font-medium cursor-pointer hover:bg-gray-800 transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;
