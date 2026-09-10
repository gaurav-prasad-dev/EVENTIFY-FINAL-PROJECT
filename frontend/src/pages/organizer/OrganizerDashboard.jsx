import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchOrganizerStats,
  fetchRecentBookings,
  fetchUpcomingShows,
} from "../../Features/organizer/organizerSlice";

import {
  FaFilm,
  FaCalendarAlt,
  FaReceipt,
  FaRupeeSign,
  FaPlus,
  FaBuilding,
  FaArrowRight,
  FaTicketAlt,
} from "react-icons/fa";

const OrganizerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, bookings, upcomingShows, loading } = useSelector(
    (state) => state.organizer
  );

  useEffect(() => {
    dispatch(fetchOrganizerStats());
    dispatch(fetchRecentBookings());
    dispatch(fetchUpcomingShows());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Organizer Studio
              <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Partner Portal
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Manage movie showtimes, auditorium venues, ticket sales, and gross revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/organizer/shows/create")}
              className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2"
            >
              <FaPlus className="text-xs" />
              Schedule Show
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Shows"
            value={stats?.totalShows || 0}
            change="Scheduled to date"
            isPositive={true}
            icon={FaFilm}
          />

          <StatCard
            title="Active Shows"
            value={stats?.activeShows || 0}
            change="Currently booking"
            isPositive={true}
            icon={FaCalendarAlt}
          />

          <StatCard
            title="Tickets Booked"
            value={stats?.totalBookings || 0}
            change="Completed orders"
            isPositive={true}
            icon={FaTicketAlt}
          />

          <StatCard
            title="Total Revenue"
            value={`₹${Number(stats?.totalRevenue || 0).toLocaleString("en-IN")}`}
            change="Organizer share"
            isPositive={true}
            icon={FaRupeeSign}
          />
        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/organizer/shows/create")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition">
              <FaPlus />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition">
                Create Show
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Pick movie & schedule slot</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/organizer/shows")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition">
              <FaFilm />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition">
                My Shows
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Manage existing screenings</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/organizer/bookings/recent")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition">
              <FaReceipt />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition">
                Bookings
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">View ticket sales & orders</p>
            </div>
          </button>

          <button
            onClick={() => navigate("/organizer/venues/create")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group flex flex-col justify-between"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-base mb-3 group-hover:scale-105 transition">
              <FaBuilding />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm group-hover:text-purple-600 transition">
                Add Venue
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">Submit new cinema hall</p>
            </div>
          </button>
        </div>

        {/* CONTENT ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* UPCOMING SHOWS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-5 bg-purple-600 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Upcoming Showtimes</h2>
              </div>

              <button
                onClick={() => navigate("/organizer/shows")}
                className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center gap-1 transition"
              >
                View All <FaArrowRight className="text-[10px]" />
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading shows...</p>
              </div>
            ) : upcomingShows?.length > 0 ? (
              <div className="space-y-3">
                {upcomingShows.slice(0, 5).map((show) => (
                  <div
                    key={show._id}
                    className="border border-gray-100 rounded-2xl p-3.5 hover:border-purple-200 hover:bg-purple-50/20 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {show?.contentId?.title || show?.content?.title || "Movie Show"}
                      </h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {show?.screen?.venue?.name || show?.city || "Auditorium"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        📅 {show.showDate ? new Date(show.showDate).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}{" "}
                        {show.startTime && `• ⏰ ${show.startTime}`}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-base font-extrabold text-purple-700">
                        ₹{show.basePrice || 0}
                      </span>
                      <p className="text-[10px] text-gray-400 font-medium">per seat</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 space-y-2">
                <FaFilm className="text-3xl mx-auto opacity-30" />
                <p className="font-semibold text-gray-700 text-sm">No upcoming shows</p>
                <p className="text-xs text-gray-400">Click "Schedule Show" to start selling tickets.</p>
              </div>
            )}
          </div>

          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-5 bg-emerald-600 rounded-full" />
                <h2 className="text-lg font-bold text-gray-900">Recent Customer Bookings</h2>
              </div>

              <button
                onClick={() => navigate("/organizer/bookings/recent")}
                className="text-purple-600 hover:text-purple-700 text-xs font-semibold flex items-center gap-1 transition"
              >
                View All <FaArrowRight className="text-[10px]" />
              </button>
            </div>

            {loading ? (
              <div className="py-10 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading bookings...</p>
              </div>
            ) : bookings?.length > 0 ? (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="border border-gray-100 rounded-2xl p-3.5 hover:border-emerald-200 hover:bg-emerald-50/20 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {booking?.user?.name || "Customer"}
                      </h4>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {booking?.show?.contentId?.title || booking?.show?.content?.title || "Movie Ticket"}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-1">
                        {booking.createdAt
                          ? new Date(booking.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-base font-extrabold text-emerald-600">
                        ₹{booking.totalAmount || 0}
                      </p>
                      <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-400 space-y-2">
                <FaReceipt className="text-3xl mx-auto opacity-30" />
                <p className="font-semibold text-gray-700 text-sm">No bookings recorded yet</p>
                <p className="text-xs text-gray-400">Bookings will appear here as users buy tickets.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;