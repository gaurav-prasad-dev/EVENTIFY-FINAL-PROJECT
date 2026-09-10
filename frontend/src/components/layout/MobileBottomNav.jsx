import { NavLink, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  IoHomeOutline,
  IoHome,
  IoFilmOutline,
  IoFilm,
  IoTicketOutline,
  IoTicket,
  IoPersonOutline,
} from "react-icons/io5";
import { setOpenLogin } from "../../Features/auth/authSlice";

const MobileBottomNav = ({ setOpenSidebar }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const path = location.pathname;

  // Do not show on booking, seat layout, checkout, or dashboard pages
  const isExcludedPage =
    path.includes("seat-layout") ||
    path.includes("checkout") ||
    path.includes("success") ||
    path.includes("trailer") ||
    path.startsWith("/admin") ||
    path.startsWith("/organizer");

  if (isExcludedPage) return null;

  const handleAccountClick = () => {
    if (user) {
      setOpenSidebar?.(true);
    } else {
      dispatch(setOpenLogin(true));
    }
  };

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] px-3 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] transition-all">
      <div className="flex items-center justify-around">
        {/* HOME */}
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <IoHome className="text-xl" />
              ) : (
                <IoHomeOutline className="text-xl" />
              )}
              <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
            </>
          )}
        </NavLink>

        {/* MOVIES */}
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <IoFilm className="text-xl" />
              ) : (
                <IoFilmOutline className="text-xl" />
              )}
              <span className="text-[10px] mt-0.5 tracking-tight">Movies</span>
            </>
          )}
        </NavLink>

        {/* BOOKINGS */}
        <NavLink
          to="/my-bookings"
          className={({ isActive }) =>
            `flex flex-col items-center py-1 px-3 rounded-xl transition-colors ${
              isActive ? "text-purple-600 font-bold" : "text-gray-500 hover:text-gray-800"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive ? (
                <IoTicket className="text-xl" />
              ) : (
                <IoTicketOutline className="text-xl" />
              )}
              <span className="text-[10px] mt-0.5 tracking-tight">Bookings</span>
            </>
          )}
        </NavLink>

        {/* ACCOUNT */}
        <button
          type="button"
          onClick={handleAccountClick}
          className="flex flex-col items-center py-1 px-3 rounded-xl text-gray-500 hover:text-purple-600 transition-colors focus:outline-none cursor-pointer"
        >
          {user ? (
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {(user.profile?.fullName || user.name || user.email || "U")
                .charAt(0)
                .toUpperCase()}
            </div>
          ) : (
            <IoPersonOutline className="text-xl" />
          )}
          <span className="text-[10px] mt-0.5 tracking-tight">
            {user ? "Account" : "Sign In"}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default MobileBottomNav;
