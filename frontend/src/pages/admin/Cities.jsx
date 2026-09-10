import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchCities,
  createCity,
  activateCity,
  deactivateCity,
} from "../../Features/admin/citySlice";

import {
  FaCity,
  FaMapMarkerAlt,
  FaPlus,
  FaSearch,
  FaCheck,
  FaTimes,
  FaPowerOff,
} from "react-icons/fa";

const Cities = () => {
  const dispatch = useDispatch();

  const { cities, loading } = useSelector((state) => state.city);

  const [selectedCity, setSelectedCity] = useState(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    state: "",
  });

  // ================= FETCH =================
  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);

  // ================= FILTER =================
  const filteredCities = useMemo(() => {
    return (cities || []).filter((c) => {
      const name = c.name || "";
      const stateName = c.state || "";
      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        stateName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [cities, search]);

  const activeCount = useMemo(
    () => (cities || []).filter((c) => c.isActive).length,
    [cities]
  );
  const inactiveCount = useMemo(
    () => (cities || []).filter((c) => !c.isActive).length,
    [cities]
  );

  // ================= CREATE =================
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.state.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(createCity(formData)).unwrap();
      setFormData({ name: "", state: "" });
      dispatch(fetchCities());
    } catch (err) {
      alert(err || "Failed to create city");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ================= ACTIONS =================
  const handleToggleStatus = async (city) => {
    if (city.isActive) {
      await dispatch(deactivateCity(city._id));
    } else {
      await dispatch(activateCity(city._id));
    }
    dispatch(fetchCities());
    if (selectedCity?._id === city._id) {
      setSelectedCity((prev) => ({ ...prev, isActive: !prev.isActive }));
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 pb-12">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              City Management
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Configure supported metropolitan hubs and regional markets for show discovery.
            </p>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm rounded-2xl px-5 py-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaCity className="text-lg" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Total Cities</p>
              <h2 className="text-xl font-extrabold text-gray-900 leading-tight">
                {cities?.length || 0}
              </h2>
            </div>
          </div>
        </div>

        {/* ================= ADD NEW CITY FORM ================= */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-5 bg-purple-600 rounded-full inline-block" />
            <h2 className="text-lg font-bold text-gray-900">Add New City Region</h2>
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="City Name (e.g. Mumbai, Indore, Bengaluru)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            <input
              type="text"
              placeholder="State (e.g. Maharashtra, Madhya Pradesh)"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              required
              className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2"
            >
              <FaPlus className="text-xs" />
              {isSubmitting ? "Adding..." : "Add City"}
            </button>
          </form>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Total Registered</p>
              <h3 className="text-2xl font-black text-gray-900 mt-1">{cities.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FaCity />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Active Live Cities</p>
              <h3 className="text-2xl font-black text-emerald-600 mt-1">{activeCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FaCheck />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-gray-500">Inactive Cities</p>
              <h3 className="text-2xl font-black text-red-500 mt-1">{inactiveCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <FaTimes />
            </div>
          </div>
        </div>

        {/* ================= SEARCH & LIST ================= */}
        <div className="bg-white border border-gray-100 rounded-2xl p-2.5 flex items-center gap-3 shadow-sm">
          <FaSearch className="text-gray-400 ml-3" />
          <input
            type="text"
            placeholder="Search cities by name or state..."
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

        {/* ================= MAIN 2-COLUMN VIEW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* CITIES LIST */}
          <div className="lg:col-span-2 space-y-3">
            {loading ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs">Loading cities...</p>
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center text-gray-400 space-y-2">
                <FaCity className="text-3xl mx-auto opacity-30" />
                <p className="font-semibold text-gray-700 text-sm">No cities found</p>
                <p className="text-xs text-gray-400">Add a new city region using the form above.</p>
              </div>
            ) : (
              filteredCities.map((city) => {
                const isSelected = selectedCity?._id === city._id;
                return (
                  <div
                    key={city._id}
                    onClick={() => setSelectedCity(city)}
                    className={`bg-white rounded-2xl p-4 border transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isSelected
                        ? "border-purple-600 ring-2 ring-purple-600/10 shadow-md"
                        : "border-gray-100 hover:border-purple-200 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                        <FaMapMarkerAlt />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">
                          {city.name}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {city.state || "State not specified"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${
                          city.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-red-50 text-red-600 border border-red-200"
                        }`}
                      >
                        {city.isActive ? "Active" : "Inactive"}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(city);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          city.isActive
                            ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            : "bg-purple-600 hover:bg-purple-700 text-white"
                        }`}
                      >
                        <FaPowerOff className="text-[10px]" />
                        {city.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* DETAIL DRAWER */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 h-fit sticky top-6 shadow-sm">
            {!selectedCity ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <FaCity className="text-xl" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Select a City</h3>
                <p className="text-xs text-gray-400 max-w-xs mx-auto">
                  Click on any city in the list to manage active status and region info.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
                    {selectedCity.name}
                  </h2>
                  <p className="text-xs text-purple-600 font-semibold mt-1 uppercase tracking-wider">
                    {selectedCity.state || "State not set"}
                  </p>
                </div>

                <div className="space-y-3 text-xs border-t border-b border-gray-100 py-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Status</span>
                    <span
                      className={`font-bold ${
                        selectedCity.isActive ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {selectedCity.isActive ? "Active (Visible on Storefront)" : "Inactive (Hidden)"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">City ID</span>
                    <span className="font-mono text-gray-600 text-[11px]">
                      {selectedCity._id}
                    </span>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleToggleStatus(selectedCity)}
                    className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition shadow-sm ${
                      selectedCity.isActive
                        ? "bg-red-50 hover:bg-red-100 text-red-600 border border-red-100"
                        : "bg-emerald-600 hover:bg-emerald-700 text-white"
                    }`}
                  >
                    <FaPowerOff className="text-xs" />
                    {selectedCity.isActive ? "Deactivate City" : "Activate City"}
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

export default Cities;