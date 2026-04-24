const UserSection = ({ user, setOpen, setOpenLogin }) => {
  return (
    <>
      {user ? (
        <div
          onClick={() => setOpen(true)}
          className="w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {user.firstName?.charAt(0).toUpperCase()}
        </div>
      ) : (
        <button
          onClick={() => setOpenLogin(true)}
          className="px-4 py-2 bg-purple-200 text-purple-800 rounded-full text-sm hover:bg-purple-300 transition"
        >
          Sign In
        </button>
      )}
    </>
  );
};

export default UserSection;