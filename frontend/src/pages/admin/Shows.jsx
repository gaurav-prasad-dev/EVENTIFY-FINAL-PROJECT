import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchShows,
  deleteShow,
  approveShow,
  rejectShow,
} from "../../Features/admin/adminSlice";

import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaMapMarkerAlt,
  FaClock,
  FaCalendarAlt,
  FaSearch,
  FaFilm,
  FaRupeeSign,
  FaBuilding,
} from "react-icons/fa";

const Shows = () => {
  const dispatch = useDispatch();

  const { shows, loading } = useSelector((state) => state.admin);

  const [selectedShow, setSelectedShow] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // "all" | "pending" | "approved" | "rejected"
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  // ======================================================
  // FILTER & SEARCH
  // ======================================================
  const filteredShows = useMemo(() => {
    return (shows || []).filter((s) => {
      const title = s.content?.title || "";
      const city = s.city || "";
      const organizer = s.organizerId?.name || "";
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) ||
        city.toLowerCase().includes(search.toLowerCase()) ||
        organizer.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filterStatus === "all") return true;
      return s.approvalStatus === filterStatus;
    });
  }, [shows, search, filterStatus]);

  const pendingCount = (shows || []).filter((s) => s.approvalStatus === "pending").length;
  const approvedCount = (shows || []).filter((s) => s.approvalStatus === "approved").length;
  const rejectedCount = (shows || []).filter((s) => s.approvalStatus === "rejected").length;

  // ======================================================
  // DELETE
  // ======================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this show?")) return;
    setLoadingId(id);
    await dispatch(deleteShow(id));
    setLoadingId(null);
    if (selectedShow?._id === id) {
      setSelectedShow(null);
    }
  };

  // ======================================================
  // APPROVE
  // ======================================================
  const handleApprove = async (id) => {
    setLoadingId(id);
    await dispatch(approveShow(id));
    await dispatch(fetchShows());
    setLoadingId(null);
    if (selectedShow?._id === id) {
      setSelectedShow((prev) => ({ ...prev, approvalStatus: "approved" }));
    }
  };

  // ======================================================
  // REJECT
  // ======================================================
  const handleReject = async (id) => {
    setLoadingId(id);
    await dispatch(rejectShow(id));
    await dispatch(fetchShows());
    setLoadingId(null);
    if (selectedShow?._id === id) {
      setSelectedShow((prev) => ({ ...prev, approvalStatus: "rejected" }));
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Approved
          </span>
        );
      case "rejected":
        return (
          <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Rejected
          </span>
        );
      default:
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            Pending
          </span>
        );
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Show Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and approve showtime schedules and pricing submitted by organizers.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaFilm className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Shows</p>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {shows?.length || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* ================= STATUS PILL COUNTERS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "pending" ? "all" : "pending")}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
              filterStatus === "pending"
                ? "bg-amber-50 border-amber-300 ring-2 ring-amber-400/20"
                : "bg-white border-gray-100 hover:border-amber-200"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Review</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "approved" ? "all" : "approved")}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
              filterStatus === "approved"
                ? "bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/20"
                : "bg-white border-gray-100 hover:border-emerald-200"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">Approved Shows</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{approvedCount}</h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </button>

          <button
            type="button"
            onClick={() => setFilterStatus(filterStatus === "rejected" ? "all" : "rejected")}
            className={`p-4 rounded-2xl border text-left transition flex items-center justify-between ${
              filterStatus === "rejected"
                ? "bg-red-50 border-red-300 ring-2 ring-red-400/20"
                : "bg-white border-gray-100 hover:border-red-200"
            }`}
          >
            <div>
              <p className="text-xs font-semibold text-gray-500">Rejected Shows</p>
              <h3 className="text-2xl font-black text-red-600 mt-1">{rejectedCount}</h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-red-400" />
          </button>
        </div>

        {/* ================= SEARCH & FILTER BAR ================= */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search shows by movie title, city, or organizer..."
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

        {/* ================= MAIN 2-COLUMN VIEW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SHOW LIST */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading shows...</p>
              </div>
            ) : filteredShows.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <FaFilm className="text-3xl mx-auto opacity-30" />
                <p className="font-semibold text-gray-700 text-sm">No shows match your filters</p>
                <p className="text-xs text-gray-400">Try clearing filters or changing search keywords.</p>
              </div>
            ) : (
              filteredShows.map((show) => {
                const isSelected = selectedShow?._id === show._id;
                return (
                  <div
                    key={show._id}
                    onClick={() => setSelectedShow(show)}
                    className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600/10 shadow-md"
                        : "border-gray-100 hover:border-purple-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                        {show.content?.poster ? (
                          <img
                            src={show.content.poster}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <FaFilm />
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900 text-base line-clamp-1">
                          {show.content?.title || "Untitled Show"}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <FaMapMarkerAlt className="text-gray-400" />
                            {show.city || "No city"}
                          </span>
                          <span className="flex items-center gap-1">
                            <FaCalendarAlt className="text-gray-400" />
                            {show.showDate
                              ? new Date(show.showDate).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                })
                              : "No date"}
                          </span>
                          {show.startTime && (
                            <span className="flex items-center gap-1">
                              <FaClock className="text-gray-400" />
                              {show.startTime}
                            </span>
                          )}
                          {show.basePrice && (
                            <span className="font-semibold text-purple-700">
                              ₹{show.basePrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {getStatusBadge(show.approvalStatus)}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* SHOW DETAIL DRAWER */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit sticky top-6 shadow-sm">
            {!selectedShow ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <FaFilm className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Select a Show</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Click on any show in the list to inspect full venue details, showtimes, pricing, and issue approvals.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Poster & Title Header */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-22 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 shadow-sm">
                    {selectedShow.content?.poster ? (
                      <img
                        src={selectedShow.content.poster}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FaFilm />
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
                      {selectedShow.content?.title || "Untitled Show"}
                    </h2>
                    <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wider">
                      {selectedShow.contentType || "movie"}
                    </p>
                    <div className="mt-2">{getStatusBadge(selectedShow.approvalStatus)}</div>
                  </div>
                </div>

                {/* Properties table */}
                <div className="space-y-2.5 text-xs border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaMapMarkerAlt /> City
                    </span>
                    <span className="font-semibold text-gray-800">{selectedShow.city || "N/A"}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaCalendarAlt /> Date
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedShow.showDate
                        ? new Date(selectedShow.showDate).toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "No date"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaClock /> Showtime
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedShow.startTime || "N/A"}{" "}
                      {selectedShow.endTime ? `- ${selectedShow.endTime}` : ""}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaRupeeSign /> Base Price
                    </span>
                    <span className="font-bold text-emerald-600">
                      ₹{selectedShow.basePrice || 0}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaBuilding /> Venue / Screen
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedShow.screenId?.name || selectedShow.venue?.name || "Screen Assigned"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Organizer</span>
                    <span className="font-semibold text-purple-700">
                      {selectedShow.organizerId?.name || "System Organizer"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5">
                  {selectedShow.approvalStatus === "pending" && (
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        onClick={() => handleApprove(selectedShow._id)}
                        disabled={loadingId === selectedShow._id}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <FaCheck className="text-xs" />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(selectedShow._id)}
                        disabled={loadingId === selectedShow._id}
                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <FaTimes className="text-xs" />
                        Reject
                      </button>
                    </div>
                  )}

                  <button
                    onClick={() => handleDelete(selectedShow._id)}
                    disabled={loadingId === selectedShow._id}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <FaTrash className="text-xs" />
                    {loadingId === selectedShow._id ? "Processing..." : "Delete Show"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Shows;