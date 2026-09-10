import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StatCard from "../../components/dashboard/StatCard";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  fetchAdminStats,
  fetchPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
} from "../../Features/admin/adminSlice";

import {
  FaUsers,
  FaUserTie,
  FaCity,
  FaFilm,
  FaRupeeSign,
  FaCheck,
  FaTimes,
  FaArrowRight,
  FaShieldAlt,
  FaCalendarCheck,
} from "react-icons/fa";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    stats,
    pendingOrganizers,
    loading,
    error,
  } = useSelector((state) => state.admin);

  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchPendingOrganizers());
  }, [dispatch]);

  const handleApprove = async (id) => {
    setProcessingId(id);
    try {
      await dispatch(approveOrganizer(id)).unwrap();
      dispatch(fetchPendingOrganizers());
      dispatch(fetchAdminStats());
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
      dispatch(fetchAdminStats());
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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
              Admin Control Center
              <span className="bg-purple-100 text-purple-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
                Superadmin
              </span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Real-time platform metrics, organizer approvals, and catalog health.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/content")}
              className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-sm transition flex items-center gap-2"
            >
              <FaFilm className="text-xs" />
              Manage Content
            </button>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            change="+12% from last month"
            isPositive={true}
            icon={FaUsers}
          />

          <StatCard
            title="Total Organizers"
            value={stats?.totalOrganizers || 0}
            change={`${pendingOrganizers?.length || 0} pending review`}
            isPositive={false}
            icon={FaUserTie}
          />

          <StatCard
            title="Active Cities"
            value={stats?.totalCities || 0}
            change="Across India"
            isPositive={true}
            icon={FaCity}
          />

          <StatCard
            title="Total Shows"
            value={stats?.totalShows || 0}
            change="Live & Upcoming"
            isPositive={true}
            icon={FaCalendarCheck}
          />
        </div>

        {/* ================= REVENUE HIGHLIGHT BANNER ================= */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2 text-purple-200 text-sm font-medium">
              <FaRupeeSign />
              <span>Platform Gross Revenue</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              ₹ {Number(stats?.totalRevenue || 0).toLocaleString("en-IN")}
            </h2>
            <p className="text-purple-200 text-xs max-w-md">
              Total transaction volume processed across all active organizer movie screenings & live events.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/admin/shows")}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-3 rounded-2xl text-sm font-semibold transition flex items-center gap-2"
            >
              Review Shows
              <FaArrowRight className="text-xs" />
            </button>
            <button
              onClick={() => navigate("/admin/venues")}
              className="bg-white text-purple-900 hover:bg-purple-50 px-5 py-3 rounded-2xl text-sm font-bold shadow transition flex items-center gap-2"
            >
              Review Venues
              <FaArrowRight className="text-xs" />
            </button>
          </div>

          {/* Subtle Background Glow */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* ================= PENDING ORGANIZERS SECTION ================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <FaShieldAlt className="text-lg" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Organizer Verification Queue
                </h2>
                <p className="text-xs text-gray-500">
                  Review organizer applications before they can create public shows.
                </p>
              </div>
            </div>

            <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1 rounded-full">
              {pendingOrganizers?.length || 0} Pending
            </span>
          </div>

          {loading && (
            <div className="py-12 text-center text-gray-400 space-y-3">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading organizer requests...</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 text-sm rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {!loading && pendingOrganizers?.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <FaCheck className="text-xl" />
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">All caught up!</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                There are no pending organizer requests waiting for admin approval.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {pendingOrganizers?.map((org) => {
              const isProcessing = processingId === org._id;
              return (
                <div
                  key={org._id}
                  className="border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-purple-200 hover:shadow-sm transition"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-base">
                      {org.name?.charAt(0)?.toUpperCase() || "O"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm">
                        {org.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {org.email} {org.phone && `• ${org.phone}`}
                      </p>
                      <span className="inline-block mt-1 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        Pending Verification
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      disabled={isProcessing}
                      onClick={() => handleApprove(org._id)}
                      className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <FaCheck className="text-xs" />
                      Approve
                    </button>

                    <button
                      disabled={isProcessing}
                      onClick={() => handleReject(org._id)}
                      className="flex-1 sm:flex-initial bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 text-xs font-semibold px-4 py-2.5 rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <FaTimes className="text-xs" />
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= QUICK LINK SHORTCUTS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/admin/shows")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group"
          >
            <span className="text-2xl mb-2 block">🎬</span>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition">
              Shows Review
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Approve organizer showtimes</p>
          </button>

          <button
            onClick={() => navigate("/admin/venues")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group"
          >
            <span className="text-2xl mb-2 block">🏢</span>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition">
              Venues
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Verify theatre locations</p>
          </button>

          <button
            onClick={() => navigate("/admin/cities")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group"
          >
            <span className="text-2xl mb-2 block">📍</span>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition">
              Cities
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Manage supported regions</p>
          </button>

          <button
            onClick={() => navigate("/admin/users")}
            className="bg-white border border-gray-100 rounded-2xl p-4 text-left shadow-sm hover:shadow-md hover:border-purple-200 transition group"
          >
            <span className="text-2xl mb-2 block">👥</span>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-purple-600 transition">
              User Directory
            </h4>
            <p className="text-xs text-gray-400 mt-0.5">Manage accounts & permissions</p>
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;