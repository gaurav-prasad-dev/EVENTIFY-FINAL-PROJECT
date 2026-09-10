import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiHome,
  FiUsers,
  FiFilm,
  FiMapPin,
  FiCreditCard,
  FiBarChart2,
  FiFolder,
  FiPlusCircle,
  FiExternalLink,
  FiShield,
  FiBriefcase,
} from "react-icons/fi";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const baseClass =
    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-purple-600 text-white shadow-md font-semibold";

  const normalClass =
    "text-gray-600 hover:bg-purple-50 hover:text-purple-700";

  const sectionTitle =
    "text-[11px] font-bold uppercase tracking-wider text-gray-400 mt-6 mb-2 px-3";

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen p-4 flex flex-col shrink-0 shadow-xs z-20">
      {/* LOGO & BRAND */}
      <div className="px-2 pt-2 pb-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Eventify
            </span>
          </NavLink>
          <div className="flex items-center gap-1.5 mt-1">
            {user?.role === "admin" ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 uppercase">
                <FiShield className="text-[10px]" /> Admin
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 uppercase">
                <FiBriefcase className="text-[10px]" /> Organizer
              </span>
            )}
          </div>
        </div>
      </div>

      {/* NAVIGATION ITEMS */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 scrollbar-hide">
        {/* ================= ADMIN NAVIGATION ================= */}
        {user?.role === "admin" && (
          <>
            <p className={sectionTitle}>Management</p>

            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiHome className="text-base" /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/content"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiFolder className="text-base" /> Content & TMDB
            </NavLink>

            <NavLink
              to="/admin/shows"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiFilm className="text-base" /> Shows
            </NavLink>

            <NavLink
              to="/admin/venues"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin className="text-base" /> Venues
            </NavLink>

            <p className={sectionTitle}>Users & Cities</p>

            <NavLink
              to="/admin/organizers"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiUsers className="text-base" /> Organizers
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiUsers className="text-base" /> Users
            </NavLink>

            <NavLink
              to="/admin/cities"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin className="text-base" /> Cities
            </NavLink>

            <p className={sectionTitle}>Finance & Stats</p>

            <NavLink
              to="/admin/transactions"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiCreditCard className="text-base" /> Transactions
            </NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiBarChart2 className="text-base" /> Analytics
            </NavLink>
          </>
        )}

        {/* ================= ORGANIZER NAVIGATION ================= */}
        {user?.role === "organizer" && (
          <>
            <p className={sectionTitle}>Organizer Portal</p>

            <NavLink
              to="/organizer"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiHome className="text-base" /> Dashboard
            </NavLink>

            <NavLink
              to="/organizer/shows"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiFilm className="text-base" /> My Shows
            </NavLink>

            <NavLink
              to="/organizer/shows/create"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiPlusCircle className="text-base" /> Create Show
            </NavLink>

            <NavLink
              to="/organizer/venues"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin className="text-base" /> My Venues
            </NavLink>

            <NavLink
              to="/organizer/bookings/recent"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiCreditCard className="text-base" /> Bookings
            </NavLink>
          </>
        )}
      </div>

      {/* FOOTER: STOREFRONT LINK & USER PILL */}
      <div className="pt-3 border-t border-gray-100 space-y-2">
        <NavLink
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
        >
          <span className="flex items-center gap-2">
            <FiExternalLink className="text-sm text-purple-600" />
            View Public Site
          </span>
          <span className="text-[10px] text-gray-400">Home →</span>
        </NavLink>

        <div className="px-3 py-2 bg-gray-50 rounded-xl flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {(user?.profile?.fullName || user?.name || user?.email || "U")
              .charAt(0)
              .toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-800 truncate">
              {user?.profile?.fullName || user?.name || "Logged In"}
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;