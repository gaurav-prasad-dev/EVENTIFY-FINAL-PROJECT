import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchRecentBookings } from "../../Features/organizer/organizerSlice";

import {
  FaReceipt,
  FaRupeeSign,
  FaSearch,
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaTicketAlt,
  FaCheckCircle,
} from "react-icons/fa";

const Bookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading } = useSelector((state) => state.organizer);

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchRecentBookings());
  }, [dispatch]);

  // ================= FILTER =================
  const filteredBookings = useMemo(() => {
    return (bookings || []).filter((b) => {
      const email = b.user?.email || "";
      const name = b.user?.name || "";
      const movie = b.show?.content?.title || b.show?.contentId?.title || "";
      const s = search.toLowerCase();
      return (
        email.toLowerCase().includes(s) ||
        name.toLowerCase().includes(s) ||
        movie.toLowerCase().includes(s)
      );
    });
  }, [bookings, search]);

  // ================= STATS =================
  const totalRevenue = useMemo(() => {
    return (bookings || []).reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  }, [bookings]);

  const todayCount = useMemo(() => {
    const todayStr = new Date().toDateString();
    return (bookings || []).filter(
      (b) => new Date(b.createdAt).toDateString() === todayStr
    ).length;
  }, [bookings]);

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Ticket Bookings & Revenue
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Track customer ticket purchases, reserved seat allocations, and gross transaction volume.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaReceipt className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Orders</p>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {bookings?.length || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">
                {bookings?.length || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaTicketAlt />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Gross Ticket Sales</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">
                ₹{Number(totalRevenue).toLocaleString("en-IN")}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaRupeeSign />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Orders Placed Today</p>
              <h3 className="text-2xl font-black text-purple-700 mt-1">
                {todayCount}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaCalendarAlt />
            </div>
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search bookings by customer name, email, or movie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-gray-400 hover:text-gray-600 mr-2 text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* BOOKINGS LIST */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading recent bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
            <FaReceipt className="text-4xl mx-auto opacity-30" />
            <p className="font-semibold text-gray-700">No bookings found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              No ticket orders match your search query. New customer reservations will show here in real-time.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Movie & customer info */}
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h3 className="font-bold text-gray-900 text-base">
                      {b.show?.content?.title || b.show?.contentId?.title || "Movie Ticket"}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 text-[11px] rounded-full font-bold uppercase tracking-wider ${
                        b.status === "confirmed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-red-50 text-red-600 border border-red-200"
                      }`}
                    >
                      {b.status || "confirmed"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <FaUser className="text-gray-400" />
                    <span className="font-semibold text-gray-700">{b.user?.name || "Customer"}</span>
                    <span>({b.user?.email || "No email"})</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <FaTicketAlt className="text-purple-500" />
                      Seats:{" "}
                      <span className="font-semibold text-gray-800">
                        {Array.isArray(b.seats) ? b.seats.join(", ") : b.seats || "N/A"}
                      </span>
                    </span>

                    <span className="flex items-center gap-1 text-gray-400">
                      <FaCalendarAlt />
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </span>
                  </div>
                </div>

                {/* Right: Total Amount */}
                <div className="text-left md:text-right flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-gray-100 flex md:flex-col items-center md:items-end justify-between">
                  <span className="text-xs text-gray-400 md:mb-0.5">Amount Paid</span>
                  <span className="text-2xl font-black text-emerald-600">
                    ₹{b.totalAmount || 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Bookings;