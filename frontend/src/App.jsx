import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home";
import Movie from "./pages/Movie";
import MovieDetails from "./Features/movies/components/MovieDetails";
import SeatLayout from "./Features/booking/components/SeatLayout"
import CheckOutTime from "./Features/payment/CheckOutTime";
import Success from "./pages/Success";
import TrailerPage from "./pages/TrailerPage";
import ViewDetailsModal from "./Features/movies/components/ViewDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import PaymentFailed from "./Features/payment/PaymentFailed";
import LoginModal from "./Features/auth/components/LoginModal";// adjust path
import { setOpenLogin } from "./Features/auth/authSlice";
function App() {
  const location = useLocation();
  const state = location.state;
const dispatch = useDispatch();

  const { user, openLogin } = useSelector((state) => state.auth || {});

  const path = location.pathname;
  


  return (
    <>
     <Navbar />

      {/* ✅ MAIN ROUTES */}
      <Routes location={state?.background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/movies/:movieId/:city" element={<MovieDetails />} />
        <Route path="/seat-layout/:movieId/:showId" element={<SeatLayout />} />
        <Route path="/checkout/:bookingId" element={<CheckOutTime />} />
        <Route path="/success/:bookingId" element={<Success />} />
        <Route path="/trailer/:movieId/:city" element={<TrailerPage />} />
     <Route path="/payment-failed/:bookingId" element={<PaymentFailed />} />

      </Routes>

      {/* ✅ MODAL ROUTE */}
      {state?.background && (
        <Routes>
          <Route
            path="/movie/:movieId/details"
            element={<ViewDetailsModal />}
          />
        </Routes>
      )}

      {/* ✅ ADD THIS */}
      <LoginModal
        isOpen={openLogin}
        onClose={() => dispatch(setOpenLogin(false))}
      />
    </>
  );
}

export default App;