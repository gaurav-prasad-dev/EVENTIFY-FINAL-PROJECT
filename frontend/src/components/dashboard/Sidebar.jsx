import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

import {
  FiHome,
  FiUsers,
  FiFilm,
  FiMapPin,
  FiCreditCard,
  FiBarChart2,
  FiMonitor,
   FiFolder,
} from "react-icons/fi";

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const baseClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";

  const activeClass =
    "bg-purple-600 text-white shadow-md";

  const normalClass =
    "text-gray-600 hover:bg-purple-50 hover:text-purple-700";

  const sectionTitle =
    "text-xs uppercase text-gray-400 mt-6 mb-2 px-2";

  return (
    <div className="w-64 bg-white border-r h-screen p-5 flex flex-col">

      {/* LOGO */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-purple-700">
          Eventify
        </h1>
        <p className="text-xs text-gray-400">
          Dashboard Panel
        </p>
      </div>

      {/* ================= ADMIN ================= */}
      {user?.role === "admin" && (
        <>
          <p className={sectionTitle}>Admin</p>

          <div className="space-y-1">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiHome /> Dashboard
            </NavLink>

            <NavLink
              to="/admin/organizers"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiUsers /> Organizers
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiUsers /> Users
            </NavLink>

            <NavLink
              to="/admin/venues"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin /> Venues
            </NavLink>

            <NavLink
              to="/admin/shows"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiFilm /> Shows
            </NavLink>

            <NavLink
              to="/admin/cities"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin /> Cities
            </NavLink>

            <NavLink
  to="/admin/content"
  className={({ isActive }) =>
    `${baseClass} ${isActive ? activeClass : normalClass}`
  }
>
  <FiFolder /> Content
</NavLink>

            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >

              <FiBarChart2 /> Analytics
            </NavLink>
          </div>
        </>
      )}

      {/* ================= ORGANIZER ================= */}
      {user?.role === "organizer" && (
        <>
          <p className={sectionTitle}>Organizer</p>

          <div className="space-y-1">

            <NavLink
              to="/organizer"
              end
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiHome /> Dashboard
            </NavLink>

            <NavLink
              to="/organizer/shows"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiFilm /> My Shows
            </NavLink>

            <NavLink
              to="/organizer/bookings/recent"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiCreditCard /> Bookings
            </NavLink>

          

            {/* 🔥 ADD THIS */}
            {/* <NavLink
              to="/organizer/analytics"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiBarChart2 /> Analytics
            </NavLink> */}

            <NavLink
              to="/organizer/venues/create"
              className={({ isActive }) =>
                `${baseClass} ${isActive ? activeClass : normalClass}`
              }
            >
              <FiMapPin /> Venues
            </NavLink>

          </div>
        </>
      )}

      {/* FOOTER */}
      <div className="mt-auto text-xs text-gray-400 pt-6">
        Logged in as <span className="text-gray-600">{user?.role}</span>
      </div>
    </div>
  );
};

export default Sidebar;