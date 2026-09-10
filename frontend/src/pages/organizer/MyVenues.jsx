import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyVenues } from "../../Features/organizer/organizerSlice";
import apiClient from "../../services/apiClient";
import {
  FaBuilding,
  FaPlus,
  FaSearch,
  FaMapMarkerAlt,
  FaTv,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { IoCloseOutline, IoTvOutline } from "react-icons/io5";

const MyVenues = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { venues = [], loading } = useSelector((state) => state.organizer);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Modal for quick adding screen to a venue
  const [selectedVenueForScreen, setSelectedVenueForScreen] = useState(null);
  const [screenForm, setScreenForm] = useState({
    name: "",
    totalSeats: 60,
    features: ["Premium"],
  });
  const [creatingScreen, setCreatingScreen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyVenues());
  }, [dispatch]);

  // Derived metrics
  const stats = useMemo(() => {
    const list = Array.isArray(venues) ? venues : [];
    const totalVenues = list.length;
    const approvedVenues = list.filter((v) => v.status === "approved").length;
    const pendingVenues = list.filter((v) => v.status === "pending").length;
    const totalScreens = list.reduce(
      (sum, v) => sum + (Array.isArray(v.screens) ? v.screens.length : 0),
      0
    );

    return {
      totalVenues,
      approvedVenues,
      pendingVenues,
      totalScreens,
    };
  }, [venues]);

  // Filtered venues
  const filteredVenues = useMemo(() => {
    const list = Array.isArray(venues) ? venues : [];
    return list.filter((v) => {
      const q = search.toLowerCase().trim();
      const name = (v.name || "").toLowerCase();
      const city = (v.city?.name || v.city || "").toLowerCase();
      const area = (v.area || "").toLowerCase();

      const matchesSearch =
        !q || name.includes(q) || city.includes(q) || area.includes(q);

      const matchesStatus =
        statusFilter === "all" || (v.status || "pending") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [venues, search, statusFilter]);

  // Handle Quick Add Screen
  const handleOpenAddScreen = (venue) => {
    setSelectedVenueForScreen(venue);
    const existingCount = Array.isArray(venue.screens) ? venue.screens.length : 0;
    setScreenForm({
      name: `Screen ${existingCount + 1} - Audi ${existingCount + 1}`,
      totalSeats: 60,
      features: ["Premium"],
    });
  };

  const handleCreateScreen = async (e) => {
    e.preventDefault();
    if (!selectedVenueForScreen || !screenForm.name.trim()) return;

    setCreatingScreen(true);
    try {
      await apiClient.post("/screen/create", {
        name: screenForm.name.trim(),
        venue: selectedVenueForScreen._id,
        totalSeats: Number(screenForm.totalSeats) || 60,
        features: screenForm.features,
      });

      alert("Screen added successfully! 🎉");
      setSelectedVenueForScreen(null);
      dispatch(fetchMyVenues());
    } catch (err) {
      console.error("CREATE SCREEN ERROR:", err);
      alert(err.response?.data?.message || "Failed to create screen");
    } finally {
      setCreatingScreen(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FaBuilding className="text-lg" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                My Venues & Theatres
              </h1>
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Manage your registered cinema halls, attached auditoriums/screens, and verification states.
            </p>
          </div>

          <button
            onClick={() => navigate("/organizer/venues/create")}
            className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2 self-start sm:self-auto"
          >
            <FaPlus className="text-xs" />
            Add Venue
          </button>
        </div>

        {/* ANALYTICS STATS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
              <FaBuilding />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Venues
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalVenues}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FaCheckCircle />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Approved & Active
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.approvedVenues}
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
                {stats.pendingVenues}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <FaTv />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Configured Screens
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalScreens}
              </h3>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTER CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search venue name, city, or area..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {[
              { key: "all", label: "All Venues" },
              { key: "approved", label: "Approved" },
              { key: "pending", label: "Pending Review" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  statusFilter === tab.key
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* VENUES LIST */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
            <div className="w-8 h-8 border-3 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">Loading your venues...</p>
          </div>
        ) : filteredVenues.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-xs">
            <FaBuilding className="mx-auto text-4xl text-purple-300 mb-3" />
            <h3 className="text-base font-bold text-gray-900">No venues found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              You have not registered any venues yet, or none matched your current search filters.
            </p>
            <button
              onClick={() => navigate("/organizer/venues/create")}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
            >
              <FaPlus className="text-xs" />
              Add Venue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVenues.map((venue) => {
              const isApproved = venue.status === "approved";
              const isPending = venue.status === "pending";
              const venueScreens = Array.isArray(venue.screens) ? venue.screens : [];
              const cityName = venue.city?.name || venue.city || "Unknown City";

              return (
                <div
                  key={venue._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 hover:border-purple-200 transition space-y-4"
                >
                  {/* VENUE TOP HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold text-lg shrink-0">
                        <FaBuilding />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-gray-900">
                            {venue.name}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                            {venue.type || "Theatre"}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              isApproved
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : isPending
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isApproved
                                  ? "bg-emerald-500"
                                  : isPending
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            {venue.status?.toUpperCase() || "PENDING"}
                          </span>
                        </div>

                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="text-purple-500 text-[11px] shrink-0" />
                          {venue.street ? `${venue.street}, ` : ""}
                          {venue.area ? `${venue.area}, ` : ""}
                          <span className="font-semibold text-gray-700">{cityName}</span>
                          {venue.pincode ? ` - ${venue.pincode}` : ""}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenAddScreen(venue)}
                      className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition border border-purple-200 shadow-2xs"
                    >
                      <FaPlus className="text-[10px]" />
                      Add Screen
                    </button>
                  </div>

                  {/* ATTACHED SCREENS SECTION */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-gray-700 flex items-center gap-1.5">
                        <FaTv className="text-purple-600 text-xs" />
                        Auditoriums & Screens ({venueScreens.length})
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Ready for movie scheduling
                      </span>
                    </div>

                    {venueScreens.length === 0 ? (
                      <div className="p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                        <span>No screens configured for this venue yet.</span>
                        <button
                          onClick={() => handleOpenAddScreen(venue)}
                          className="font-bold underline hover:text-amber-900"
                        >
                          + Create Screen 1
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {venueScreens.map((screen) => (
                          <div
                            key={screen._id}
                            className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-2"
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800 truncate">
                                {screen.name}
                              </p>
                              <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                                <span className="font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">
                                  {screen.totalSeats || 60} Seats
                                </span>
                                {screen.features?.slice(0, 1).map((f) => (
                                  <span
                                    key={f}
                                    className="bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded"
                                  >
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                              Active
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AMENITIES BADGES */}
                  {Array.isArray(venue.amenities) && venue.amenities.length > 0 && (
                    <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
                      <span className="text-[10px] uppercase font-bold text-gray-400 mr-1">
                        Amenities:
                      </span>
                      {venue.amenities.map((am) => (
                        <span
                          key={am}
                          className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {am}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* QUICK ADD SCREEN MODAL */}
        {selectedVenueForScreen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <IoTvOutline />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Add Screen to {selectedVenueForScreen.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      Configure an auditorium for this cinema hall.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVenueForScreen(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                >
                  <IoCloseOutline className="text-xl" />
                </button>
              </div>

              <form onSubmit={handleCreateScreen} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Screen / Auditorium Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Audi 3 (Dolby Atmos)"
                    value={screenForm.name}
                    onChange={(e) =>
                      setScreenForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Total Seat Capacity *
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="500"
                    value={screenForm.totalSeats}
                    onChange={(e) =>
                      setScreenForm((prev) => ({ ...prev, totalSeats: e.target.value }))
                    }
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Screen Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {["Premium", "Recliner", "Wheelchair"].map((feat) => {
                      const hasFeat = screenForm.features.includes(feat);
                      return (
                        <button
                          key={feat}
                          type="button"
                          onClick={() =>
                            setScreenForm((prev) => ({
                              ...prev,
                              features: hasFeat
                                ? prev.features.filter((f) => f !== feat)
                                : [...prev.features, feat],
                            }))
                          }
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            hasFeat
                              ? "bg-purple-600 text-white font-bold"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {hasFeat ? `✓ ${feat}` : `+ ${feat}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setSelectedVenueForScreen(null)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingScreen}
                    className="px-4 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-xs transition disabled:opacity-50"
                  >
                    {creatingScreen ? "Adding Screen..." : "Add Screen"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyVenues;
