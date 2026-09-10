import { useDispatch, useSelector } from "react-redux";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { logout } from "../../Features/auth/authSlice";
import { logoutUser } from "../../Features/auth/authApi";
import { persistor } from "../../app/store";
import { FiLogOut, FiExternalLink, FiMenu } from "react-icons/fi";

const Topbar = ({ onOpenSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("/admin/content")) return "Content & TMDB Management";
    if (path.includes("/admin/shows")) return "Show Schedule Management";
    if (path.includes("/admin/venues")) return "Venue Approvals";
    if (path.includes("/admin/organizers")) return "Organizer Applications";
    if (path.includes("/admin/users")) return "User Management";
    if (path.includes("/admin/cities")) return "City Management";
    if (path.includes("/admin/transactions")) return "Transactions & Revenue";
    if (path.includes("/admin/analytics")) return "Platform Analytics";
    if (path.includes("/organizer/shows/create")) return "Schedule New Show";
    if (path.includes("/organizer/shows")) return "My Shows & Schedules";
    if (path.includes("/organizer/venues")) return "Venue Registration";
    if (path.includes("/organizer/bookings")) return "Booking Records";
    if (path.startsWith("/organizer")) return "Organizer Control Center";
    return "Admin Control Center";
  };

  const handleLogout = async () => {
    try {
      await logoutUser?.();
    } catch (err) {
      console.log("Server logout failed, clearing local state:", err?.message);
    }
    try {
      await persistor?.purge();
    } catch {}
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 flex justify-between items-center z-10 shrink-0 shadow-xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenSidebar}
          className="lg:hidden p-1.5 -ml-1.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition cursor-pointer"
          title="Open Menu"
        >
          <FiMenu className="text-xl" />
        </button>
        <h1 className="text-sm sm:text-lg font-bold text-gray-800 tracking-tight truncate">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <NavLink
          to="/"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition border border-gray-200"
        >
          <FiExternalLink className="text-xs" />
          Storefront
        </NavLink>

        <div className="h-4 w-[1px] bg-gray-200 hidden sm:block" />

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center">
            {(user?.profile?.fullName || user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
          <span className="text-xs font-medium text-gray-700 hidden md:block">
            {user?.profile?.fullName || user?.name || "User"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-semibold transition"
        >
          <FiLogOut className="text-xs" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;