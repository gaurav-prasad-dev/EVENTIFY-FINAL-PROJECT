import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchMyShows,
  deleteShow,
  publishShow,
} from "../../Features/organizer/organizerSlice";

import { useNavigate } from "react-router-dom";

const MyShows = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { myShows, loading } = useSelector(
    (state) => state.organizer
  );

  useEffect(() => {
    dispatch(fetchMyShows());
  }, [dispatch]);
console.log("MY SHOWS:", myShows);
  // ================= DELETE =================
  const handleDelete = (id) => {
    if (confirm("Delete this show?")) {
      dispatch(deleteShow(id));
    }
  };

  // ================= PUBLISH =================
  const handlePublish = (id) => {
    dispatch(publishShow(id));
  };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          🎬 My Shows
        </h1>

        <button
          onClick={() => navigate("/organizer/create-show")}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg"
        >
          + Create Show
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* EMPTY */}
      {!loading && myShows.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No shows yet 😴 <br />
          Create your first show!
        </div>
      )}

      {/* GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {myShows.map((show) => (
          <div
            key={show._id}
            className="bg-white rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gray-200">
              {show.content?.poster ? (
                <img
                  src={show.content.poster}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* BODY */}
            <div className="p-4 space-y-3">

              {/* TITLE */}
              <h2 className="font-semibold text-lg">
                {show.content?.title || "Untitled"}
              </h2>

              {/* INFO */}
              <p className="text-sm text-gray-500">
                📅 {show.showDate?.slice(0, 10)}

              </p>

              <p className="text-sm text-gray-500">
                {/* ⏰ {new Date(show.startTime).toLocaleTimeString()} - {new Date(show.endTime).toLocaleTimeString()} */}
⏰ {show.startTime} - {show.endTime}
              </p>

              <p className="text-sm text-gray-500">
                
🎟 ₹{show.pricing?.[0]?.price || "N/A"}

              </p>

              {/* STATUS */}
             <div className="flex items-center gap-2">

  <span
    className={`px-3 py-1 text-xs rounded-full font-medium ${
      show.publishedStatus === "published"
        ? "bg-green-100 text-green-700"
        : "bg-yellow-100 text-yellow-700"
    }`}
  >
    {show.publishedStatus}
  </span>

  <span
    className={`px-3 py-1 text-xs rounded-full font-medium ${
      show.approvalStatus === "approved"
        ? "bg-blue-100 text-blue-700"
        : show.approvalStatus === "rejected"
        ? "bg-red-100 text-red-700"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {show.approvalStatus}
  </span>

</div>

              {/* ACTIONS */}
              <div className="flex gap-2 pt-3">

                {/* EDIT */}
                <button
                  onClick={() =>
                    navigate(`/organizer/edit-show/${show._id}`)
                  }
                  className="flex-1 border rounded-lg py-1 text-sm hover:bg-gray-100"
                >
                  Edit
                </button>

                {/* DELETE */}
                <button
                  onClick={() =>
                    handleDelete(show._id)
                  }
                  className="flex-1 border rounded-lg py-1 text-sm text-red-500 hover:bg-red-50"
                >
                  Delete
                </button>

                {/* PUBLISH */}
                {show.publishedStatus !== "published" && (
                  <button
                    onClick={() =>
                      handlePublish(show._id)
                    }
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg py-2 text-sm font-medium transition"
                  >
                    Publish
                  </button>
                )}
              </div>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default MyShows;