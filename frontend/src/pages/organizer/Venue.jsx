import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const CreateVenue = () => {
  const [cities, setCities] = useState([]);

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

  // ================= HANDLE CHANGE =================
  const handleChange = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ================= FETCH CITIES (FIXED SAFE VERSION) =================
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await apiClient.get(ENDPOINTS.CITY.GET_ALL);

        console.log("CITY API RESPONSE:", res.data);

        // ✅ SAFE EXTRACTION (prevents crash)
        const cityData =
          res.data?.data ||
          res.data?.cities ||
          [];

        setCities(Array.isArray(cityData) ? cityData : []);

      } catch (err) {
        console.log("CITY FETCH ERROR:", err);
        setCities([]); // fallback safety
      }
    };

    fetchCities();
  }, []);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("ENDPOINT:", ENDPOINTS.ORGANIZER.CREATE_VENUES);

      await apiClient.post(
        ENDPOINTS.ORGANIZER.VENUES.CREATE,
        form
      );

      alert("Venue created successfully 🎉");

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

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error creating venue");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-2xl font-bold mb-6">
        🏢 Create Venue
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-xl shadow">

        {/* VENUE NAME */}
        <input
          placeholder="Venue Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        {/* CITY DROPDOWN (SAFE MAP) */}
        <select
          value={form.city}
          onChange={(e) => handleChange("city", e.target.value)}
          className="border p-3 w-full rounded-lg"
        >
          <option value="">Select City</option>

          {cities?.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value)}
          className="border p-3 w-full rounded-lg"
        >
            <option value="Theatre">Theatre</option>
  <option value="Auditorium">Auditorium</option>
  <option value="Stadium">Stadium</option>
  <option value="OpenGround">OpenGround</option>
        </select>

        {/* STREET */}
        <input
          placeholder="Street"
          value={form.street}
          onChange={(e) => handleChange("street", e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        {/* AREA */}
        <input
          placeholder="Area"
          value={form.area}
          onChange={(e) => handleChange("area", e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        {/* LANDMARK */}
        <input
          placeholder="Landmark"
          value={form.landmark}
          onChange={(e) => handleChange("landmark", e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        {/* PINCODE */}
        <input
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) => handleChange("pincode", e.target.value)}
          className="border p-3 w-full rounded-lg"
        />

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg"
        >
          Create Venue
        </button>

      </form>
    </div>
  );
};

export default CreateVenue;