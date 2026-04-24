import MovieCard from "./MovieCard";
import { useRef } from "react";

const MovieRow = ({ title, movies }) => {

    const scrollRef = useRef();

    // const scrollLeft = () => {
    //     scrollRef.current.scrollBy({
    //         left: -500,
    //         behaviour: "smooth",
    //     })
    // }

    // const scrollRight = () => {
    //     scrollRef.current.scrollBy({
    //         left:500,
    //         behaviour: "smooth",
    //     });
    // }

    return(
        <div className="px-6 py-6">
            {/* sectionTitle */}
            <h2 className="text-2xl font-semibold mb-4">
                {title}
            </h2>

             {/* Left Button */}
      {/* <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 z-10 bg-white/80 p-2 rounded-full shadow"
      >
        ◀
      </button> */}

            {/* grid */}
            <div 
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide">
{movies?.map((movie) => (
    <MovieCard key={movie.id}  movie={movie}/>

))}
            </div>

             {/* Right Button */}
      {/* <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 z-10 bg-white/80 p-2 rounded-full shadow"
      >
        ▶
      </button> */}

        </div>

        
    )
}

export default MovieRow;