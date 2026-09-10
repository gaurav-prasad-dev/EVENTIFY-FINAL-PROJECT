import { NavLink } from "react-router-dom";
import logo from "../../image/logo2.png";
import UserSection from "../../Features/user/components/UserSection";
import Location from "../../Features/location/components/Location";
import SearchBar from "../navigation/SearchBar";

const DefaultNavbar = ({ user, setOpen, setOpenLogin }) => {
  const navItems = [
    { name: "Home", path: "/", activeClass: "bg-purple-100 text-purple-700 font-semibold shadow-xs" },
    { name: "Movies", path: "/movies", activeClass: "bg-red-100 text-red-700 font-semibold shadow-xs" },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200/70 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] transition-all">
      <div className="max-w-[1440px] mx-auto min-h-[64px] sm:h-[68px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-6">

        {/* LEFT: Logo + Location + Home & Movies Links */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <NavLink
            to="/"
            className="shrink-0 flex items-center group transition-transform duration-200 hover:scale-[1.03] active:scale-[0.98]"
          >
            <img
              src={logo}
              alt="Eventify"
              className="w-[120px] sm:w-[138px] h-auto object-contain transition-opacity duration-200 group-hover:opacity-90"
            />
          </NavLink>

          <Location />

          <div className="h-6 w-px bg-gray-200 hidden md:block mx-1" />

          <div className="flex gap-1 sm:gap-1.5 items-center">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 select-none ${
                    isActive
                      ? item.activeClass
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:scale-95"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}

            {/* QUICK LINK FOR ORGANIZER / ADMIN */}
            {user?.role === "organizer" && (
              <NavLink
                to="/organizer/dashboard"
                className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 hover:text-purple-800 transition-all duration-200 border border-purple-200/80 shadow-xs active:scale-95"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                </span>
                Organizer Portal
              </NavLink>
            )}

            {user?.role === "admin" && (
              <NavLink
                to="/admin/dashboard"
                className="hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-900 text-white hover:bg-black transition-all duration-200 shadow-xs hover:shadow-sm active:scale-95"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Admin Panel
              </NavLink>
            )}
          </div>
        </div>

        {/* RIGHT: Search Bar + User Section */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          {/* Search Bar (Desktop) */}
          <div className="w-[220px] md:w-[270px] lg:w-[350px] hidden md:block">
            <SearchBar />
          </div>

          <UserSection
            user={user}
            setOpen={setOpen}
            setOpenLogin={setOpenLogin}
          />
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      <div className="md:hidden px-4 pb-2.5 pt-1.5 border-t border-gray-100 bg-white/95 backdrop-blur-md">
        <SearchBar />
      </div>
    </nav>
  );
};

export default DefaultNavbar;