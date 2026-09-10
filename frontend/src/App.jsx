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
import MyVenues from "./pages/organizer/MyVenues"
import MyBookings from "./pages/MyBookings"
import AdminContent from "./pages/admin/Content"
// =========================
// PROTECTED ROUTE
// =========================
// PROTECTED ROUTE
// =========================
const ProtectedRoute = ({ children, role, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Login Required</h2>
        <p className="text-sm text-gray-500">Please sign in to access this page.</p>
      </div>
    );
  }

  const allowedRoles = roles || (role ? [role] : null);
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-10 text-red-600">
        <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
        <p className="text-sm text-gray-500">You do not have permission to view this section.</p>
      </div>
    );
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
        <Route path="/my-bookings" element={
          <ProtectedRoute>
            <MyBookings />
          </ProtectedRoute>
        } />
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movie />} />
        <Route path="/movies/:contentId/:city" element={<MovieDetails />} />
        <Route path="/seat-layout/:movieId/:showId" element={<SeatLayout />} />
        <Route path="/checkout/:bookingId" element={<CheckOutTime />} />
        <Route path="/success/:bookingId" element={<Success />} />
        <Route path="/trailer/:movieId/:city" element={<TrailerPage />} />
        <Route path="/payment-failed/:bookingId" element={<PaymentFailed />} />

        {/* ================= ORGANIZER ================= */}
        <Route
          path="/organizer"
          element={
            <ProtectedRoute role="organizer">
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/shows/create"
          element={
            <ProtectedRoute role="organizer">
              <CreateShow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-show"
          element={
            <ProtectedRoute role="organizer">
              <CreateShow />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/shows"
          element={
            <ProtectedRoute role="organizer">
              <MyShows />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/bookings/recent"
          element={
            <ProtectedRoute role="organizer">
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/bookings"
          element={
            <ProtectedRoute role="organizer">
              <Bookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/venues/create"
          element={
            <ProtectedRoute role="organizer">
              <Venue />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/venues"
          element={
            <ProtectedRoute role="organizer">
              <MyVenues />
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