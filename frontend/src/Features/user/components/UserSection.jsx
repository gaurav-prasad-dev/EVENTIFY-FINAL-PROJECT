import { useDispatch } from "react-redux";
import { IoChevronDown } from "react-icons/io5";
import { setOpenLogin } from "../../auth/authSlice";

const UserSection = ({ user, setOpen }) => {
  const dispatch = useDispatch();

  const displayName =
    user?.profile?.fullName ||
    user?.name ||
    user?.firstName ||
    (user?.email ? user.email.split("@")[0] : "User");

  const displayInitial = (displayName || "U").charAt(0).toUpperCase();

  return (
    <div className="flex items-center shrink-0">
      {user ? (
        <button
          type="button"
          onClick={() => setOpen?.(true)}
          className="group flex items-center gap-2 p-1 pr-2.5 sm:pr-3 rounded-full border border-gray-200/90 bg-white hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-200 cursor-pointer shadow-xs hover:shadow-sm active:scale-95 focus:outline-none"
          title="Open Account Menu"
        >
          <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-xs ring-2 ring-purple-100 group-hover:ring-purple-200 transition-all duration-200">
            {displayInitial}
          </div>
          <span className="hidden sm:inline-block font-semibold text-xs sm:text-sm text-gray-700 group-hover:text-purple-700 max-w-[95px] truncate transition-colors">
            {displayName}
          </span>
          <IoChevronDown className="text-xs text-gray-400 group-hover:text-purple-600 group-hover:translate-y-0.5 transition-transform duration-200 shrink-0" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => dispatch(setOpenLogin(true))}
          className="px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-xs hover:shadow-md hover:shadow-purple-500/25 active:scale-95 transition-all duration-200 flex items-center gap-1.5 focus:outline-none cursor-pointer"
        >
          <span>Sign In</span>
        </button>
      )}
    </div>
  );
};

export default UserSection;