import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
} from "../../Features/admin/adminSlice";

import {
  FaUserTie,
  FaCheck,
  FaTimes,
  FaSearch,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

const Organizer = () => {
  const dispatch = useDispatch();

  const { pendingOrganizers, stats, loading } = useSelector(
    (state) => state.admin
  );

  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingOrganizers());
  }, [dispatch]);

  const filteredOrganizers = useMemo(() => {
    return (pendingOrganizers || []).filter((org) => {
      const name = org.name || "";
      const email = org.email || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [pendingOrganizers, search]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await dispatch(approveOrganizer(id)).unwrap();
      dispatch(fetchPendingOrganizers());
      if (selected?._id === id) {
        setSelected(null);
      }
    } catch (err) {
      alert(err || "Failed to approve organizer");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this organizer?")) return;
    setProcessingId(id);
    try {
      await dispatch(rejectOrganizer(id)).unwrap();
      dispatch(fetchPendingOrganizers());
      if (selected?._id === id) {
        setSelected(null);
      }
    } catch (err) {
      alert(err || "Failed to reject organizer");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Organizer Verification
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Review and authorize organizer registration requests to permit show scheduling.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaUserTie className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Pending Requests</p>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {pendingOrganizers?.length || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Pending Approvals</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">
                {pendingOrganizers?.length || 0}
              </h3>
            </div>
            <span className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Organizers</p>
              <h3 className="text-2xl font-black text-purple-700 mt-1">
                {stats?.totalOrganizers || 0}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaUserTie />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Verification Engine</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">Active</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaShieldAlt />
            </div>
          </div>
        </div>

        {/* ================= SEARCH BAR ================= */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search organizers by name or email..."
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

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT TABLE */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading organizer requests...</p>
              </div>
            ) : filteredOrganizers.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <FaCheck className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">No Pending Organizers</h3>
                <p className="text-xs text-gray-400">All registered organizers are verified.</p>
              </div>
            ) : (
              filteredOrganizers.map((org) => {
                const isSelected = selected?._id === org._id;
                return (
                  <div
                    key={org._id}
                    onClick={() => setSelected(org)}
                    className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600/10 shadow-md"
                        : "border-gray-100 hover:border-purple-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-base flex-shrink-0">
                        {org.name?.charAt(0)?.toUpperCase() || "O"}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {org.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {org.email} {org.phone && `• ${org.phone}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        Pending
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT DETAILS PANEL */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit sticky top-6 shadow-sm">
            {!selected ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <FaUserTie className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Select an Organizer</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Click on any organizer from the list to review contact credentials and grant authorization.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                    {selected.name}
                  </h2>
                  <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wider">
                    Organizer Applicant
                  </p>
                </div>

                <div className="space-y-2.5 text-xs border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FaEnvelope /> Email
                    </span>
                    <span className="font-semibold text-gray-800">{selected.email}</span>
                  </div>

                  {selected.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 flex items-center gap-1.5">
                        <FaPhone /> Phone
                      </span>
                      <span className="font-semibold text-gray-800">{selected.phone}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Account ID</span>
                    <span className="font-mono text-gray-600 text-[11px]">{selected._id}</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <button
                    onClick={() => handleApprove(selected._id)}
                    disabled={processingId === selected._id}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
                  >
                    <FaCheck className="text-xs" />
                    {processingId === selected._id ? "Processing..." : "Approve Organizer"}
                  </button>

                  <button
                    onClick={() => handleReject(selected._id)}
                    disabled={processingId === selected._id}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <FaTimes className="text-xs" />
                    {processingId === selected._id ? "Processing..." : "Reject Application"}
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

export default Organizer;