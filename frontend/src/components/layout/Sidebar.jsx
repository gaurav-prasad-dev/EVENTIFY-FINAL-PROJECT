import { useEffect, useRef } from "react";
import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Features/auth/authSlice";
import { persistor } from "../../app/store"; // ✅ fix path

function Sidebar({ open, setOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef();

  const user = useSelector((state) => state.auth.user);

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

  const handleLogout = async () => {
    try {
      await persistor.purge(); // ✅ clear storage first
      dispatch(logout());      // ✅ clear redux

      setOpen(false);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div
        ref={sidebarRef}
        className="w-80 h-full bg-white shadow-xl p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <IoArrowBack size={20} />
          </button>
          <h2 className="text-lg font-semibold">Menu</h2>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <img
            src="https://i.pravatar.cc/100"
            className="w-12 h-12 rounded-full"
            alt="user"
          />
          <div>
            <h3 className="font-medium">
              {user?.name || "Guest User"}
            </h3>
            <p className="text-sm text-gray-500">Welcome 👋</p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <MenuItem label="View Bookings" />
          <MenuItem label="Chat with Us" />
          <MenuItem label="Update Profile" />
          <MenuItem label="Terms & Conditions" />
          <MenuItem label="Privacy Policy" />
        </div>

        <div className="border-t my-6"></div>

        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-3 rounded-lg text-red-500 hover:bg-red-50"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function MenuItem({ label }) {
  return (
    <div className="px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100">
      {label}
    </div>
  );
}

export default Sidebar;