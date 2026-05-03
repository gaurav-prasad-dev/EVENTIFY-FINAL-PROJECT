import { Routes, Route, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/layout/Navbar";

// =========================
// PUBLIC PAGES
// =========================
import Home from "./pages/Home";
import Movie from "./pages/Movie";
import MovieDetails from "./Features/movies/components/MovieDetails";
import SeatLayout from "./Features/booking/components/SeatLayout";
import CheckOutTime from "./Features/payment/CheckOutTime";
import Success from "./Success";
import TrailerPage from "./pages/TrailerPage";
import ViewDetailsModal from "./Features/movies/components/ViewDetailsModal";
import PaymentFailed from "./Features/payment/PaymentFailed";

// =========================
// AUTH
// =========================
import LoginModal from "./Features/auth/components/LoginModal";
import { setOpenLogin } from "./Features/auth/authSlice";

// =========================
// ORGANIZER
// =========================
import CreateShow from "./Features/organizer/CreateShow";
import OrganizerDashboard from "./pages/organizer/OrganizerDashboard";

// =========================
// ADMIN PAGES
// =========================
import AdminDashboard from "./pages/admin/AdminDashboard";

import Organizers from "./pages/admin/Organizer";
import Users from "./pages/admin/Users";
import Venues from "./pages/admin/Venues";
import Shows from "./pages/admin/Shows";
import Cities from "./pages/admin/Cities";
import Transactions from "./pages/admin/Transactions";
import Analytics from "./pages/admin/Analytics";
import MyShows from "./pages/organizer/MyShows"
import Bookings from "./pages/organizer/Booking"
import Venue from "./pages/organizer/Venue"
import MyBookings from "./pages/MyBookings"
import AdminContent from "./pages/admin/Content"
// =========================
// PROTECTED ROUTE
// =========================
const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <div className="p-10">Please login first</div>;
  }

  if (role && user?.role !== role) {
    return <div className="p-10">Unauthorized</div>;
  }

  return children;
};

function App() {
  const location = useLocation();
  const state = location.state;
  const dispatch = useDispatch();

  const { openLogin } = useSelector((state) => state.auth || {});

  const path = location.pathname;

  // Hide navbar on dashboard routes
  const hideNavbar =
    path.startsWith("/admin") || path.startsWith("/organizer");

  return (
    <>
      {/* NAVBAR */}
      {!hideNavbar && <Navbar />}

      {/* MAIN ROUTES */}
      <Routes location={state?.background || location}>
        
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/movies/:contentId/:city" element={<MovieDetails />} />
        <Route path="/seat-layout/:movieId/:showId" element={<SeatLayout />} />
        <Route path="/checkout/:bookingId" element={<CheckOutTime />} />
        <Route path="/success/:bookingId" element={<Success />} />
        <Route path="/trailer/:movieId/:city" element={<TrailerPage />} />
        <Route path="/payment-failed/:bookingId" element={<PaymentFailed />} />

        {/* ================= ORGANIZER ================= */}
        <Route path="organizer/shows/create" element={<CreateShow />} />
  <Route path="organizer/shows" element={<MyShows />} />
 <Route path="organizer/bookings/recent" element={<Bookings />} />
 <Route path="organizer/bookings/recent" element={<Bookings />} />
 <Route path="/organizer/venues/create" element={<Venue />} />

        <Route
          path="/organizer"
          element={
            <ProtectedRoute role="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
  path="/admin/content"
  element={
    <ProtectedRoute roles={["admin"]}>
      <AdminContent />
    </ProtectedRoute>
  }
/>

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/organizers"
          element={
            <ProtectedRoute role="admin">
              <Organizers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <Users />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/venues"
          element={
            <ProtectedRoute role="admin">
              <Venues />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/shows"
          element={
            <ProtectedRoute role="admin">
              <Shows />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/cities"
          element={
            <ProtectedRoute role="admin">
              <Cities />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute role="admin">
              <Transactions />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute role="admin">
              <Analytics />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* MODAL ROUTES */}
      {state?.background && (
        <Routes>
          <Route
            path="/movie/:movieId/details"
            element={<ViewDetailsModal />}
          />
        </Routes>
      )}

      {/* LOGIN MODAL */}
      <LoginModal
        isOpen={openLogin}
        onClose={() => dispatch(setOpenLogin(false))}
      />
    </>
  );
}

export default App;