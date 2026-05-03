import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPendingOrganizers,
  approveOrganizer,
  rejectOrganizer,
} from "../../Features/admin/adminSlice";

const Organizer = () => {
  const dispatch = useDispatch();

  const { pendingOrganizers, stats } = useSelector(
    (state) => state.admin
  );

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingOrganizers());
  }, [dispatch]);

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-700">
            Organizer Management
          </h1>
          <p className="text-gray-500 text-sm">
            Approve or reject new organizers
          </p>
        </div>

        {/* ================= STATS CARDS ================= */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Pending Requests
            </p>
            <h2 className="text-2xl font-bold text-purple-700">
              {pendingOrganizers?.length || 0}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Total Users
            </p>
            <h2 className="text-2xl font-bold">
              {stats?.totalUsers || 0}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Active System Load
            </p>
            <h2 className="text-2xl font-bold text-green-600">
              Stable
            </h2>
          </div>

        </div>

        {/* ================= MAIN CONTENT ================= */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT TABLE */}
          <div className="col-span-2 bg-white border rounded-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-purple-600 text-white p-4 font-semibold">
              Pending Organizers
            </div>

            {/* LIST */}
            {pendingOrganizers.length === 0 ? (
              <p className="p-4 text-gray-500">
                No pending organizers
              </p>
            ) : (
              pendingOrganizers.map((org) => (
                <div
                  key={org._id}
                  onClick={() => setSelected(org)}
                  className="flex justify-between items-center p-4 border-b hover:bg-purple-50 cursor-pointer"
                >
                  <div>
                    <h3 className="font-semibold">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {org.email}
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>

          {/* RIGHT DETAILS PANEL */}
          <div className="bg-white border rounded-2xl p-5 h-fit sticky top-6">

            {!selected ? (
              <p className="text-gray-500 text-sm">
                Click on an organizer to view details
              </p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-purple-700 mb-2">
                  {selected.name}
                </h2>

                <p className="text-gray-600 mb-1">
                  {selected.email}
                </p>

                <p className="text-sm text-gray-400 mb-4">
                  ID: {selected._id}
                </p>

                <div className="flex flex-col gap-2">

                  <button
                    onClick={() =>
                      dispatch(approveOrganizer(selected._id))
                    }
                    className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      dispatch(rejectOrganizer(selected._id))
                    }
                    className="bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                  >
                    Reject
                  </button>

                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

export default Organizer;