import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getBookingById } from "../booking/bookingApi";
import { fetchShowById } from "../show/showSlice";
import { fetchMovieDetails } from "../movies/movieSlice";

import {
  createOrderThunk,
  verifyPaymentThunk,
  markPaymentFailedThunk,
} from "../payment/paymentTimeSlice";

const CheckOutTime = () => {
  const { bookingId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentShow } = useSelector((state) => state.shows);
  const { movieDetails } = useSelector((state) => state.movies);
  const { user } = useSelector((state) => state.auth);

  const [serverOffset, setServerOffset] = useState(0);
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [expired, setExpired] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // =========================
  // 1. FETCH BOOKING
  // =========================
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await getBookingById(bookingId);
        if (!res?.booking) {
          setExpired(true);
          setShowExpiredModal(true);
          return;
        }

        setBooking(res.booking);

        // Server time sync
        const serverTime = res.serverTime ? new Date(res.serverTime).getTime() : Date.now();
        const clientTime = Date.now();
        const offset = serverTime - clientTime;
        setServerOffset(offset);

        // Immediate check if already cancelled or expired
        if (
          res.booking.bookingStatus === "Cancelled" ||
          (res.booking.expiresAt && new Date(res.booking.expiresAt).getTime() <= serverTime)
        ) {
          setExpired(true);
          setShowExpiredModal(true);
          setTimeLeft(0);
          return;
        }

        // Instant synchronous calculation (no 0:00 flash)
        if (res.booking.expiresAt) {
          const diff = Math.max(
            Math.floor((new Date(res.booking.expiresAt).getTime() - serverTime) / 1000),
            0
          );
          setTimeLeft(diff);
          if (diff <= 0) {
            setExpired(true);
            setShowExpiredModal(true);
          }
        }

        const showId =
          typeof res.booking.show === "object"
            ? res.booking.show?._id
            : res.booking.show;

        if (showId) {
          dispatch(fetchShowById(showId));
        }
      } catch (err) {
        console.error("GET BOOKING ERROR:", err);
      }
    };

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, dispatch]);

  // =========================
  // 2. FETCH MOVIE
  // =========================
  useEffect(() => {
    const contentId =
      currentShow?.content?._id ||
      currentShow?.content ||
      booking?.show?.content?._id ||
      booking?.show?.content;

    if (contentId && typeof contentId === "string") {
      dispatch(fetchMovieDetails(contentId));
    }
  }, [currentShow, booking, dispatch]);

  // =========================
  // 3. COUNTDOWN TIMER
  // =========================
  useEffect(() => {
    if (!booking?.expiresAt || expired) return;

    const interval = setInterval(() => {
      const now = Date.now() + serverOffset;
      const targetTime = new Date(booking.expiresAt).getTime();
      const diff = Math.max(Math.floor((targetTime - now) / 1000), 0);

      setTimeLeft(diff);

      if (diff <= 0) {
        setExpired(true);
        setShowExpiredModal(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, serverOffset, expired]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // =========================
  // 4. PAYMENT (ON SUCCESS MOVES TO QR TICKET)
  // =========================
  const handlePayment = async () => {
    if (!booking?._id || expired || processing) return;
    setProcessing(true);

    try {
      const res = await dispatch(createOrderThunk(booking._id));

      if (res.meta.requestStatus !== "fulfilled") {
        alert(res.payload?.message || "Order creation failed");
        setProcessing(false);
        return;
      }

      const order = res.payload;

      const razor = new window.Razorpay({
        key: "rzp_test_RseAcqvzZsYCbZ",
        amount: order.amount,
        currency: "INR",
        order_id: order.id,

        handler: async function (response) {
          try {
            await dispatch(
              verifyPaymentThunk({
                ...response,
                bookingId: booking._id,
              })
            );
            // Move directly to QR Ticket Success Page
            navigate(`/success/${booking._id}`);
          } catch (verifyErr) {
            console.error("Payment verification error:", verifyErr);
            navigate(`/success/${booking._id}`);
          }
        },

        modal: {
          ondismiss: async function () {
            await dispatch(markPaymentFailedThunk(booking._id));
            navigate(`/payment-failed/${booking._id}`);
          },
        },

        prefill: {
          name: user?.name || "Customer",
          email: user?.email,
        },

        theme: { color: "#000000" },
      });

      razor.on("payment.failed", function (response) {
        dispatch(markPaymentFailedThunk(booking._id));
        navigate(`/payment-failed/${booking._id}`, {
          state: { error: response.error?.description },
        });
      });

      razor.open();
    } catch (err) {
      console.error("PAYMENT INITIATE ERROR:", err);
      alert("Payment failed to initialize");
    } finally {
      setProcessing(false);
    }
  };

  // =========================
  // 5. DERIVED DATA
  // =========================
  const seats = booking?.seats || [];
  const baseAmount = booking?.totalAmount || 0;
  const fee = Math.round(baseAmount * 0.2);
  const total = baseAmount + fee;

  const showData = booking?.show || currentShow;
  const movieTitle =
    movieDetails?.title ||
    showData?.content?.title ||
    showData?.movieName ||
    "Movie";
  const venueName =
    showData?.screen?.venue?.name ||
    showData?.venue?.name ||
    showData?.theatreName ||
    "Cinema";
  const screenNumber =
    showData?.screen?.screenNumber || showData?.screenNumber || "1";
  const showDateStr = showData?.showDate
    ? new Date(showData.showDate).toDateString()
    : "Today";
  const showTimeStr = showData?.startTime || showData?.time || "9:00 PM";

  if (!booking) {
    return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* EXPIRED MODAL */}
      {showExpiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Booking Expired</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your selected seats have been released.
            </p>
            <button
              onClick={() => navigate("/")}
              className="bg-black text-white px-4 py-2 rounded-lg w-full cursor-pointer hover:bg-gray-800"
            >
              Book Again
            </button>
          </div>
        </div>
      )}

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
            <h2 className="text-xl font-semibold mb-2">{movieTitle}</h2>

            <p className="text-sm text-gray-600">UA16+ • Hindi • 2D</p>

            <p className="text-sm text-gray-600 mt-1">{venueName}</p>

            <hr className="my-4" />

            <p className="text-sm font-medium">{showDateStr}</p>

            <p className="text-sm text-gray-600">{showTimeStr} (approx)</p>

            <hr className="my-4" />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{seats.length} ticket</p>
                <p className="text-sm text-gray-600">
                  PREMIUM - {seats.join(", ")}
                </p>
                <p className="text-xs text-gray-500">SCREEN {screenNumber}</p>
              </div>

              <p className="font-semibold text-lg">₹{baseAmount}</p>
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
                <p className="text-xs text-red-500">Add min 2 tickets</p>
              </div>
              <button className="text-gray-400 text-sm cursor-pointer hover:text-black">
                Apply
              </button>
            </div>

            <div className="flex justify-between items-center bg-gray-100 rounded-xl p-4">
              <div>
                <p className="font-medium">Get a free snack voucher</p>
                <p className="text-xs text-red-500">Add min ₹150 tickets</p>
              </div>
              <button className="text-gray-400 text-sm cursor-pointer hover:text-black">
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
              <p>{user?.email || "No email"}</p>
              <p className="text-gray-500 text-xs">{showData?.city || "Indore"}</p>
            </div>
          </div>

          {/* TERMS */}
          <div className="bg-white rounded-2xl shadow p-4 flex justify-between items-center">
            <span className="text-sm">Terms and conditions</span>
            <span>›</span>
          </div>

          {/* PAY BUTTON */}
          <button
            disabled={expired || processing}
            onClick={handlePayment}
            className={`w-full py-4 rounded-2xl flex justify-between items-center px-6 transition ${
              expired || processing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 cursor-pointer"
            }`}
          >
            <span className="text-lg font-semibold">₹{total}</span>
            <span className="font-medium">
              {processing ? "Processing..." : "Proceed To Pay"}
            </span>
          </button>

          {expired && (
            <p className="text-red-500 text-sm text-center">Booking expired</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckOutTime;
