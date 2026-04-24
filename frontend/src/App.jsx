import { Routes, Route,useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import Navbar from "./components/layout/Navbar"
import Home from "./pages/Home"
import MovieDetails from "./Features/movies/components/MovieDetails"
import SeatLayout from "./Features/booking/components/SeatLayout";
import CheckOutTime from "./Features/booking/components/CheckOutTime";
import BookingNavbar from "./components/navigation/BookingNavbar";
import Success from "./pages/Success";
import Movie from "./pages/Movie";




function App() {

    const location = useLocation();

 const path = location.pathname;

const isCheckoutPage = path.includes("/checkout");
const isSeatPage = path.includes("/seat-layout");

   // ✅ GET USER FROM REDUX (NOT localStorage)
  const { user } = useSelector((state) => state.auth || {});

  return(

  <> 
   {/* ✅ SINGLE NAVBAR CONTROL */}
        {isCheckoutPage ? (
        <BookingNavbar mode="review" user={user} />
      ) :isSeatPage ? (
        <BookingNavbar mode="seat" user={user} />
      ): (
        <Navbar />
      )}

  <Routes>

    <Route path="/" element={<Home/>}/>
    <Route path="/movies" element={<Movie/>}/>
    <Route path="/movies/:movieId/:city" element={<MovieDetails />}/>
<Route path="/seat-layout/:showId" element={<SeatLayout/>}/>
<Route path="/checkout" element={<CheckOutTime />} />
<Route path="/success/:bookingId" element={<Success />} />
    
  </Routes>
  </>
  
  )

}

export default App
