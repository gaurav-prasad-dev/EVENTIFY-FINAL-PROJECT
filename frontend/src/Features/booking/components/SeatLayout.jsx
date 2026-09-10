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
  unlockSeatThunk,
  createBookingThunk,
  selectSeat,
  removeSeat,
  updateSeatStatus,
  setBooking,
  resetBooking,
} from "../bookSlice";

import {
  fetchShowsByContent, // ✅ FIXED
  fetchShowById,
} from "../../show/showSlice";

import { fetchMovieDetails } from "../../movies/movieSlice";
import { setOpenLogin } from "../../auth/authSlice";

const SeatLayout = () => {
  const { movieId, showId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🎟️ Booking state
  const {
    seats,
    selectedSeats,
    booking,
    loadingSeats,
    lockingSeat,
  } = useSelector((state) => state.booking);

  // 🎬 Show + Movie data
  const { shows, currentShow: storeCurrentShow } = useSelector(
    (state) => state.shows
  );

  const { movieDetails } = useSelector((state) => state.movies);

  // 🔐 Auth
  const { user } = useSelector((state) => state.auth);

  // 🏙️ City
  const { city, selectedCity } = useSelector((state) => state.location);

  // 📅 Local date
  const localDate = new Date().toLocaleDateString("en-CA");
  // =========================
  // ✅ NORMALIZE SHOW DATA
  // =========================
  const normalizedShows =
    shows?.map((venue) => ({
      ...venue,
      shows: (venue.shows || []).map((s) => ({
        ...s,
        showId: s.showId || s._id,
        time: s.startTime || s.time,
      })),
    })) || [];

  const flatShows =
    normalizedShows.flatMap((t) => t.shows) || [];

  const currentShow =
    storeCurrentShow ||
    flatShows.find(
      (s) => String(s.showId || s._id) === String(showId)
    );

  const displayShows =
    flatShows.length > 0
      ? flatShows
      : currentShow
      ? [{ showId: currentShow._id || showId, time: currentShow.startTime, showDate: currentShow.showDate }]
      : [];

  // =========================
  // ✅ SYNC MY_LOCKED SEATS ON SEATS CHANGE
  // =========================
  useEffect(() => {
    if (!seats || seats.length === 0) return;

    const myLockedSeats = seats.filter((s) => s.status === "MY_LOCKED");

    myLockedSeats.forEach((seat) => {
      const alreadySelected = selectedSeats.some((s) => s.id === seat.id);
      if (!alreadySelected) {
        dispatch(selectSeat(seat));
      }
    });
  }, [seats, dispatch]);

  // =========================
  // ✅ FETCH SEATS
  // =========================
  useEffect(() => {
    if (!showId) return;
    dispatch(fetchSeatsThunk(showId));
  }, [showId, dispatch]);

  // =========================
  // ✅ FETCH SHOW + MOVIE
  // =========================
  useEffect(() => {
    if (!showId || !movieId) return;

    dispatch(fetchShowById(showId));
    dispatch(fetchMovieDetails(movieId));
  }, [showId, movieId, dispatch]);

  // =========================
  // ✅ FETCH SHOW LIST (FIXED)
  // =========================
  useEffect(() => {
    if (!movieId) return;

    dispatch(
      fetchShowsByContent({
        contentId: movieId,
        date: localDate,
        cityId: selectedCity?._id || city || "Indore",
      })
    );
  }, [movieId, localDate, selectedCity?._id, city, dispatch]);

  // =========================
  // 🔌 SOCKET HANDLING
  // =========================
  useEffect(() => {
    if (!showId) return;

    socket.emit("joinShow", showId);

    const handleSeatLocked = ({ seats: lockedSeats, userId: lockedUserId }) => {
      const isMe = user && String(user._id || user.id) === String(lockedUserId);
      lockedSeats.forEach((seatId) => {
        dispatch(
          updateSeatStatus({
            seatId,
            status: isMe ? "MY_LOCKED" : "LOCKED",
          })
        );
      });
    };

    const handleSeatUnLocked = ({ seats: unlockedSeats }) => {
      unlockedSeats.forEach((seatId) => {
        dispatch(
          updateSeatStatus({
            seatId,
            status: "AVAILABLE",
          })
        );
      });
    };

    const handleSeatBooked = () => {
      dispatch(fetchSeatsThunk(showId));
    };

    socket.on("seat_locked", handleSeatLocked);
    socket.on("seat_booked", handleSeatBooked);
    socket.on("seat_unlocked", handleSeatUnLocked);

    return () => {
      socket.emit("leaveShow", showId);
      socket.off("seat_locked", handleSeatLocked);
      socket.off("seat_booked", handleSeatBooked);
      socket.off("seat_unlocked", handleSeatUnLocked);
    };
  }, [showId, user, dispatch]);

  // =========================
  // 🎯 SEAT CLICK
  // =========================
  const handleSeatClick = async (seat) => {
    if (!user) {
      dispatch(setOpenLogin(true));
      return;
    }

    if (seat.status === "BOOKED") return;
    if (seat.status === "LOCKED") return;
    if (lockingSeat) return;

    const isSelected =
      seat.status === "MY_LOCKED" ||
      selectedSeats.some((s) => s.id === seat.id);

    if (isSelected) {
      dispatch(removeSeat(seat.id));
      dispatch(updateSeatStatus({ seatId: seat.id, status: "AVAILABLE" }));
      await dispatch(unlockSeatThunk({ showId, seatId: seat.id }));
      return;
    }

    // Optimistically select & lock
    dispatch(selectSeat(seat));
    dispatch(updateSeatStatus({ seatId: seat.id, status: "MY_LOCKED" }));

    const res = await dispatch(
      lockSeatThunk({ showId, seatId: seat.id })
    );

    if (res.meta.requestStatus !== "fulfilled") {
      dispatch(removeSeat(seat.id));
      dispatch(updateSeatStatus({ seatId: seat.id, status: "AVAILABLE" }));
      alert(res.payload || "Seat already locked by someone else");
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

    if (booking?._id) {
      navigate(`/checkout/${booking._id}`);
      return;
    }

    const seatIds = selectedSeats.map((s) => s.id);

    const res = await dispatch(
      createBookingThunk({ showId, seats: seatIds })
    );

    if (res.meta.requestStatus !== "fulfilled") return;

    const newBooking = res.payload;

    if (!newBooking?._id) {
      alert("Booking failed");
      return;
    }

    dispatch(setBooking(newBooking));
    navigate(`/checkout/${newBooking._id}`);
  };

  // =========================
  // ⛔ LOADING
  // =========================
  if (loadingSeats) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500 text-lg">
          Loading seats...
        </div>
      </div>
    );
  }

  // =========================
  // 🎬 UI (UNCHANGED)
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 pb-24">

      <ShowTiming
        showDate={currentShow?.showDate}
        showTime={currentShow?.startTime || currentShow?.time}
        currentShowId={showId}
        allShows={displayShows}
        onSelect={(selectedShow) => {
          navigate(
            `/seat-layout/${movieId}/${selectedShow.showId || selectedShow._id}`
          );
        }}
      />

      <SeatGrid
        seats={seats}
        selectedSeats={selectedSeats}
        handleSeatClick={handleSeatClick}
        lockingSeat={lockingSeat}
      />

      <BottomBar
        selectedSeats={selectedSeats}
        onProceed={handleProceed}
      />
    </div>
  );
};

export default SeatLayout;
