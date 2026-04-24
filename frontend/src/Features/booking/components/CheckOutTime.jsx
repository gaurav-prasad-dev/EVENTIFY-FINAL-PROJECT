import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  createOrderThunk,
  verifyPaymentThunk,
} from "../paymentTimeSlice";

import { resetBooking } from "../bookSlice"; // ✅ make sure path is correct

const CheckoutOutTime = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const bookingState = useSelector((state) => state.booking);
  const paymentState = useSelector((state) => state.payment);
  const { user } = useSelector((state) => state.auth || {});

  const { booking } = bookingState || {};
  const { loading } = paymentState || {};

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // ✅ NEW

  // ⏱️ TIMER
  useEffect(() => {
    if (!booking?.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(booking.expiresAt).getTime();

      const diff = Math.max(Math.floor((expiry - now) / 1000), 0);

      setTimeLeft(diff);

      // ✅ STOP expiry if payment already done
      if (diff <= 0 && !paymentSuccess) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, paymentSuccess]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 💳 PAYMENT
  const handlePayment = async () => {
    try {
      if (!booking?._id) {
        alert("Invalid booking");
        return;
      }

      // ✅ CREATE ORDER
      const res = await dispatch(createOrderThunk(booking._id));

      if (!res.payload) {
        alert("Order creation failed");
        return;
      }

      const orderData = res.payload;

      const options = {
        key: "rzp_test_RseAcqvzZsYCbZ",
        amount: orderData.amount,
        currency: "INR",
        name: "Movie Booking",
        description: "Ticket Payment",
        order_id: orderData.id,

        handler: async function (response) {
          try {
            // ✅ VERIFY PAYMENT
            await dispatch(
              verifyPaymentThunk({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: booking._id,
              })
            );

            // ✅ STOP TIMER
            setPaymentSuccess(true);

            // ✅ CLEAR REDUX BOOKING
            dispatch(resetBooking());

            // ✅ NAVIGATE (IMPORTANT FIX)
            navigate(`/success/${booking._id}`);

          } catch (error) {
            console.log("VERIFY ERROR:", error);
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#6366f1",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();

    } catch (error) {
      console.log("PAYMENT ERROR:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>

      <p className="mb-4">
        Time Left: <span className="font-bold">{formatTime(timeLeft)}</span>
      </p>

      <button
        onClick={handlePayment}
        disabled={expired || loading}
        className="bg-purple-600 text-white px-6 py-2 rounded-lg"
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>

      {expired && !paymentSuccess && (
        <p className="text-red-500 mt-4">Booking Expired</p>
      )}
    </div>
  );
};

export default CheckoutOutTime;