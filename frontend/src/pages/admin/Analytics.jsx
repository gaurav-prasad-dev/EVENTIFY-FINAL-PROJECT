import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchAdminStats,
  fetchRevenueTrends,
  fetchTopContent,
} from "../../Features/admin/adminSlice";

const Analytics = () => {
  const dispatch = useDispatch();

  const { stats, revenueTrends, topContent } = useSelector(
    (state) => state.admin
  );

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchRevenueTrends());
    dispatch(fetchTopContent());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-4 gap-4">

          <Card title="Users" value={stats.totalUsers} />
          <Card title="Revenue" value={`₹${stats.totalRevenue}`} />
          <Card title="Bookings" value={stats.totalBookings} />
          <Card title="Shows" value={stats.totalShows} />

        </div>

        {/* ================= REVENUE TREND ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="text-lg font-bold text-purple-700 mb-4">
            Revenue Trends
          </h2>

          {Object.keys(revenueTrends).length === 0 ? (
            <p>No data</p>
          ) : (
            Object.entries(revenueTrends).map(([date, amount]) => (
              <div key={date} className="flex justify-between border-b py-2">
                <span>{date}</span>
                <span className="font-semibold text-green-600">
                  ₹{amount}
                </span>
              </div>
            ))
          )}
        </div>

        {/* ================= TOP CONTENT ================= */}
        <div className="bg-white p-5 rounded-xl shadow border">
          <h2 className="text-lg font-bold text-purple-700 mb-4">
            Top Movies / Events
          </h2>

          {Object.entries(topContent).length === 0 ? (
            <p>No data</p>
          ) : (
            Object.entries(topContent).map(([title, revenue]) => (
              <div key={title} className="flex justify-between border-b py-2">
                <span>{title}</span>
                <span className="text-purple-600 font-semibold">
                  ₹{revenue}
                </span>
              </div>
            ))
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-4 rounded-xl border shadow-sm">
    <p className="text-gray-500 text-sm">{title}</p>
    <h2 className="text-2xl font-bold text-purple-700">
      {value || 0}
    </h2>
  </div>
);

export default Analytics;