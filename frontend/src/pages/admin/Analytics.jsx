import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  fetchAdminStats,
  fetchRevenueTrends,
  fetchTopContent,
} from "../../Features/admin/adminSlice";
import {
  FiBarChart2,
  FiDollarSign,
  FiUsers,
  FiShoppingBag,
  FiFilm,
  FiRefreshCw,
  FiTrendingUp,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

const Analytics = () => {
  const dispatch = useDispatch();
  const { stats = {}, revenueTrends = {}, topContent = {} } = useSelector(
    (state) => state.admin
  );

  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    await Promise.all([
      dispatch(fetchAdminStats()),
      dispatch(fetchRevenueTrends()),
      dispatch(fetchTopContent()),
    ]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Format revenue trends entries sorted by date
  const sortedTrends = useMemo(() => {
    if (!revenueTrends || typeof revenueTrends !== "object") return [];
    return Object.entries(revenueTrends).sort(
      ([a], [b]) => new Date(b).getTime() - new Date(a).getTime()
    );
  }, [revenueTrends]);

  // Max revenue for progress bar scale
  const maxTrendRevenue = useMemo(() => {
    if (sortedTrends.length === 0) return 1;
    return Math.max(...sortedTrends.map(([, amt]) => Number(amt) || 0), 1);
  }, [sortedTrends]);

  // Format top content entries sorted descending by revenue
  const sortedTopContent = useMemo(() => {
    if (!topContent || typeof topContent !== "object") return [];
    return Object.entries(topContent).sort(
      ([, a], [, b]) => (Number(b) || 0) - (Number(a) || 0)
    );
  }, [topContent]);

  const maxContentRevenue = useMemo(() => {
    if (sortedTopContent.length === 0) return 1;
    return Math.max(...sortedTopContent.map(([, rev]) => Number(rev) || 0), 1);
  }, [sortedTopContent]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FiBarChart2 className="text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Analytics & Insights
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Real-time platform performance metrics, revenue trends, and top-grossing events.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition active:scale-95 disabled:opacity-50"
          >
            <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FiDollarSign />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Revenue
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                ₹{(Number(stats.totalRevenue) || 0).toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
              <FiShoppingBag />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Bookings
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalBookings || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <FiUsers />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Users
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalUsers || 0}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              <FiFilm />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Active Shows
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalShows || 0}
              </h3>
            </div>
          </div>
        </div>

        {/* 2-COLUMN ANALYTICS DETAILS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* REVENUE TIMELINE */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiTrendingUp className="text-purple-600 text-lg" />
                <h2 className="text-base font-bold text-gray-900">
                  Daily Revenue Trends
                </h2>
              </div>
              <span className="text-xs font-medium text-gray-400">
                {sortedTrends.length} days recorded
              </span>
            </div>

            {sortedTrends.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <FiCalendar className="mx-auto text-3xl mb-2 opacity-30 text-purple-400" />
                <p className="font-semibold text-gray-600">No revenue data yet</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Completed ticket checkouts will populate the daily trend graph.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {sortedTrends.map(([date, amount]) => {
                  const amtNum = Number(amount) || 0;
                  const percent = Math.min(
                    100,
                    Math.round((amtNum / maxTrendRevenue) * 100)
                  );
                  const formattedDate = new Date(date).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  );

                  return (
                    <div key={date} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-gray-700">
                          {formattedDate}
                        </span>
                        <span className="font-bold text-purple-700">
                          ₹{amtNum.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* TOP MOVIES & EVENTS */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiAward className="text-purple-600 text-lg" />
                <h2 className="text-base font-bold text-gray-900">
                  Top Grossing Content
                </h2>
              </div>
              <span className="text-xs font-medium text-gray-400">
                Ranked by volume
              </span>
            </div>

            {sortedTopContent.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <FiFilm className="mx-auto text-3xl mb-2 opacity-30 text-purple-400" />
                <p className="font-semibold text-gray-600">No content sales recorded</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Top performing movies and events will be ranked here.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5 max-h-96 overflow-y-auto pr-1">
                {sortedTopContent.map(([title, revenue], idx) => {
                  const revNum = Number(revenue) || 0;
                  const percent = Math.min(
                    100,
                    Math.round((revNum / maxContentRevenue) * 100)
                  );

                  return (
                    <div
                      key={title}
                      className="p-3 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-purple-50/30 transition space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              idx === 0
                                ? "bg-amber-100 text-amber-800"
                                : idx === 1
                                ? "bg-gray-200 text-gray-700"
                                : idx === 2
                                ? "bg-amber-50 text-amber-700"
                                : "bg-purple-50 text-purple-700"
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <span className="font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs">
                            {title}
                          </span>
                        </div>
                        <span className="font-extrabold text-purple-700 text-sm">
                          ₹{revNum.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-purple-600 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;