import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../../socket/socket";

import SeatGrid from "./SeatGrid";
import BottomBar from "../../../components/layout/BottomBar";
import ShowTiming from "./ShowTiming";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchSeatsThunk,
  lockSeatThunk,
  createBookingThunk,
  selectSeat,
  setBooking, // ✅ added
} from "../bookSlice";

const SeatLayout = () => {
  const { showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { seats, selectedSeats, bookingMeta } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchSeatsThunk(showId));
  }, [showId, dispatch]);

  useEffect(() => {
    socket.emit("joinShow", showId);

    socket.on("seat_locked", () => {
      dispatch(fetchSeatsThunk(showId));
    });

    socket.on("seat_booked", () => {
      dispatch(fetchSeatsThunk(showId));
    });

    return () => {
      socket.emit("leaveShow", showId);
      socket.off("seat_locked");
      socket.off("seat_booked");
    };
  }, [showId, dispatch]);

  const handleSeatClick = async (seat) => {
    if (seat.status !== "AVAILABLE") return;

    await dispatch(lockSeatThunk({ showId, seatId: seat.id }));
    dispatch(selectSeat(seat));
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;

    const seatIds = selectedSeats.map((s) => s.id);

    const res = await dispatch(
      createBookingThunk({ showId, seatIds })
    );

    const booking = res.payload;

    if (!booking) return;

    dispatch(
      setBooking({
        ...booking,
        ...bookingMeta, // ✅ use redux meta instead of location
      })
    );

    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <ShowTiming />

      <div className="mt-6">
        <SeatGrid seats={seats} handleSeatClick={handleSeatClick} />
      </div>

      <BottomBar
        selectedSeats={selectedSeats}
        onProceed={handleProceed}
      />
    </div>
  );
};

export default SeatLayout;