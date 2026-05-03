import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchRecentBookings,
} from "../../Features/organizer/organizerSlice"

const Bookings = () => {
  const dispatch = useDispatch();

  const { bookings, loading } = useSelector(
    (state) => state.organizer
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchRecentBookings());
  }, [dispatch]);

  // ================= FILTER =================
  const filteredBookings = bookings.filter((b) =>
    b.user?.email
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= STATS =================
  const totalRevenue = bookings.reduce(
    (acc, b) => acc + b.totalAmount,
    0
  );

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <h1 className="text-2xl font-bold">
        💳 Bookings
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Bookings
          </p>
          <h2 className="text-xl font-bold">
            {bookings.length}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Total Revenue
          </p>
          <h2 className="text-xl font-bold">
            ₹{totalRevenue}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-xl shadow">
          <p className="text-gray-500 text-sm">
            Today
          </p>
          <h2 className="text-xl font-bold">
            {
              bookings.filter(
                (b) =>
                  new Date(b.createdAt).toDateString() ===
                  new Date().toDateString()
              ).length
            }
          </h2>
        </div>

      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="w-full border p-3 rounded-lg"
      />

      {/* LOADING */}
      {loading && <p>Loading...</p>}

      {/* LIST */}
      <div className="space-y-4">

        {filteredBookings.map((b) => (
          <div
            key={b._id}
            className="bg-white p-5 rounded-xl shadow flex flex-col md:flex-row justify-between gap-4"
          >

            {/* LEFT */}
            <div className="space-y-2">
              <h2 className="font-semibold">
                {b.show?.content?.title}
              </h2>

              <p className="text-sm text-gray-500">
                👤 {b.user?.email}
              </p>

              <p className="text-sm text-gray-500">
                🎟 Seats: {b.seats?.join(", ")}
              </p>

              <p className="text-sm text-gray-500">
                📅{" "}
                {new Date(
                  b.createdAt
                ).toLocaleString()}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end justify-between">

              <span className="text-lg font-bold text-purple-600">
                ₹{b.totalAmount}
              </span>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  b.status === "confirmed"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}
              >
                {b.status}
              </span>
            </div>

          </div>
        ))}

      </div>
    </div>
  );
};

export default Bookings;