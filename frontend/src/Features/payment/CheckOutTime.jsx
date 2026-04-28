import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getBookingById } from "../booking/bookingApi";
import { fetchShowById } from "../show/showSlice";
import { fetchMovieDetails } from "../movies/movieSlice";

import {
  createOrderThunk,
  verifyPaymentThunk,
} from "../payment/paymentTimeSlice";

const Checkout = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentShow } = useSelector((state) => state.shows);
  const { movieDetails } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);

  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  // =========================
  // 🔥 STEP 1: FETCH BOOKING
  // =========================
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        setBooking(res.booking);

        // 🔥 fetch show
        // ✅ SAFE FIX
const showId =
  typeof res.booking.show === "object"
    ? res.booking.show._id
    : res.booking.show;
        dispatch(fetchShowById(showId));
      } catch (err) {
        console.log(err);
      }
    };

    fetchBooking();
  }, [bookingId, dispatch]);

  // =========================
  // 🎬 STEP 2: FETCH MOVIE
  // =========================
  useEffect(() => {
    if (currentShow?.movieId) {
      dispatch(fetchMovieDetails(currentShow.movieId));
    }
    console.log(currentShow);
  }, [currentShow, dispatch]);

  // =========================
  // ⏱️ STEP 3: TIMER
  // =========================
  useEffect(() => {
    if (!booking?.expiresAt) return;

    const interval = setInterval(() => {
      const diff = Math.max(
        Math.floor(
          (new Date(booking.expiresAt) - Date.now()) / 1000
        ),
        0
      );

      setTimeLeft(diff);

      if (diff <= 0) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // =========================
  // 💳 STEP 4: PAYMENT
  // =========================
  const handlePayment = async () => {
    if (!booking?._id) return;

    const res = await dispatch(createOrderThunk(booking._id));

    if (res.meta.requestStatus !== "fulfilled") {
      alert("Order failed");
      return;
    }

    const order = res.payload;

    const razor = new window.Razorpay({
      key: "rzp_test_RseAcqvzZsYCbZ",
      amount: order.amount,
      currency: "INR",
      order_id: order.id,

      handler: async function (response) {
        await dispatch(
          verifyPaymentThunk({
            ...response,
            bookingId: booking._id,
          })
        );

        navigate(`/success/${booking._id}`);
      },

      prefill: {
        name: user?.name,
        email: user?.email,
      },
    });

    razor.open();
  };

  // =========================
  // 🧠 DERIVED DATA
  // =========================
  const seats = booking?.seats || [];
  const baseAmount = booking?.totalAmount || 0;
  const fee = Math.round(baseAmount * 0.2);
  const total = baseAmount + fee;

  // =========================
  // ⛔ LOADING
  // =========================
  if (!booking) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  // =========================
  // 🎬 UI
  // =========================
  return (
  <div className="bg-gray-50 min-h-screen">

    {/* TIMER BAR */}
    <div className="bg-purple-100 text-center py-2 text-sm">
      Complete your booking in{" "}
      <span className="font-semibold text-green-600">
        {formatTime(timeLeft)}
      </span>{" "}
      mins
    </div>

    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* LEFT SECTION */}
      <div className="md:col-span-2 space-y-6">

        {/* BOOKING CARD */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-2">
            {movieDetails?.title}
          </h2>

          <p className="text-sm text-gray-600">
            UA16+ • Hindi • 2D
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {currentShow?.screen?.venue?.name}
          </p>

          <hr className="my-4" />
{/* 
          <p className="text-sm font-medium">
            {new Date(currentShow?.showDate).toDateString()}
          </p>

          <p className="text-sm text-gray-600">
            {new Date(currentShow?.startTime).toLocaleTimeString()} (approx)
          </p> */}

          <p className="text-sm font-medium">
  {currentShow?.showDate
    ? new Date(currentShow.showDate).toDateString()
    : "Loading date..."}
</p>

<p className="text-sm text-gray-600">
  {currentShow?.startTime
    ? new Date(currentShow.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Loading time..."} (approx)
</p>

          <hr className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">
                {seats.length} ticket
              </p>
              <p className="text-sm text-gray-600">
                PREMIUM - {seats.join(", ")}
              </p>
              <p className="text-xs text-gray-500">
                SCREEN {currentShow?.screen?.screenNumber}
              </p>
            </div>

            <p className="font-semibold text-lg">
              ₹{baseAmount}
            </p>
          </div>

          <div className="mt-4 text-sm text-gray-400 flex items-center gap-2">
            <span>🚫</span>
            Cancellation is unavailable
          </div>
        </div>

        {/* OFFERS */}
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="font-semibold mb-3">Offers for you</h3>

          <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4 mb-2">
            <div>
              <p className="font-medium">Get a free Coke voucher</p>
              <p className="text-xs text-red-500">
                Add min 2 tickets
              </p>
            </div>
            <button className="text-gray-400 text-sm">
              Apply
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4">
            <div>
              <p className="font-medium">
                Get a free snack voucher
              </p>
              <p className="text-xs text-red-500">
                Add min ₹150 tickets
              </p>
            </div>
            <button className="text-gray-400 text-sm">
              Apply
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT SECTION */}
      <div className="space-y-6">

        {/* PAYMENT SUMMARY */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="font-semibold mb-4">Payment summary</h3>

          <div className="flex justify-between text-sm mb-2">
            <span>Order amount</span>
            <span>₹{baseAmount}</span>
          </div>

          <div className="flex justify-between text-sm mb-4">
            <span>Booking charge (incl. of GST)</span>
            <span>₹{fee}</span>
          </div>

          <hr className="mb-4" />

          <div className="flex justify-between font-semibold">
            <span>To be paid</span>
            <span>₹{total}</span>
          </div>
        </div>

        {/* USER DETAILS */}
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold">Your details</h3>
           
          </div>

          <div className="text-sm text-gray-700">
            <p>{user?.email || "No phone"}</p>
            <p className="text-gray-500 text-xs">
              {currentShow?.city}
            </p>
          </div>
        </div>

        {/* TERMS */}
        <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
          <span className="text-sm">Terms and conditions</span>
          <span>›</span>
        </div>

        {/* PAY BUTTON */}
        <button
          disabled={expired}
          onClick={handlePayment}
          className="w-full bg-black text-white py-4 rounded-2xl flex justify-between items-center px-6"
        >
          <span className="text-lg font-semibold">
            ₹{total}
          </span>
          <span className="font-medium">
            Proceed To Pay
          </span>
        </button>

        {expired && (
          <p className="text-red-500 text-sm text-center">
            Booking expired
          </p>
        )}
      </div>
    </div>
  </div>
);
};

export default Checkout;