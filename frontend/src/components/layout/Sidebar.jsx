import { useEffect, useRef } from "react";
import {
  IoClose,
  IoTicketOutline,
  IoChatbubbleEllipsesOutline,
  IoDocumentTextOutline,
  IoShieldCheckmarkOutline,
  IoLogOutOutline,
  IoChevronForward,
} from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Features/auth/authSlice";
import { logoutUser } from "../../Features/auth/authApi";
import { persistor } from "../../app/store";

function Sidebar({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const user = useSelector((state) => state.auth.user);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClick);
    }

    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, setOpen]);

  // Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, setOpen]);

  if (!open) return null;

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // Complete Logout (Server + Client)
  const handleLogout = async () => {
    try {
      try {
        await logoutUser();
      } catch (err) {
        console.log("Server logout failed, clearing local state:", err.message);
      }
      await persistor.purge();
      dispatch(logout());

      setOpen(false);
      navigate("/");
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const displayName =
    user?.profile?.fullName || user?.name || user?.email || "User";
  const displayContact = user?.email || user?.phone || "+91XXXXXXXXXX";
  const displayInitial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs transition-opacity">
      <div
        ref={sidebarRef}
        className="w-80 sm:w-96 max-w-[90vw] h-full bg-gray-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <h2 className="text-lg font-bold text-gray-800">My Account</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-200/70 transition cursor-pointer"
              title="Close"
            >
              <IoClose size={20} />
            </button>
          </div>

          {/* Profile Card */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-200/90 shadow-xs mb-6">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white text-lg font-bold shadow-xs ring-2 ring-purple-100 shrink-0">
              {displayInitial}
            </div>

            <div className="overflow-hidden min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm truncate">
                {displayName}
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                {displayContact}
              </p>
            </div>
          </div>

          {/* Bookings */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
              Activity
            </h4>
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden divide-y divide-gray-100">
              <MenuItem
                icon={<IoTicketOutline className="text-purple-600 text-lg" />}
                label="View all bookings"
                onClick={() => handleNavigate("/my-bookings")}
              />
            </div>
          </div>

          {/* Support */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
              Support
            </h4>
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden divide-y divide-gray-100">
              <MenuItem
                icon={<IoChatbubbleEllipsesOutline className="text-purple-600 text-lg" />}
                label="Chat with us"
                onClick={() => handleNavigate("/chat")}
              />
            </div>
          </div>

          {/* More */}
          <div className="mb-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-1">
              About
            </h4>
            <div className="bg-white rounded-2xl border border-gray-200/90 shadow-xs overflow-hidden divide-y divide-gray-100">
              <MenuItem
                icon={<IoDocumentTextOutline className="text-gray-400 text-lg" />}
                label="Terms & Conditions"
                onClick={() => handleNavigate("/terms")}
              />
              <MenuItem
                icon={<IoShieldCheckmarkOutline className="text-gray-400 text-lg" />}
                label="Privacy Policy"
                onClick={() => handleNavigate("/privacy")}
              />
            </div>
          </div>
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 bg-red-50/70 text-red-600 font-semibold text-sm hover:bg-red-100/80 transition shadow-xs active:scale-98 cursor-pointer"
          >
            <IoLogOutOutline className="text-lg" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full px-4 py-3 cursor-pointer flex justify-between items-center text-left hover:bg-purple-50/40 transition group"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700 transition-colors">
          {label}
        </span>
      </div>
      <IoChevronForward className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all text-xs" />
    </button>
  );
}

export default Sidebar;