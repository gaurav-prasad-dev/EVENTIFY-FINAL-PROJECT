import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";
import { FaBuilding, FaMapMarkerAlt, FaCheck, FaPlus, FaTrash, FaTv } from "react-icons/fa";

const CreateVenue = () => {
  const [cities, setCities] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    city: "",
    type: "Theatre",
    street: "",
    area: "",
    landmark: "",
    pincode: "",
    amenities: [],
  });

  // Screens to create with the venue
  const [screens, setScreens] = useState([
    {
      name: "Screen 1 - Audi 1 (Dolby Atmos)",
      totalSeats: 60,
      features: ["Premium"],
    },
    {
      name: "Screen 2 - Audi 2",
      totalSeats: 60,
      features: ["Recliner"],
    },
  ]);

  const availableAmenities = [
    "Dolby Atmos 7.1",
    "4K Laser Projection",
    "Luxury Recliner Seats",
    "Food & Beverage Court",
    "Valet Parking",
    "Wheelchair Accessible",
    "Air Conditioned",
    "IMAX certified",
  ];

  // ================= HANDLE CHANGE =================
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAmenity = (amenity) => {
    setForm((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  // ================= SCREEN ACTIONS =================
  const handleAddScreen = () => {
    const nextNum = screens.length + 1;
    setScreens((prev) => [
      ...prev,
      {
        name: `Screen ${nextNum} - Audi ${nextNum}`,
        totalSeats: 60,
        features: ["Premium"],
      },
    ]);
  };

  const handleRemoveScreen = (index) => {
    if (screens.length <= 1) {
      alert("At least one screen is required for the venue.");
      return;
    }
    setScreens((prev) => prev.filter((_, i) => i !== index));
  };

  const handleScreenChange = (index, field, value) => {
    setScreens((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const toggleScreenFeature = (index, feature) => {
    setScreens((prev) => {
      const copy = [...prev];
      const feats = copy[index].features || [];
      copy[index] = {
        ...copy[index],
        features: feats.includes(feature)
          ? feats.filter((f) => f !== feature)
          : [...feats, feature],
      };
      return copy;
    });
  };

  // ================= FETCH CITIES =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.CITY.GET_ALL);
        const cityData = res.data?.data || res.data?.cities || [];
        setCities(Array.isArray(cityData) ? cityData : []);
      } catch (err) {
        console.log("CITY FETCH ERROR:", err);
        setCities([]);
      }
    };

    fetchCities();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.city) {
      alert("Please provide venue name and city");
      return;
    }

    if (screens.length === 0) {
      alert("Please add at least one screen");
      return;
    }

    for (let s of screens) {
      if (!s.name.trim()) {
        alert("Each screen must have an auditorium title or name");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await apiClient.post(ENDPOINTS.ORGANIZER.VENUES.CREATE, {
        ...form,
        screens,
      });
      alert(`Venue and ${screens.length} screen(s) registered successfully! 🎉 Pending admin verification.`);

      setForm({
        name: "",
        city: "",
        type: "Theatre",
        street: "",
        area: "",
        landmark: "",
        pincode: "",
        amenities: [],
      });
      setScreens([
        {
          name: "Screen 1 - Audi 1 (Dolby Atmos)",
          totalSeats: 60,
          features: ["Premium"],
        },
        {
          name: "Screen 2 - Audi 2",
          totalSeats: 60,
          features: ["Recliner"],
        },
      ]);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating venue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* HEADER */}
        <div className="border-b border-gray-100 pb-4">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <FaBuilding className="text-purple-600 text-2xl" />
            Register New Venue
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Submit your cinema theatre or auditorium details for administrative review and show scheduling.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm"
        >
          {/* GENERAL INFO */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-purple-600 rounded-full" />
              <h2 className="text-base font-bold text-gray-900">General Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Venue / Cinema Hall Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Cinepolis Nexus Mall or PVR Icon"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Metropolitan City *
                </label>
                <select
                  value={form.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                >
                  <option value="">-- Choose City --</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name} {c.state ? `(${c.state})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Venue Type *
                </label>
                <select
                  value={form.type}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                >
                  <option value="Theatre">Multiplex / Theatre</option>
                  <option value="Auditorium">Auditorium / Hall</option>
                  <option value="Stadium">Stadium / Arena</option>
                  <option value="OpenGround">Open Ground / Drive-in</option>
                </select>
              </div>
            </div>
          </div>

          {/* ADDRESS DETAILS */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-purple-600 rounded-full" />
              <h2 className="text-base font-bold text-gray-900">Physical Location</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. 5th Floor, Nexus Grand Mall"
                  value={form.street}
                  onChange={(e) => handleChange("street", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Area / Locality
                </label>
                <input
                  type="text"
                  placeholder="e.g. Whitefield, Koramangala"
                  value={form.area}
                  onChange={(e) => handleChange("area", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Nearby Landmark
                </label>
                <input
                  type="text"
                  placeholder="e.g. Near Metro Station"
                  value={form.landmark}
                  onChange={(e) => handleChange("landmark", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Postal Pincode
                </label>
                <input
                  type="text"
                  placeholder="e.g. 560066"
                  value={form.pincode}
                  onChange={(e) => handleChange("pincode", e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* AUDITORIUMS & SCREENS SETUP */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-4 bg-purple-600 rounded-full" />
                  <h2 className="text-base font-bold text-gray-900">
                    Auditoriums & Screens Setup ({screens.length})
                  </h2>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Screens and seating layouts will be automatically provisioned for this venue.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddScreen}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition border border-purple-200 shadow-2xs"
              >
                <FaPlus className="text-[10px]" />
                Add Screen
              </button>
            </div>

            <div className="space-y-3">
              {screens.map((screen, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 hover:bg-white transition space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-gray-200/60 pb-2">
                    <span className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                      <FaTv className="text-purple-600 text-xs" />
                      Screen #{idx + 1}
                    </span>

                    {screens.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveScreen(idx)}
                        className="text-gray-400 hover:text-rose-600 transition text-xs flex items-center gap-1"
                      >
                        <FaTrash className="text-[10px]" />
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Screen / Auditorium Title *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Audi 1 (Dolby Atmos)"
                        value={screen.name}
                        onChange={(e) =>
                          handleScreenChange(idx, "name", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Total Seats *
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="500"
                        value={screen.totalSeats}
                        onChange={(e) =>
                          handleScreenChange(idx, "totalSeats", e.target.value)
                        }
                        required
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Screen Features / Tier
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {["Premium", "Recliner", "Wheelchair"].map((feat) => {
                        const hasFeat = screen.features?.includes(feat);
                        return (
                          <button
                            key={feat}
                            type="button"
                            onClick={() => toggleScreenFeature(idx, feat)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                              hasFeat
                                ? "bg-purple-600 text-white font-semibold"
                                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {hasFeat ? `✓ ${feat}` : `+ ${feat}`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AMENITIES PILLS */}
          <div className="space-y-3 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-4 bg-purple-600 rounded-full" />
              <h2 className="text-base font-bold text-gray-900">Amenities & Facility Highlights</h2>
            </div>
            <p className="text-xs text-gray-400">Click badges to select all available facilities.</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {availableAmenities.map((amenity) => {
                const selected = form.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selected
                        ? "bg-purple-600 text-white shadow-sm ring-2 ring-purple-200"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {selected && <FaCheck className="text-[10px]" />}
                    {amenity}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-4 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black hover:bg-gray-800 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaPlus className="text-xs" />
              {isSubmitting ? "Submitting Venue..." : "Submit Venue for Verification"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateVenue;