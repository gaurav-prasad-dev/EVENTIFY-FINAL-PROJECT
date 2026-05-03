import DashboardLayout from "../../components/dashboard/DashboardLayout"
import StatCard from "../../components/dashboard/StatCard"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchOrganizerStats,
  fetchRecentBookings,
  fetchUpcomingShows,
} from "../../Features/organizer/organizerSlice"

const OrganizerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { stats, bookings, upcomingShows, loading } =
    useSelector((state) => state.organizer);

  useEffect(() => {
    dispatch(fetchOrganizerStats());
    dispatch(fetchRecentBookings());
    dispatch(fetchUpcomingShows());
  }, [dispatch]);

  return (
    <DashboardLayout>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back 👋 Manage your shows efficiently
          </p>
        </div>

        <button
          onClick={() => navigate("/organizer/shows/create")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-xl shadow"
        >
          + Create Show
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Shows"
          value={stats?.totalShows || 0}
          icon="🎬"
        />
        <StatCard
          title="Active Shows"
          value={stats?.activeShows || 0}
          icon="📅"
        />
        <StatCard
          title="Bookings"
          value={stats?.totalBookings || 0}
          icon="🧾"
        />
        <StatCard
          title="Revenue"
          value={`₹${stats?.totalRevenue || 0}`}
          icon="💰"
        />
      </div>

      {/* QUICK ACTIONS 🔥 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <button
          onClick={() => navigate("/organizer/shows/create")}
          className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
        >
          🎬 Create Show
        </button>

        <button
          onClick={() => navigate("/organizer/shows")}
          className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
        >
          📃 View Shows
        </button>

        <button
          onClick={() => navigate("/organizer/bookings")}
          className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
        >
          🧾 Bookings
        </button>

        <button
          onClick={() => navigate("/organizer/analytics")}
          className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition"
        >
          📊 Analytics
        </button>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* UPCOMING SHOWS */}
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">
              Upcoming Shows
            </h2>

            <button
              onClick={() => navigate("/organizer/shows")}
              className="text-purple-600 text-sm"
            >
              View All
            </button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : upcomingShows?.length > 0 ? (
            <div className="space-y-4">
              {upcomingShows.slice(0, 5).map((show) => (
                <div
                  key={show._id}
                  className="border rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <h3 className="font-semibold text-gray-800">
                    {show?.contentId?.title || "Movie"}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {show?.screen?.venue?.name}
                  </p>

                  <div className="flex justify-between mt-2 text-sm">
                    <span>
                      {new Date(show.showDate).toDateString()}
                    </span>

                    <span className="text-purple-600 font-medium">
                      ₹{show.basePrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No upcoming shows
            </p>
          )}
        </div>

        {/* RECENT BOOKINGS */}
        <div className="bg-white rounded-2xl p-5 border shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-semibold">
              Recent Bookings
            </h2>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : bookings?.length > 0 ? (
            <div className="space-y-4">
              {bookings.slice(0, 6).map((booking) => (
                <div
                  key={booking._id}
                  className="flex justify-between items-center border rounded-xl p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-semibold">
                      {booking?.user?.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {booking?.show?.contentId?.title}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-purple-600 font-bold">
                      ₹{booking.totalAmount}
                    </p>
                    <span className="text-xs text-green-600">
                      Paid
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">
              No bookings found
            </p>
          )}
        </div>

      </div>

    </DashboardLayout>
  );
};

export default OrganizerDashboard;