import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  createOrderThunk,
  verifyPaymentThunk,
  resetPayment,
} from "./paymentTimeSlice";

import { resetBooking } from "../booking/bookSlice";

const CheckoutOutTime = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { booking } = useSelector((state) => state.booking);
  const { creatingOrder, verifying, success } = useSelector(
    (state) => state.payment
  );

  const { user } = useSelector((state) => state.auth || {});

  const [timeLeft, setTimeLeft] = useState(0);
  const [expired, setExpired] = useState(false);

  // ⏱️ TIMER
  useEffect(() => {
    if (!booking?.expiresAt) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const expiry = new Date(booking.expiresAt).getTime();

      const diff = Math.max(Math.floor((expiry - now) / 1000), 0);
      setTimeLeft(diff);

      // ✅ STOP when success
      if (diff <= 0 && !success) {
        setExpired(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [booking, success]);

  // ✅ HANDLE SUCCESS GLOBALLY
  useEffect(() => {
    if (success && booking?._id) {
      navigate(`/success/${booking._id}`);

      dispatch(resetBooking());
      dispatch(resetPayment());
    }
  }, [success, booking, navigate, dispatch]);

  const handlePayment = async () => {
    try {
      if (creatingOrder || verifying) return;

      if (!booking?._id || expired) {
        alert("Invalid or booking expired");
        return;
      }

      // CREATE ORDER
      const res = await dispatch(createOrderThunk(booking._id));

      if (res.meta.requestStatus !== "fulfilled") {
        alert("Order creation failed");
        return;
      }

      const orderData = res.payload;

      const options = {
        key: "rzp_test_RseAcqvzZsYCbZ",
        amount: orderData.amount,
        currency: "INR",
        name: "Movie Booking",
        order_id: orderData.id,

        handler: async function (response) {
          const result = await dispatch(
            verifyPaymentThunk({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking._id,
            })
          );

          if (result.meta.requestStatus !== "fulfilled") {
            alert("Payment verification failed ❌");
          }
        },

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },
      };

      const razor = new window.Razorpay(options);

      razor.on("payment.failed", () => {
        alert("Payment failed. Try again");
      });

      razor.open();
    } catch (error) {
      console.log("PAYMENT ERROR:", error);
    }
  };

  return (
    <div className="p-6">
      <h2>Checkout</h2>

      <p>
        Time Left: <b>{timeLeft}</b>
      </p>

      <button
        onClick={handlePayment}
        disabled={expired || creatingOrder || verifying}
      >
        {creatingOrder || verifying ? "Processing..." : "Pay Now"}
      </button>

      {expired && !success && <p>Booking Expired</p>}
    </div>
  );
};

export default CheckoutOutTime;