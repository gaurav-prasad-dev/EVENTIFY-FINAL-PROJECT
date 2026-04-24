const EventCard = ({ event }) => {
  return (
    <div className="min-w-[180px] max-w-[180px] group cursor-pointer">

      {/* Image */}
      <div className="relative">
        <img
          src={event.image}
          alt={event.title}
          className="rounded-xl h-[180px] w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Date Badge */}
        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          📅 {event.date}
        </div>
      </div>

      {/* Info */}
      <div className="mt-2">
        <h3 className="font-semibold text-sm line-clamp-2">
          {event.title}
        </h3>

        <p className="text-xs text-gray-500">
          📍 {event.city}
        </p>
      </div>
    </div>
  );
};

export default EventCard;