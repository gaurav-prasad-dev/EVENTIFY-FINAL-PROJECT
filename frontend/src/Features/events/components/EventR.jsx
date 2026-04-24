import { useRef } from "react";
import EventCard from "./EventCard";



const EventR = ({ title, events }) => {
  const scrollRef = useRef();

//   const scrollLeft = () => {
//     scrollRef.current.scrollBy({
//       left: -500,
//       behavior: "smooth",
//     });
//   };

//   const scrollRight = () => {
//     scrollRef.current.scrollBy({
//       left: 500,
//       behavior: "smooth",
//     });
//   };

  return (

    <div className="px-6 py-6 relative">

      {/* Title */}
      <h2 className="text-xl font-semibold mb-4">
        {title}
      </h2>
{/* 
      Left Button
      <button
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
      >
        ◀
      </button> */}

      {/* Slider */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide"
      >
        {events?.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
{/* 
      Right Button
      <button
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow"
      >
        ▶
      </button> */}

    </div>
  );
};

export default EventR;