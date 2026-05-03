import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookingById } from "./Features/booking/bookingApi";

const Success = () => {
  
  const { bookingId } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     if (!bookingId) {
    setLoading(false); // ✅ stop loading
    return;
  }
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.booking);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };


    if (bookingId) fetchBooking();
  }, [bookingId]);

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (!booking) {
    return <div className="text-center mt-10">Booking not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-md w-full">

        {/* ✅ SUCCESS TITLE */}
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Payment Successful 🎉
        </h2>

        {/* 🎬 MOVIE DETAILS */}
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">
            {booking.show?.movieName || "Movie"}
          </h3>
          <p className="text-gray-500 text-sm">
            {booking.show?.theatreName}
          </p>
        </div>

        <hr className="my-4" />

        {/* 💺 SEATS */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Seats</span>
          <span className="font-medium">
            {booking.seats.join(", ")}
          </span>
        </div>

        {/* 💳 PAYMENT */}
        <div className="flex justify-between text-sm mt-2">
          <span className="text-gray-500">Payment ID</span>
          <span className="font-medium">
            {booking.paymentId}
          </span>
        </div>

        {/* 🎟 QR CODE */}
        <div className="mt-6 flex justify-center">
          <img
            src={booking.qrCode}
            alt="QR Code"
            className="w-40 h-40"
          />
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Show this QR at entry
        </p>

      </div>
    </div>
  );
};

export default Success;