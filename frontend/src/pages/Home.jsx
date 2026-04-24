import { useState,useEffect } from "react";
import { getHomeData } from "../Features/movies/movieApi"
import { data } from "react-router-dom";
import MovieRow from "../Features/movies/components/MovieRow";
import { getEventData } from "../Features/events/eventApi"
import EventR from "../Features/events/components/EventR";
function Home(){

    const [movies, setMovies] = useState(null);
    const[events,setEvents] = useState(null);
  
    useEffect(() =>{
        fetchEvents();
        fetchHome();
    },[]);



    const fetchEvents = async() =>{
        try{
            const res = await getEventData();
            console.log("FULL RESPONSE:", res); // 🔥 important
            setEvents(res);
            console.log("POPULAR MOVIE:", movies?.popular?.[0]);
            console.log(events);


        }catch(error){
             console.log(error);

        }
    }

    const fetchHome = async() => {
        try{

            const res = await getHomeData();
               console.log("FULL RESPONSE:", res); // 🔥 important

            setMovies(res?.data);
            console.log("POPULAR MOVIE:", movies?.popular?.[0]);
            console.log(movies);

         

            
        }catch(error){

            console.log(error);
        }

     

              // 🔄 Loading
  if (!movies || !events) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }


}
    return(
        <>


<div className="bg-gray-100 min-h-screen">
    <MovieRow title="Top Movies Near you"
     movies={movies?.nowPlaying}/>

     <EventR 
  title="🎵 Music Events" 
  events={events?.music} 
/>


 <MovieRow
        title="Popular Movies" 
        movies={movies?.popular} 
      />


<EventR
  title="🏏 Sports Events" 
  events={events?.sports} 
/>

       <MovieRow
        title="Upcoming Movies" 
        movies={movies?.upcoming} 
      />

      <EventR
  title="😂 Comedy Shows" 
  events={events?.comedy} 
/>
</div>
       
</>

    )
}







export default Home;