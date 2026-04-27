import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../../socket/socket";

import SeatGrid from "./SeatGrid";
import BottomBar from "../../../components/layout/BottomBar";
import ShowTiming from "./ShowTiming";

import {
  fetchSeatsThunk,
  lockSeatThunk,
  createBookingThunk,
  selectSeat,
  removeSeat,
  updateSeatStatus,
  setBooking,
  resetBooking,
} from "../bookSlice";

import { fetchShows, fetchShowById } from "../../show/showSlice";
import { fetchMovieDetails } from "../../movies/movieSlice";
import { setOpenLogin } from "../../auth/authSlice";
import BookingNavbar from "../../../components/navigation/BookingNavbar";

const SeatLayout = () => {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🎟️ Booking state
  const { seats, selectedSeats, booking, loadingSeats,lockingSeat } = useSelector(
    (state) => state.booking
  );

  // 🎬 Show + Movie data
  const { shows, currentShow: storeCurrentShow } = useSelector(
    (state) => state.shows
  );

  const { movieDetails } = useSelector((state) => state.movies);
  const { city } = useSelector((state) => state.location);

  // 🔐 Auth
  const { user } = useSelector((state) => state.auth);

  // ✅ SAFE currentShow fallback
  const flatShows = shows?.flatMap((t) => t.shows) || [];

  const currentShow =
  storeCurrentShow ||
  flatShows.find(
    (s) =>
      String(s._id) === String(showId) ||
      String(s.showId) === String(showId) // ✅ IMPORTANT
  );
console.log("CURRENT SHOW:", currentShow);
console.log("ALL SHOWS:", flatShows);
  // 📅 Local date
  const localDate = new Date().toLocaleDateString("en-CA");
useEffect(() => {
  const saved = localStorage.getItem("selectedSeats");

  if (saved) {
    const seats = JSON.parse(saved);

    seats.forEach((seat) => {
      dispatch(selectSeat(seat));
    });
  }
}, [dispatch]);

useEffect(() => {
  localStorage.setItem(
    "selectedSeats",
    JSON.stringify(selectedSeats)
  );
}, [selectedSeats]);

  // =========================
  // ✅ RESET BOOKING (ONCE)
  // =========================
useEffect(() => {
  return () => {
    dispatch(resetBooking());
  };
}, [dispatch]);

  // =========================
  // ✅ FETCH SEATS (ONLY)
  // =========================
  useEffect(() => {
    if (!showId) return;

    dispatch(fetchSeatsThunk(showId));
  }, [showId, dispatch]);

  // =========================
  // ✅ FETCH SHOW + MOVIE
  // =========================
  useEffect(() => {
    if (!showId || !movieId || !city) return;

    dispatch(fetchShowById(showId));
    dispatch(fetchMovieDetails(movieId));
  }, [showId, movieId, city, dispatch]);

  // =========================
  // ✅ FETCH SHOW LIST
  // =========================
  useEffect(() => {
    if (!movieId || !city) return;

    dispatch(
      fetchShows({
        movieId,
        city: typeof city === "string" ? city : city.name,
        date: localDate,
      })
    );
  }, [movieId, city, dispatch]);

  // =========================
  // 🔌 SOCKET HANDLING
  // =========================
  useEffect(() => {
    if (!showId) return;

    socket.emit("joinShow", showId);

    const handleSeatLocked = ({ seatId }) => {
    dispatch(updateSeatStatus({ seatId, status: "LOCKED" }));
  };

const handleSeatUnlocked = ({ seatId }) => {
  dispatch(updateSeatStatus({ seatId, status: "AVAILABLE" }));
};
   const handleSeatBooked = () => {
    dispatch(fetchSeatsThunk(showId));
  };

  socket.on("seat_locked", handleSeatLocked);
  socket.on("seat_booked", handleSeatBooked);
  socket.on("seat_unlocked", handleSeatUnlocked);

    return () => {
      socket.emit("leaveShow", showId);
      socket.off("seat_locked", handleSeatLocked);
      socket.off("seat_booked", handleSeatBooked);
      socket.off("seat_unlocked", handleSeatUnlocked);

    
    };
  }, [showId, dispatch]);

  // =========================
  // 🎯 SEAT CLICK
  // =========================
  const handleSeatClick = async (seat) => {
    if (seat.status !== "AVAILABLE") return;
 if (lockingSeat) return; // 🚨 stop spam
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      dispatch(removeSeat(seat.id));
      return;
    }

    dispatch(selectSeat(seat));

    const res = await dispatch(
      lockSeatThunk({ showId, seatId: seat.id })
    );

    if (res.meta.requestStatus !== "fulfilled") {
      dispatch(removeSeat(seat.id));
      alert("Seat already locked");
    }
  };

  // =========================
  // 💳 PROCEED
  // =========================
  const handleProceed = async () => {
    if (!user) {
      dispatch(setOpenLogin(true));
      return;
    }

    if (selectedSeats.length === 0) {
      alert("Please select at least one seat");
      return;
    }

    const seatIds = selectedSeats.map((s) => s.id);

    if (booking?._id) {
      navigate("/checkout");
      return;
    }

    const res = await dispatch(
      createBookingThunk({ showId, seatIds })
    );

    if (res.meta.requestStatus !== "fulfilled") return;

    dispatch(setBooking(res.payload));
    navigate("/checkout");
  };

  // =========================
  // ⛔ SAFE LOADING (FIXED)
  // =========================
if (loadingSeats) {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-pulse text-gray-500 text-lg">
        Loading seats...
      </div>
    </div>)}

  // =========================
  // 🎬 UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 pb-24">
    {/* 🎬 SHOW TIMING */}
      <ShowTiming
        showDate={currentShow?.showDate}
        showTime={currentShow?.time}
        allShows={flatShows}
        onSelect={(selectedShow) => {
          navigate(`/seat-layout/${movieId}/${selectedShow.showId}`);
        }}
      />

      {/* 🎟️ SEAT GRID */}
      <SeatGrid
        seats={seats}
        selectedSeats={selectedSeats}
        handleSeatClick={handleSeatClick}
        lockingSeat={lockingSeat}
      />

      {/* 💳 BOTTOM BAR */}
      <BottomBar
        selectedSeats={selectedSeats}
        onProceed={handleProceed}
      />
    </div>
  );
};

export default SeatLayout;////// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
