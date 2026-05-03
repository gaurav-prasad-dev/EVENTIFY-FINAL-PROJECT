import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import cityReducer from "../Features/admin/citySlice";

import {
  fetchCities,
  createCity,
  activateCity,
  deactivateCity,
} from "../../Features/admin/citySlice"; // ✅ FIXED PATH

const Cities = () => {
  const dispatch = useDispatch();

  const { cities, loading } = useSelector((state) => state.city);

  const [selectedCity, setSelectedCity] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // ================= CREATE =================
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.state.trim()) return;

    await dispatch(createCity(formData));

    setFormData({ name: "", state: "" });
  };

  // ================= ACTIONS =================
  const handleActivate = (id) => dispatch(activateCity(id));
  const handleDeactivate = (id) => dispatch(deactivateCity(id));

  return (
    <DashboardLayout>
      <div className="p-6">

        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-purple-700">
            City Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage all cities for shows & venues
          </p>
        </div>

        {/* ================= CREATE ================= */}
        <form
          onSubmit={handleCreate}
          className="bg-white p-4 rounded-xl border shadow-sm mb-6 grid grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="City Name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="border p-2 rounded-lg focus:outline-purple-500"
          />

          <input
            type="text"
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
            className="border p-2 rounded-lg focus:outline-purple-500"
          />

          <button
            type="submit"
            className="bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Add City
          </button>
        </form>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Total Cities" value={cities.length} />
          <StatCard
            title="Active Cities"
            value={cities.filter((c) => c.isActive).length}
            color="green"
          />
          <StatCard
            title="Inactive Cities"
            value={cities.filter((c) => !c.isActive).length}
            color="red"
          />
        </div>

        {/* ================= MAIN ================= */}
        <div className="grid grid-cols-3 gap-6">

          {/* LEFT LIST */}
          <div className="col-span-2 bg-white border rounded-2xl overflow-hidden">
            <div className="bg-purple-600 text-white p-4 font-semibold">
              Cities List
            </div>

            {loading ? (
              <p className="p-6 text-gray-500">Loading...</p>
            ) : cities.length === 0 ? (
              <p className="p-6 text-gray-500">No cities found</p>
            ) : (
              cities.map((city) => (
                <div
                  key={city._id}
                  onClick={() => setSelectedCity(city)}
                  className={`p-4 border-b cursor-pointer flex justify-between items-center transition ${
                    selectedCity?._id === city._id
                      ? "bg-purple-50"
                      : "hover:bg-purple-50"
                  }`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {city.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {city.state || "No state"}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      city.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {city.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white border rounded-2xl p-5 h-fit sticky top-6">

            {!selectedCity ? (
              <p className="text-gray-500 text-sm">
                Click a city to view details
              </p>
            ) : (
              <>
                <h2 className="text-xl font-bold text-purple-700">
                  {selectedCity.name}
                </h2>

                <p className="text-gray-600 mt-2">
                  🏙️ State: {selectedCity.state || "N/A"}
                </p>

                <p className="text-gray-500 text-sm mt-2">
                  ID: {selectedCity._id}
                </p>

                <div className="mt-5">
                  {selectedCity.isActive ? (
                    <button
                      onClick={() => handleDeactivate(selectedCity._id)}
                      className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
                    >
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate(selectedCity._id)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
};

// ================= SMALL COMPONENT =================
const StatCard = ({ title, value, color = "purple" }) => {
  const colors = {
    purple: "text-purple-700",
    green: "text-green-600",
    red: "text-red-500",
  };

  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className={`text-2xl font-bold ${colors[color]}`}>
        {value}
      </h2>
    </div>
  );
};

export default Cities;