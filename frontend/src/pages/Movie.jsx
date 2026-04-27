import { useEffect,useState } from "react";
import { getHomeData } from "../Features/movies/movieApi";
import { data } from "react-router-dom";
import MovieRow from "../Features/movies/components/MovieRow";



function Movie (){

    const [movie,setMovie] = useState(null);

    useEffect(() => {
        fetchMovies();

    },[]);

    const fetchMovies = async() => {
        try{

            const res = await getHomeData();
             console.log("FULL RESPONSE:", res); // 🔥 important
               
             setMovie(res);


        }catch(error){
               console.log(error);

        }
    }

    if (!movie) {
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }


    return(
  <>


    <div className="bg-gray-100 min-h-screen">
    <MovieRow title="Top Movies Near you"
     movies={movie?.nowPlaying} />

     <MovieRow
        title="Popular Movies" 
        movies={movie?.popular} 
      />


     
       <MovieRow
        title="Upcoming Movies" 
        movies={movie?.upcoming} 
      />


     </div>
    </>
    )
    

} 

export default Movie;