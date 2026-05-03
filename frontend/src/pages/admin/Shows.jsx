import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchShows,
  deleteShow,
  approveShow,
  rejectShow,
} from "../../Features/admin/adminSlice";

import {
  FaCheck,
  FaTimes,
  FaTrash,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

const Shows = () => {
  const dispatch = useDispatch();

  const { shows, loading } = useSelector(
    (state) => state.admin
  );

  const [selectedShow, setSelectedShow] =
    useState(null);

  const [loadingId, setLoadingId] =
    useState(null);

  useEffect(() => {
    dispatch(fetchShows());
  }, [dispatch]);

  // ======================================================
  // DELETE
  // ======================================================

  const handleDelete = async (id) => {
    setLoadingId(id);

    await dispatch(deleteShow(id));

    setLoadingId(null);

    if (selectedShow?._id === id) {
      setSelectedShow(null);
    }
  };

  // ======================================================
  // APPROVE
  // ======================================================

  const handleApprove = async (id) => {
    setLoadingId(id);

    await dispatch(approveShow(id));

    await dispatch(fetchShows());

    setLoadingId(null);
  };

  // ======================================================
  // REJECT
  // ======================================================

  const handleReject = async (id) => {
    setLoadingId(id);

    await dispatch(rejectShow(id));

    await dispatch(fetchShows());

    setLoadingId(null);
  };

  // ======================================================
  // STATUS COLOR
  // ======================================================

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";

      case "rejected":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">

        {/* ====================================================== */}
        {/* HEADER */}
        {/* ====================================================== */}

        <div className="mb-6 flex items-center justify-between">

          <div>
            <h1 className="text-3xl font-bold text-purple-700">
              Show Management
            </h1>

            <p className="text-gray-500 mt-1">
              Admin can approve, reject and manage shows
            </p>
          </div>

          <div className="bg-white border shadow-sm rounded-2xl px-5 py-4">
            <p className="text-sm text-gray-500">
              Total Shows
            </p>

            <h2 className="text-3xl font-bold text-purple-700">
              {shows?.length || 0}
            </h2>
          </div>
        </div>

        {/* ====================================================== */}
        {/* STATS */}
        {/* ====================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Pending
            </p>

            <h2 className="text-2xl font-bold text-yellow-600">
              {
                shows?.filter(
                  (s) =>
                    s.approvalStatus === "pending"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Approved
            </p>

            <h2 className="text-2xl font-bold text-green-600">
              {
                shows?.filter(
                  (s) =>
                    s.approvalStatus === "approved"
                ).length
              }
            </h2>
          </div>

          <div className="bg-white p-5 rounded-2xl border shadow-sm">
            <p className="text-gray-500 text-sm">
              Rejected
            </p>

            <h2 className="text-2xl font-bold text-red-600">
              {
                shows?.filter(
                  (s) =>
                    s.approvalStatus === "rejected"
                ).length
              }
            </h2>
          </div>

        </div>

        {/* ====================================================== */}
        {/* MAIN LAYOUT */}
        {/* ====================================================== */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ====================================================== */}
          {/* SHOW LIST */}
          {/* ====================================================== */}

          <div className="lg:col-span-2 bg-white border rounded-3xl overflow-hidden shadow-sm">

            <div className="bg-purple-600 text-white px-5 py-4 font-semibold text-lg">
              All Shows
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">
                Loading shows...
              </div>
            ) : shows?.length === 0 ? (
              <div className="p-10 text-center text-gray-500">
                No shows found
              </div>
            ) : (
              <div>

                {shows.map((show) => (
                  <div
                    key={show._id}
                    onClick={() =>
                      setSelectedShow(show)
                    }
                    className={`p-5 border-b cursor-pointer transition hover:bg-purple-50 ${
                      selectedShow?._id ===
                      show._id
                        ? "bg-purple-50"
                        : ""
                    }`}
                  >

                    <div className="flex items-center justify-between">

                      <div>

                        <h3 className="font-bold text-gray-800 text-lg">
                          {show?.content?.title ||
                            "Untitled Show"}
                        </h3>

                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">

                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            {show.city || "No city"}
                          </div>

                          <div className="flex items-center gap-1">
                            <FaClock />
                            {show.showDate
                              ? new Date(
                                  show.showDate
                                ).toDateString()
                              : "No date"}
                          </div>

                        </div>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(
                          show.approvalStatus
                        )}`}
                      >
                        {show.approvalStatus}
                      </span>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ====================================================== */}
          {/* SHOW DETAILS */}
          {/* ====================================================== */}

          <div className="bg-white border rounded-3xl p-6 h-fit sticky top-6 shadow-sm">

            {!selectedShow ? (
              <div className="text-center text-gray-500 py-10">
                Select a show to view details
              </div>
            ) : (
              <div className="space-y-5">

                {/* TITLE */}

                <div>
                  <h2 className="text-2xl font-bold text-purple-700">
                    {selectedShow?.content?.title ||
                      "Untitled Show"}
                  </h2>

                  <p className="text-gray-500 mt-1 capitalize">
                    {selectedShow.contentType}
                  </p>
                </div>

                {/* DETAILS */}

                <div className="space-y-3 text-sm">

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      City
                    </span>

                    <span className="font-medium">
                      {selectedShow.city}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Approval
                    </span>

                    <span className="font-medium capitalize">
                      {
                        selectedShow.approvalStatus
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Published
                    </span>

                    <span className="font-medium capitalize">
                      {
                        selectedShow.publishedStatus
                      }
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500">
                      Organizer
                    </span>

                    <span className="font-medium">
                      {selectedShow?.organizerId
                        ?.name || "Unknown"}
                    </span>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className="space-y-3 pt-4">

                  {selectedShow.approvalStatus ===
                    "pending" && (
                    <div className="grid grid-cols-2 gap-3">

                      <button
                        onClick={() =>
                          handleApprove(
                            selectedShow._id
                          )
                        }
                        disabled={
                          loadingId ===
                          selectedShow._id
                        }
                        className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <FaCheck />
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          handleReject(
                            selectedShow._id
                          )
                        }
                        disabled={
                          loadingId ===
                          selectedShow._id
                        }
                        className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                      >
                        <FaTimes />
                        Reject
                      </button>

                    </div>
                  )}

                  <button
                    onClick={() =>
                      handleDelete(
                        selectedShow._id
                      )
                    }
                    disabled={
                      loadingId ===
                      selectedShow._id
                    }
                    className="w-full bg-red-100 hover:bg-red-200 text-red-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <FaTrash />

                    {loadingId ===
                    selectedShow._id
                      ? "Processing..."
                      : "Delete Show"}
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

export default Shows;