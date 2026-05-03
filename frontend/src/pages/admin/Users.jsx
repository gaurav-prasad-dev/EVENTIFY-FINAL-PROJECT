import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import {
  getAllUsersApi,
  blockUserApi,
  unblockUserApi,
} from "../../Features/admin/adminApi";

function Users() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsersApi();
      setUsers(res.data || []);
    } catch (err) {
      console.log("FETCH USERS ERROR:", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlock = async (id) => {
    await blockUserApi(id);
    fetchUsers();
  };

  const handleUnblock = async (id) => {
    await unblockUserApi(id);
    fetchUsers();
  };

  return (
    <DashboardLayout>
      <div className="p-6">
        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-700">
            Users Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all registered users
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden">
          {/* TABLE HEADER */}
          <div className="bg-purple-600 text-white grid grid-cols-4 p-4 font-semibold">
            <span>Name</span>
            <span>Email</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {/* TABLE BODY */}
          {users.map((u) => (
            <div
              key={u._id}
              className="grid grid-cols-4 p-4 border-b hover:bg-purple-50 transition"
            >
              <span className="font-medium">{u.name}</span>
              <span className="text-gray-600">{u.email}</span>

              <span>
                {u.isBlocked ? (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">
                    Blocked
                  </span>
                ) : (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">
                    Active
                  </span>
                )}
              </span>

              <span>
                {u.isBlocked ? (
                  <button
                    onClick={() => handleUnblock(u._id)}
                    className="px-3 py-1 text-sm rounded-lg bg-green-500 text-white hover:bg-green-600"
                  >
                    Unblock
                  </button>
                ) : (
                  <button
                    onClick={() => handleBlock(u._id)}
                    className="px-3 py-1 rounded-lg text-white bg-purple-500 hover:bg-purple-600"
                  >
                    Block
                  </button>
                )}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Users;