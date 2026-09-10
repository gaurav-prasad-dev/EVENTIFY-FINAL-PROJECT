import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchMyShows,
  deleteShow,
  publishShow,
} from "../../Features/organizer/organizerSlice";

import {
  FaFilm,
  FaCalendarAlt,
  FaClock,
  FaRupeeSign,
  FaPlus,
  FaTrash,
  FaSearch,
  FaCheckCircle,
  FaGlobe,
  FaMapMarkerAlt,
} from "react-icons/fa";

const MyShows = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myShows, loading } = useSelector((state) => state.organizer);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "approved" | "pending" | "published"

  useEffect(() => {
    dispatch(fetchMyShows());
  }, [dispatch]);

  const filteredShows = useMemo(() => {
    return (myShows || []).filter((s) => {
      const title = s.content?.title || "";
      const city = s.city || "";
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        city.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "all") return true;
      if (filter === "approved") return s.approvalStatus === "approved";
      if (filter === "pending") return s.approvalStatus === "pending";
      if (filter === "published") return s.publishedStatus === "published";
      return true;
    });
  }, [myShows, search, filter]);

  const showStats = useMemo(() => {
    const list = Array.isArray(myShows) ? myShows : [];
    const totalShows = list.length;
    const approvedShows = list.filter((s) => s.approvalStatus === "approved").length;
    const pendingShows = list.filter((s) => s.approvalStatus === "pending").length;
    const publishedShows = list.filter((s) => s.publishedStatus === "published").length;
    return { totalShows, approvedShows, pendingShows, publishedShows };
  }, [myShows]);

  // ================= DELETE =================
  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title || "this show"}"?`)) {
      dispatch(deleteShow(id));
    }
  };

  // ================= PUBLISH =================
  const handlePublish = (id) => {
    dispatch(publishShow(id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FaFilm className="text-lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                My Scheduled Shows
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              View scheduled movie screenings, check admin approval states, and manage live showtimes.
            </p>
          </div>

          <button
            onClick={() => navigate("/organizer/shows/create")}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
          >
            <FaPlus className="text-xs" />
            Add Show
          </button>
        </div>

        {/* ANALYTICS STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
              <FaFilm />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Shows
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {showStats.totalShows}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved Shows
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {showStats.approvedShows}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              <FaClock />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pending Approval
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {showStats.pendingShows}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <FaGlobe />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published & Live
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {showStats.publishedShows}
              </h3>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER PILLS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm flex-1">
            <FaSearch className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search your shows by movie title or city..."
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

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "all"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              All ({myShows?.length || 0})
            </button>

            <button
              onClick={() => setFilter("approved")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "approved"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Approved
            </button>

            <button
              onClick={() => setFilter("pending")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "pending"
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Pending Admin
            </button>

            <button
              onClick={() => setFilter("published")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === "published"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              Live / Published
            </button>
          </div>
        </div>

        {/* SHOWS GRID */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
            <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm">Loading your shows...</p>
          </div>
        ) : filteredShows.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center text-gray-400 space-y-3">
            <FaFilm className="text-4xl mx-auto opacity-30" />
            <p className="font-semibold text-gray-700">No shows found</p>
            <p className="text-xs text-gray-400 max-w-sm mx-auto">
              You haven't scheduled any shows matching this filter yet. Create a new show to start booking tickets!
            </p>
            <button
              onClick={() => navigate("/organizer/shows/create")}
              className="mt-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-5 py-2 rounded-xl text-xs shadow-sm transition inline-flex items-center gap-1.5"
            >
              <FaPlus className="text-[10px]" /> Schedule First Show
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShows.map((show) => (
              <div
                key={show._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col justify-between group"
              >
                {/* Poster Container */}
                <div className="relative h-56 bg-gray-100 overflow-hidden">
                  {show.content?.poster ? (
                    <img
                      src={show.content.poster}
                      alt={show.content?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                      <FaFilm className="text-4xl opacity-30 mb-2" />
                      <span className="text-xs">No Poster</span>
                    </div>
                  )}

                  {/* Status Pills Overlaid */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                        show.approvalStatus === "approved"
                          ? "bg-emerald-600 text-white"
                          : show.approvalStatus === "rejected"
                          ? "bg-red-600 text-white"
                          : "bg-amber-400 text-amber-950"
                      }`}
                    >
                      {show.approvalStatus}
                    </span>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-sm ${
                        show.publishedStatus === "published"
                          ? "bg-purple-600 text-white"
                          : "bg-gray-800 text-gray-100"
                      }`}
                    >
                      {show.publishedStatus}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-gray-900 text-base line-clamp-1 group-hover:text-purple-600 transition">
                      {show.content?.title || "Untitled Show"}
                    </h3>

                    <div className="space-y-1 text-xs text-gray-500">
                      <p className="flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-gray-400" />
                        {show.screen?.venue?.name || show.city || "Venue Assigned"}
                      </p>

                      <p className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-gray-400" />
                        {show.showDate
                          ? new Date(show.showDate).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "No date specified"}
                      </p>

                      <p className="flex items-center gap-1.5">
                        <FaClock className="text-gray-400" />
                        {show.startTime || "TBD"} {show.endTime ? `- ${show.endTime}` : ""}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between border-t border-gray-100">
                      <span className="text-xs text-gray-400">Base Price</span>
                      <span className="text-base font-extrabold text-purple-700">
                        ₹{show.basePrice || show.pricing?.[0]?.price || 0}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    {show.publishedStatus !== "published" && (
                      <button
                        type="button"
                        onClick={() => handlePublish(show._id)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white py-2 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <FaGlobe className="text-[10px]" />
                        Publish
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleDelete(show._id, show.content?.title)}
                      className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition"
                      title="Delete show"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyShows;