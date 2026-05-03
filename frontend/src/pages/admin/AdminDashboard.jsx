import DashboardLayout from "../../components/dashboard/DashboardLayout";

import StatCard from "../../components/dashboard/StatCard";

import { useEffect } from "react";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  fetchAdminStats,
  fetchPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
} from "../../Features/admin/adminSlice";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const {
    stats,
    pendingOrganizers,
    loading,
    error,
  } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAdminStats());

    dispatch(
      fetchPendingOrganizers()
    );
  }, [dispatch]);

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold mb-8">
        Admin Dashboard
      </h1>

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Users"
          value={stats?.totalUsers || 0}
        />

        <StatCard
          title="Organizers"
          value={
            stats?.totalOrganizers || 0
          }
        />

        <StatCard
          title="Cities"
          value={stats?.totalCities || 0}
        />

        <StatCard
          title="Shows"
          value={stats?.totalShows || 0}
        />
      </div>

      {/* ================= REVENUE ================= */}

      <div className="bg-white p-6 rounded-2xl border mb-8">
        <h2 className="text-xl font-semibold mb-3">
          Total Revenue
        </h2>

        <p className="text-4xl font-bold text-purple-600">
          ₹ {stats?.totalRevenue || 0}
        </p>
      </div>

      {/* ================= ORGANIZERS ================= */}

      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="text-xl font-semibold mb-5">
          Pending Organizers
        </h2>

        {loading && (
          <p>Loading...</p>
        )}

        {error && (
          <p className="text-red-500">
            {error}
          </p>
        )}

        {!loading &&
          pendingOrganizers?.length === 0 && (
            <p className="text-gray-500">
              No pending organizers
            </p>
          )}

        {pendingOrganizers?.map((org) => (
          <div
            key={org._id}
            className="border rounded-xl p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <h3 className="font-semibold">
                {org.name}
              </h3>

              <p className="text-sm text-gray-500">
                {org.email}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() =>
                  dispatch(
                    approveOrganizer(org._id)
                  )
                }
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Approve
              </button>

              <button
                onClick={() =>
                  dispatch(
                    rejectOrganizer(org._id)
                  )
                }
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;