import { useLocation } from "react-router-dom";
import UserSection from "../../Features/user/components/UserSection";
import logo from "../../image/logo2.png";

const BookingNavbar = ({ user, setOpen, setOpenLogin, mode ="seat" }) => {
  const { state } = useLocation();

  return (
    <div className="w-full h-[70px] bg-white px-6 flex items-center justify-between border-b">

      {/* LEFT → LOGO */}
      <div className="flex items-center">
        <img src={logo} className="w-[130px]" />
      </div>

      {/* CENTER → MOVIE DETAILS */}
      {/* <div className="flex flex-col items-center text-center"> */}
   

     <div className="flex flex-col items-center text-center">

  {mode === "review" ? (
    // 💳 Checkout Page
    <h2 className="text-lg font-semibold text-gray-800">
      Review your booking
    </h2>
  ) : (
    // 🎬 Seat Layout Page
    <>
      <h2 className="text-lg font-semibold">
        {state?.movieName || "Movie Name"}
      </h2>

      <p className="text-xs text-gray-400">
        {state?.theatreName || "Theatre"} | {state?.city || "City"}
      </p>
    </>
  )}

</div>


  

      {/* RIGHT → USER */}
      <UserSection
        user={user}
        setOpen={setOpen}
        setOpenLogin={setOpenLogin}
      />
            </div>
  
  );
};

export default BookingNavbar;