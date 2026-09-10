import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import {
  getAllUsersApi,
  blockUserApi,
  unblockUserApi,
} from "../../Features/admin/adminApi";

import {
  FaUsers,
  FaSearch,
  FaUserCheck,
  FaUserSlash,
  FaShieldAlt,
  FaLock,
  FaUnlock,
} from "react-icons/fa";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [processingId, setProcessingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersApi();
      setUsers(res.data || []);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = u.name || "";
      const email = u.email || "";
      const role = u.role || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        email.toLowerCase().includes(search.toLowerCase()) ||
        role.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [users, search]);

  const activeCount = useMemo(
    () => users.filter((u) => !u.isBlocked).length,
    [users]
  );
  const blockedCount = useMemo(
    () => users.filter((u) => u.isBlocked).length,
    [users]
  );

  const handleBlock = async (id, name) => {
    if (!window.confirm(`Are you sure you want to block ${name || "this user"}?`)) return;
    setProcessingId(id);
    try {
      await blockUserApi(id);
      await fetchUsers();
    } catch (err) {
      alert("Failed to block user");
    } finally {
      setProcessingId(null);
    }
  };

  const handleUnblock = async (id) => {
    setProcessingId(id);
    try {
      await unblockUserApi(id);
      await fetchUsers();
    } catch (err) {
      alert("Failed to unblock user");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              User Directory
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              View all registered platform members, monitor statuses, and manage access restrictions.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaUsers className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Registered Accounts</p>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {users.length}
              </h2>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Users</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{users.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaUsers />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Active Accounts</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaUserCheck />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Restricted / Blocked</p>
              <h3 className="text-2xl font-black text-red-500 mt-1">{blockedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <FaUserSlash />
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search users by name, email, or role..."
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

        {/* CARD TABLE */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 px-6 py-4 bg-gray-50/80 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span className="col-span-5">User</span>
            <span className="col-span-3">Role</span>
            <span className="col-span-2">Status</span>
            <span className="col-span-2 text-right">Actions</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs">Loading user directory...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-gray-400 space-y-2">
              <FaUsers className="text-3xl mx-auto opacity-30" />
              <p className="font-semibold text-gray-700 text-sm">No users found</p>
              <p className="text-xs text-gray-400">No accounts match your search criteria.</p>
            </div>
          ) : (
            filteredUsers.map((u) => {
              const isProcessing = processingId === u._id;
              return (
                <div
                  key={u._id}
                  className="grid grid-cols-12 px-6 py-4 border-b border-gray-100 hover:bg-purple-50/40 transition items-center text-sm"
                >
                  {/* User info */}
                  <div className="col-span-5 flex items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm flex-shrink-0">
                      {u.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <div className="truncate">
                      <h4 className="font-semibold text-gray-900 truncate">{u.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div className="col-span-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${
                        u.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : u.role === "organizer"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {u.role || "User"}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {u.isBlocked ? (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-red-50 text-red-600 border border-red-200 font-bold">
                        Blocked
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex justify-end">
                    {u.isBlocked ? (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleUnblock(u._id)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition flex items-center gap-1.5 shadow-sm"
                      >
                        <FaUnlock className="text-[10px]" />
                        Unblock
                      </button>
                    ) : (
                      <button
                        disabled={isProcessing}
                        onClick={() => handleBlock(u._id, u.name)}
                        className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 transition flex items-center gap-1.5"
                      >
                        <FaLock className="text-[10px]" />
                        Block
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Users;