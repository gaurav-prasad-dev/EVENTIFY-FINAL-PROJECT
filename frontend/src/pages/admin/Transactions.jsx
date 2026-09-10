import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { fetchTransactions } from "../../Features/admin/adminSlice";
import {
  FiCreditCard,
  FiSearch,
  FiTrendingUp,
  FiCheckCircle,
  FiRefreshCw,
  FiCalendar,
  FiUser,
  FiHash,
} from "react-icons/fi";

const Transactions = () => {
  const dispatch = useDispatch();
  const { transactions = [] } = useSelector((state) => state.admin);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    await dispatch(fetchTransactions());
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [dispatch]);

  // Derived statistics
  const stats = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    const totalVolume = list.reduce(
      (sum, item) => sum + (Number(item?.totalAmount) || 0),
      0
    );
    const successCount = list.filter(
      (item) => item?.paymentStatus === "Success"
    ).length;
    const avgOrder = list.length > 0 ? Math.round(totalVolume / list.length) : 0;

    return {
      totalTransactions: list.length,
      totalVolume,
      successCount,
      avgOrder,
    };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    const list = Array.isArray(transactions) ? transactions : [];
    return list.filter((item) => {
      const q = search.toLowerCase().trim();
      const userName = (item?.user?.name || "").toLowerCase();
      const userEmail = (item?.user?.email || "").toLowerCase();
      const bookingId = (item?._id || item?.bookingId || "").toLowerCase();
      const paymentId = (item?.paymentId || "").toLowerCase();

      const matchesSearch =
        !q ||
        userName.includes(q) ||
        userEmail.includes(q) ||
        bookingId.includes(q) ||
        paymentId.includes(q);

      const itemStatus = item?.paymentStatus || "Success";
      const matchesStatus =
        statusFilter === "all" ||
        itemStatus.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [transactions, search, statusFilter]);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <FiCreditCard className="text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Transactions & Revenue
              </h1>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Audit ticket purchase transactions, processed revenues, and customer settlements.
            </p>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-xs transition active:scale-95 disabled:opacity-50"
          >
            <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shrink-0">
              <FiTrendingUp />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Volume
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                ₹{stats.totalVolume.toLocaleString()}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl shrink-0">
              <FiCheckCircle />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Count
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.successCount}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl shrink-0">
              <FiCreditCard />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Order
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                ₹{stats.avgOrder}
              </h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shrink-0">
              <FiHash />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                All Transactions
              </p>
              <h3 className="text-2xl font-extrabold text-gray-900 mt-0.5">
                {stats.totalTransactions}
              </h3>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search user, email, booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {["all", "Success", "Refunded"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition ${
                  statusFilter === s
                    ? "bg-purple-600 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s === "all" ? "All Statuses" : s}
              </button>
            ))}
          </div>
        </div>

        {/* TRANSACTIONS TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Transaction / Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <FiCreditCard className="mx-auto text-3xl mb-2 opacity-40 text-purple-400" />
                      <p className="font-semibold text-gray-600">No transactions found</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Transactions will automatically appear as customers complete checkout.
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => {
                    const status = tx?.paymentStatus || "Success";
                    const isSuccess = status === "Success";
                    const formattedDate = tx?.createdAt
                      ? new Date(tx.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "—";

                    return (
                      <tr key={tx?._id} className="hover:bg-purple-50/30 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-purple-700 text-xs">
                          {tx?._id?.slice(-8) || "N/A"}
                          {tx?.paymentId && (
                            <span className="block text-[10px] text-gray-400 font-normal font-sans">
                              {tx.paymentId}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0">
                              {(tx?.user?.name || tx?.user?.email || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate">
                                {tx?.user?.name || "Customer"}
                              </p>
                              <p className="text-[11px] text-gray-400 truncate">
                                {tx?.user?.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-gray-900 text-sm">
                            ₹{(Number(tx?.totalAmount) || 0).toLocaleString()}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-gray-500 flex items-center gap-1.5 pt-4">
                          <FiCalendar className="text-gray-400 text-xs" />
                          <span>{formattedDate}</span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isSuccess
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isSuccess ? "bg-emerald-500" : "bg-amber-500"
                              }`}
                            />
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;