// pages/MyBookings.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookingsThunk } from "../Features/booking/bookSlice";
import { useNavigate } from "react-router-dom";

function MyBookings() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { myBookings, loadingMyBookings } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(fetchMyBookingsThunk());
  }, [dispatch]);

  if (loadingMyBookings) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="animate-pulse text-gray-600 text-lg">
          Loading your bookings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              My Bookings
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View your confirmed movie tickets and booking history
            </p>
          </div>

          <button
            onClick={() => navigate("/movies")}
            className="px-4 py-2 bg-black text-white text-sm rounded-xl font-medium hover:bg-gray-800 transition"
          >
            Book More Movies
          </button>
        </div>

        {(!myBookings || myBookings.length === 0) ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
            <div className="text-5xl mb-4">🎟️</div>
            <h3 className="text-lg font-semibold text-gray-800">
              No bookings yet
            </h3>
            <p className="text-gray-500 text-sm mt-1 mb-6">
              Looks like you haven't booked any movie tickets yet.
            </p>
            <button
              onClick={() => navigate("/movies")}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition"
            >
              Explore Movies
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {myBookings.map((b) => {
              const show = b.show;
              const content = show?.content;

              const title = content?.title || show?.movieName || "Movie Ticket";
              const poster = content?.poster || "";
              const venue = show?.screen?.venue?.name || show?.theatreName || "Cinema Venue";
              const screen = show?.screen?.name || `Screen ${show?.screen?.screenNumber || 1}`;

              const formattedTime = show?.startTime
                ? new Date(show.startTime).toLocaleString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "Scheduled Show";

              const isConfirmed =
                b.bookingStatus === "Confirmed" || b.paymentStatus === "Success";

              return (
                <div
                  key={b._id}
                  className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    {poster ? (
                      <img
                        src={poster}
                        alt={title}
                        className="w-20 h-28 rounded-xl object-cover shadow-sm flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-28 rounded-xl bg-purple-100 flex items-center justify-center text-2xl flex-shrink-0">
                        🎬
                      </div>
                    )}

                    <div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${
                          isConfirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {b.bookingStatus || "Reserved"}
                      </span>

                      <h3 className="text-lg font-semibold text-gray-900 mt-2">
                        {title}
                      </h3>

                      <p className="text-sm text-gray-600 mt-0.5">
                        {venue} • {screen}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        📅 {formattedTime}
                      </p>

                      <p className="text-sm font-medium text-gray-800 mt-2">
                        Seats:{" "}
                        <span className="text-purple-700 font-semibold">
                          {b.seats?.join(", ") || "N/A"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <p className="text-lg font-bold text-gray-900">
                      ₹{b.totalAmount || 0}
                    </p>

                    <button
                      onClick={() => navigate(`/success/${b._id}`)}
                      className="mt-2 text-sm text-purple-600 font-medium hover:text-purple-800 transition hover:underline"
                    >
                      View Ticket & QR →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;