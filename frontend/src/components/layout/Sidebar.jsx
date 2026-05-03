import { useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Features/auth/authSlice";
import { persistor } from "../../app/store";

function Sidebar({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const user = useSelector((state) => state.auth.user);

  // ✅ Close on outside click
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

  if (!open) return null;

  // ✅ Reusable navigation handler (cleaner)
  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  // ✅ FIXED LOGOUT
  const handleLogout = async () => {
    try {
      await persistor.purge();
      dispatch(logout());

      setOpen(false); // 🔥 THIS WAS MISSING
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div
        ref={sidebarRef}
        className="w-80 h-full bg-gray-100 shadow-xl p-5"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setOpen(false)}>
            <IoArrowBack size={22} />
          </button>
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-purple-300 text-purple-700 text-xl font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>

          <div>
            <h3 className="font-semibold">
              {user?.name || "User"}
            </h3>
            <p className="text-sm text-gray-500">
              {user?.phone || "+91XXXXXXXXXX"}
            </p>
          </div>
        </div>

        {/* Bookings */}
        <Section>
          <MenuItem
            label="View all bookings"
            onClick={() => handleNavigate("/my-bookings")}
          />
        </Section>

        {/* Support */}
        <h4 className="text-sm text-gray-500 mb-2">Support</h4>
        <Section>
          <MenuItem
            label="Chat with us"
            onClick={() => handleNavigate("/chat")}
          />
        </Section>

        {/* More */}
        <h4 className="text-sm text-gray-500 mb-2">More</h4>
        <Section>
          <MenuItem
            label="Terms & Conditions"
            onClick={() => handleNavigate("/terms")}
          />
          <MenuItem
            label="Privacy Policy"
            onClick={() => handleNavigate("/privacy")}
          />
        </Section>

        {/* Logout */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full bg-white py-3 rounded-xl text-left px-4 shadow-sm hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm mb-5 overflow-hidden">
      {children}
    </div>
  );
}

function MenuItem({ label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="px-4 py-3 cursor-pointer flex justify-between items-center hover:bg-gray-50"
    >
      <span>{label}</span>
      <span>{">"}</span>
    </div>
  );
}

export default Sidebar;