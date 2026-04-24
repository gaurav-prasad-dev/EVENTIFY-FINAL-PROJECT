import { Link, NavLink, useLocation }from "react-router-dom";
import logo from "../../image/logo2.png"
import { IoIosSearch } from "react-icons/io";
import { useSelector } from "react-redux";

import { useState } from "react";
import LoginModal from "../../Features/auth/components/LoginModal";
import Sidebar from "./Sidebar";
import BookingNavbar from "../navigation/BookingNavbar";
import DefaulNavbar from "./DefaultNavbar";

function Navbar(){

  const location = useLocation();

  const { user } = useSelector((state) => state.auth);
  

const isSeatPage = location.pathname.includes("seat");


  const[openLogin, setOpenLogin] = useState(false);

  const [open, setOpen] = useState(false);


  

  return(
    <>
      
        <DefaulNavbar
         user={user}
        setOpen={setOpen}
        setOpenLogin={setOpenLogin}

        />

         {/* GLOBAL MODALS */}
      <LoginModal isOpen={openLogin} onClose={() => setOpenLogin(false)} />
      <Sidebar open={open} setOpen={setOpen} />
    </>
  

    
  )


}


export default Navbar;


