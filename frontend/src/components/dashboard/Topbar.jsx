import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../Features/auth/authSlice"
const Topbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="bg-white shadow-sm px-6 py-3 flex justify-between items-center">
      <h1 className="text-lg font-semibold text-gray-700">
        Dashboard
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Hi, {user?.name || "User"}
        </span>

        <button
          onClick={handleLogout}
          className="bg-purple-600 text-white px-3 py-1 rounded-md text-sm hover:bg-purple-700"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Topbar;