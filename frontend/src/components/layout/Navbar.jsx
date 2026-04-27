
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";

import LoginModal from "../../Features/auth/components/LoginModal";
import Sidebar from "./Sidebar";
import DefaultNavbar from "./DefaultNavbar";
import BookingNavbar from "../navigation/BookingNavbar";
import { setOpenLogin } from "../../Features/auth/authSlice";

function Navbar() {
  const location = useLocation();
  const dispatch = useDispatch();

  const { user, openLogin } = useSelector((state) => state.auth);
  const { movieDetails } = useSelector((state) => state.movies);
  const { currentShow } = useSelector((state) => state.shows);

  const [open, setOpen] = useState(false);

  const isSeatPage = location.pathname.includes("seat-layout");
const isCheckoutPage = location.pathname.includes("checkout");
const isBookingPage = isSeatPage || isCheckoutPage;

  return (
    <>
      {/* ✅ SWITCH NAVBAR */}
      {isBookingPage ? (
        <BookingNavbar
          mode={isCheckoutPage ? "review" : "seat"}
          user={user}
          setOpen={setOpen}
          setOpenLogin={(val) => dispatch(setOpenLogin(val))}
          movie={movieDetails}
          show={currentShow}
        />
      ) : (
        <DefaultNavbar
          user={user}
          setOpen={setOpen}
          setOpenLogin={(val) => dispatch(setOpenLogin(val))}
        />
      )}

      {/* ✅ COMMON COMPONENTS */}
      <LoginModal
        isOpen={openLogin}
        onClose={() => dispatch(setOpenLogin(false))}
      />

      <Sidebar open={open} setOpen={setOpen} />
    </>
  );
}

export default Navbar;

















// import { useLocation } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";

// import LoginModal from "../../Features/auth/components/LoginModal";
// import Sidebar from "./Sidebar";
// import DefaulNavbar from "./DefaultNavbar";

// import { useState } from "react";
// import { setOpenLogin } from "../../Features/auth/authSlice"; // ✅ FIX PATH

// function Navbar() {
//   const location = useLocation();
//   const dispatch = useDispatch();
//   const { movieDetails } = useSelector((state) => state.movies);
// const { currentShow } = useSelector((state) => state.shows);

//   const { user, openLogin } = useSelector((state) => state.auth); // ✅ GET FROM REDUX

//   const [open, setOpen] = useState(false);

//   return (
//     <>
//       {/* ✅ DEFAULT NAVBAR */}
//       <DefaulNavbar
//         user={user}
//         setOpen={setOpen}
//        setOpenLogin={(val) => dispatch(setOpenLogin(val))} // ✅ FI
//          movieDetails={movieDetails}          // ✅ ADD THIS
//   currentShow={currentShow}  
//       />

//       {/* ✅ LOGIN MODAL (REDUX CONTROLLED) */}
//       <LoginModal
//         isOpen={openLogin}
//         onClose={() => dispatch(setOpenLogin(false))}
//       />

//       {/* ✅ SIDEBAR */}
//       <Sidebar open={open} setOpen={setOpen} />
//     </>
//   );
// }

// export default Navbar;