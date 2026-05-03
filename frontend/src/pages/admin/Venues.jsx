import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPendingVenues,
  approveVenue,
  rejectVenue,
} from "../../Features/admin/adminSlice";

const Venues = () => {
  const dispatch = useDispatch();

  const { pendingVenues } = useSelector(
    (state) => state.admin
  );

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingVenues());
  }, [dispatch]);

  // ================= APPROVE =================
  const handleApprove = async (id) => {
    setLoadingId(id);
    await dispatch(approveVenue(id));
    setLoadingId(null);

    if (selectedVenue?._id === id) {
      setSelectedVenue(null);
    }
  };

  // ================= REJECT =================
  const handleReject = async (id) => {
    setLoadingId(id);
    await dispatch(rejectVenue(id));
    setLoadingId(null);

    if (selectedVenue?._id === id) {
      setSelectedVenue(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-700">
            Venue Management
          </h1>

          <p className="text-gray-500 text-sm">
            Approve or reject venue submissions from organizers
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Pending Venues
            </p>
            <h2 className="text-2xl font-bold text-purple-700">
              {pendingVenues?.length || 0}
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              System Status
            </p>
            <h2 className="text-xl font-bold text-green-600">
              Active
            </h2>
          </div>

          <div className="bg-white p-4 rounded-xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Review Queue
            </p>
            <h2 className="text-xl font-bold text-purple-600">
              Fast Processing
            </h2>
          </div>

        </div>

        {/* ================= CONTENT ================= */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT LIST */}
          <div className="col-span-2 bg-white border rounded-2xl overflow-hidden">

            {/* HEADER */}
            <div className="bg-purple-600 text-white p-4 font-semibold">
              Pending Venues
            </div>

            {/* EMPTY STATE */}
            {pendingVenues?.length === 0 ? (
              <p className="p-6 text-gray-500">
                No pending venues 🎉
              </p>
            ) : (
              pendingVenues?.map((venue) => (
                <div
                  key={venue._id}
                  onClick={() => setSelectedVenue(venue)}
                  className={`p-4 border-b cursor-pointer flex justify-between items-center transition ${
                    selectedVenue?._id === venue._id
                      ? "bg-purple-50"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {venue.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      📍 {venue.city?.name || venue.city} • Capacity:{" "}
                      {venue.capacity || "N/A"}
                    </p>
                  </div>

                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                    Pending
                  </span>
                </div>
              ))
            )}
          </div>

          {/* RIGHT DETAILS */}
          <div className="bg-white border rounded-2xl p-5 h-fit sticky top-6">

            {!selectedVenue ? (
              <p className="text-gray-500 text-sm">
                Click a venue to view details
              </p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-purple-700">
                  {selectedVenue.name}
                </h2>

                <div className="mt-3 space-y-2 text-sm text-gray-600">

                  <p>
                    📍 {selectedVenue.city?.name || selectedVenue.city}
                  </p>

                  <p>
                    🪑 Capacity: {selectedVenue.capacity || "N/A"}
                  </p>

                  <p>
                    🏷 Type: {selectedVenue.type || "N/A"}
                  </p>

                  <p className="text-xs text-gray-400">
                    ID: {selectedVenue._id}
                  </p>

                </div>

                {/* ACTIONS */}
                <div className="mt-6 space-y-2">

                  <button
                    onClick={() =>
                      handleApprove(selectedVenue._id)
                    }
                    disabled={loadingId === selectedVenue._id}
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {loadingId === selectedVenue._id
                      ? "Processing..."
                      : "Approve Venue"}
                  </button>

                  <button
                    onClick={() =>
                      handleReject(selectedVenue._id)
                    }
                    disabled={loadingId === selectedVenue._id}
                    className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {loadingId === selectedVenue._id
                      ? "Processing..."
                      : "Reject Venue"}
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

export default Venues;