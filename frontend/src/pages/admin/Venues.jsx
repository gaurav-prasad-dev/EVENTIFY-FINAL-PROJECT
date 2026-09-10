import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPendingVenues,
  fetchAllVenues,
  approveVenue,
  rejectVenue,
} from "../../Features/admin/adminSlice";

import {
  FaBuilding,
  FaMapMarkerAlt,
  FaCheck,
  FaTimes,
  FaSearch,
  FaShieldAlt,
  FaChair,
  FaTv,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

const Venues = () => {
  const dispatch = useDispatch();

  const { pendingVenues = [], venues: allVenues = [], loading } = useSelector(
    (state) => state.admin
  );

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [statusTab, setStatusTab] = useState("pending"); // "pending" | "approved" | "all" | "rejected"

  const loadData = () => {
    dispatch(fetchPendingVenues());
    dispatch(fetchAllVenues());
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Derived counts
  const approvedCount = useMemo(
    () => (allVenues || []).filter((v) => v.status === "approved").length,
    [allVenues]
  );
  const pendingCount = useMemo(
    () => (pendingVenues || []).length,
    [pendingVenues]
  );
  const totalCount = useMemo(
    () => (allVenues || []).length,
    [allVenues]
  );

  const displayedList = useMemo(() => {
    let source = [];
    if (statusTab === "pending") {
      source = pendingVenues && pendingVenues.length > 0
        ? pendingVenues
        : (allVenues || []).filter((v) => v.status === "pending");
    } else if (statusTab === "approved") {
      source = (allVenues || []).filter((v) => v.status === "approved");
    } else if (statusTab === "rejected") {
      source = (allVenues || []).filter((v) => v.status === "rejected");
    } else {
      source = allVenues || [];
    }

    const q = search.toLowerCase().trim();
    if (!q) return source;

    return source.filter((v) => {
      const name = (v.name || "").toLowerCase();
      const city = (v.city?.name || v.city || "").toLowerCase();
      const area = (v.area || "").toLowerCase();
      const creator = (v.createdBy?.name || v.createdBy?.email || "").toLowerCase();
      return (
        name.includes(q) ||
        city.includes(q) ||
        area.includes(q) ||
        creator.includes(q)
      );
    });
  }, [allVenues, pendingVenues, statusTab, search]);

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    setLoadingId(id);
    await dispatch(approveVenue(id));
    await dispatch(fetchPendingVenues());
    await dispatch(fetchAllVenues());
    setLoadingId(null);
    if (selectedVenue?._id === id) {
      setSelectedVenue((prev) => (prev ? { ...prev, status: "approved" } : null));
    }
  };

  // ================= REJECT =================
  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this venue?")) return;
    setLoadingId(id);
    await dispatch(rejectVenue(id));
    await dispatch(fetchPendingVenues());
    await dispatch(fetchAllVenues());
    setLoadingId(null);
    if (selectedVenue?._id === id) {
      setSelectedVenue((prev) => (prev ? { ...prev, status: "rejected" } : null));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ================= HEADER STATS ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Venue Management & Verification
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Verify pending cinema submissions, inspect provisioned auditoriums, and manage approved venues.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white border border-gray-100 shadow-xs rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FaBuilding className="text-base" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Total Venues</p>
                <h2 className="text-lg font-extrabold text-gray-900 leading-tight">
                  {totalCount}
                </h2>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-xs rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FaCheckCircle className="text-base" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Approved</p>
                <h2 className="text-lg font-extrabold text-emerald-700 leading-tight">
                  {approvedCount}
                </h2>
              </div>
            </div>

            <div className="bg-white border border-gray-100 shadow-xs rounded-2xl px-4 py-2.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <FaClock className="text-base" />
              </div>
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Pending</p>
                <h2 className="text-lg font-extrabold text-amber-700 leading-tight">
                  {pendingCount}
                </h2>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SEARCH & TABS ================= */}
        <div className="space-y-3">
          <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-xs">
            <FaSearch className="text-gray-400 ml-3" />
            <input
              type="text"
              placeholder="Search venues by name, city, locality, or organizer email..."
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
            {[
              { key: "pending", label: "Pending Review", count: pendingCount },
              { key: "approved", label: "Approved Venues", count: approvedCount },
              { key: "all", label: "All Venues", count: totalCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setStatusTab(tab.key);
                  setSelectedVenue(null);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                  statusTab === tab.key
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-white text-gray-600 border border-gray-100 hover:bg-gray-50"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    statusTab === tab.key
                      ? "bg-purple-700 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* VENUES LIST */}
          <div className="lg:col-span-2 space-y-3">
            {displayedList.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2 shadow-xs">
                <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                  <FaBuilding className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">
                  {statusTab === "pending"
                    ? "No Pending Venues"
                    : statusTab === "approved"
                    ? "No Approved Venues Found"
                    : "No Venues Found"}
                </h3>
                <p className="text-xs text-gray-400">
                  {statusTab === "pending"
                    ? "All submitted venues have been approved or reviewed."
                    : "Adjust your search criteria or view other tabs."}
                </p>
              </div>
            ) : (
              displayedList.map((venue) => {
                const isSelected = selectedVenue?._id === venue._id;
                const isApproved = venue.status === "approved";
                const isPending = venue.status === "pending";
                const screensList = venue.screens || [];

                return (
                  <div
                    key={venue._id}
                    onClick={() => setSelectedVenue(venue)}
                    className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600/10 shadow-md"
                        : "border-gray-100 hover:border-purple-200 hover:shadow-xs"
                    }`}
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-base truncate">
                          {venue.name}
                        </h3>
                        <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {venue.type || "Theatre"}
                        </span>
                        {screensList.length > 0 && (
                          <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <FaTv className="text-[9px]" /> {screensList.length} Audi(s)
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <FaMapMarkerAlt className="text-gray-400 shrink-0" />
                        <span>{venue.city?.name || venue.city}</span>
                        {venue.area && <span>• {venue.area}</span>}
                      </p>

                      {venue.createdBy && (
                        <p className="text-[11px] text-gray-400">
                          Submitted by: <span className="font-medium text-gray-600">{venue.createdBy.name || venue.createdBy.email}</span>
                        </p>
                      )}

                      {venue.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {venue.amenities.slice(0, 4).map((a, i) => (
                            <span
                              key={i}
                              className="bg-gray-50 text-gray-600 border border-gray-100 text-[10px] font-medium px-2 py-0.5 rounded-md"
                            >
                              {a}
                            </span>
                          ))}
                          {venue.amenities.length > 4 && (
                            <span className="text-[10px] text-gray-400 self-center">
                              +{venue.amenities.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0">
                      {isApproved ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                          <FaCheckCircle className="text-xs" /> Approved
                        </span>
                      ) : isPending ? (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                          <FaClock className="text-xs" /> Pending
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                          <FaTimes className="text-xs" /> {venue.status}
                        </span>
                      )}

                      <span className="text-[11px] text-purple-600 font-semibold hover:underline">
                        View details →
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DETAIL DRAWER */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit sticky top-6 shadow-xs">
            {!selectedVenue ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <FaBuilding className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Select a Venue</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Choose any venue from the list to review location details, inspect provisioned auditoriums, and manage verification.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                      {selectedVenue.name}
                    </h2>
                    {selectedVenue.status === "approved" ? (
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Approved
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                        Pending
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wider">
                    {selectedVenue.type || "Theatre"}
                  </p>
                </div>

                <div className="space-y-2.5 text-xs border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaMapMarkerAlt /> City
                    </span>
                    <span className="font-semibold text-gray-800">
                      {selectedVenue.city?.name || selectedVenue.city}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Street / Area</span>
                    <span className="font-semibold text-gray-800 text-right">
                      {selectedVenue.street || selectedVenue.area || "N/A"}
                    </span>
                  </div>

                  {selectedVenue.pincode && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Pincode</span>
                      <span className="font-semibold text-gray-800">
                        {selectedVenue.pincode}
                      </span>
                    </div>
                  )}

                  {selectedVenue.createdBy && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Organizer</span>
                      <span className="font-semibold text-gray-800 truncate max-w-[160px]">
                        {selectedVenue.createdBy.name || selectedVenue.createdBy.email}
                      </span>
                    </div>
                  )}
                </div>

                {/* ATTACHED SCREENS */}
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <FaTv className="text-purple-600" />
                    Auditoriums / Screens ({selectedVenue.screens?.length || 0})
                  </h4>

                  {(!selectedVenue.screens || selectedVenue.screens.length === 0) ? (
                    <p className="text-xs text-gray-400 italic">No screens provisioned yet.</p>
                  ) : (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {selectedVenue.screens.map((screen, idx) => (
                        <div
                          key={screen._id || idx}
                          className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 text-xs space-y-1"
                        >
                          <div className="flex justify-between items-center font-bold text-gray-800">
                            <span>{screen.name}</span>
                            <span className="text-purple-600 font-semibold">{screen.totalSeats || 60} Seats</span>
                          </div>
                          {screen.features?.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {screen.features.map((feat, fi) => (
                                <span
                                  key={fi}
                                  className="bg-white border border-gray-200 text-gray-600 text-[10px] px-1.5 py-0.5 rounded font-medium"
                                >
                                  {feat}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ACTIONS */}
                <div className="space-y-2.5 pt-2">
                  {selectedVenue.status === "approved" ? (
                    <div className="space-y-2">
                      <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-medium">
                        <FaCheckCircle className="text-emerald-600 shrink-0 text-sm" />
                        <span>This venue is approved and available for scheduling shows.</span>
                      </div>
                      <button
                        onClick={() => handleReject(selectedVenue._id)}
                        disabled={loadingId === selectedVenue._id}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2 rounded-xl font-semibold text-xs transition"
                      >
                        {loadingId === selectedVenue._id ? "Processing..." : "Revoke / Reject Venue"}
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleApprove(selectedVenue._id)}
                        disabled={loadingId === selectedVenue._id}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-xs"
                      >
                        <FaCheck className="text-xs" />
                        {loadingId === selectedVenue._id ? "Processing..." : "Approve Venue"}
                      </button>

                      <button
                        onClick={() => handleReject(selectedVenue._id)}
                        disabled={loadingId === selectedVenue._id}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                      >
                        <FaTimes className="text-xs" />
                        {loadingId === selectedVenue._id ? "Processing..." : "Reject Venue"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Venues;