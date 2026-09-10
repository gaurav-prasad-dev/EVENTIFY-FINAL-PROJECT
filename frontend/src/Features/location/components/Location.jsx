import { useEffect, useState, useMemo } from "react";
import {
  IoLocationOutline,
  IoChevronDown,
  IoClose,
  IoSearchOutline,
  IoCheckmarkCircle,
  IoNavigateOutline,
} from "react-icons/io5";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../locationTimeSlice.js";
import { getCities } from "../cityApi.js";

const POPULAR_METROS = [
  { name: "Mumbai", state: "Maharashtra", icon: "🌊", lat: 19.076, lng: 72.8777 },
  { name: "Delhi-NCR", state: "Delhi", icon: "🏛️", lat: 28.6139, lng: 77.209 },
  { name: "Bengaluru", state: "Karnataka", icon: "💻", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "Telangana", icon: "🏰", lat: 17.385, lng: 78.4867 },
  { name: "Ahmedabad", state: "Gujarat", icon: "🪁", lat: 23.0225, lng: 72.5714 },
  { name: "Chennai", state: "Tamil Nadu", icon: "🌴", lat: 13.0827, lng: 80.2707 },
  { name: "Kolkata", state: "West Bengal", icon: "🪔", lat: 22.5726, lng: 88.3639 },
  { name: "Pune", state: "Maharashtra", icon: "🎓", lat: 18.5204, lng: 73.8567 },
  { name: "Indore", state: "Madhya Pradesh", icon: "✨", lat: 22.7196, lng: 75.8577 },
  { name: "Jaipur", state: "Rajasthan", icon: "👑", lat: 26.9124, lng: 75.7873 },
  { name: "Chandigarh", state: "Punjab", icon: "🌾", lat: 30.7333, lng: 76.7794 },
  { name: "Bhopal", state: "Madhya Pradesh", icon: "🏞️", lat: 23.2599, lng: 77.4126 },
];

function Location() {
  const navigate = useNavigate();
  const locationRoute = useLocation();
  const dispatch = useDispatch();

  const [dbCities, setDbCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [detectError, setDetectError] = useState("");

  const selectedCity = useSelector((state) => state.location?.city || "Indore");

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getCities();
        if (res?.cities && Array.isArray(res.cities)) {
          setDbCities(res.cities);
        }
      } catch (error) {
        console.log("Error loading cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Combine DB cities with popular cities list (avoid duplicates)
  const allCities = useMemo(() => {
    const map = new Map();

    POPULAR_METROS.forEach((c) => {
      map.set(c.name.toLowerCase(), { ...c, isPopular: true });
    });

    dbCities.forEach((c) => {
      const key = c.name.toLowerCase();
      if (map.has(key)) {
        map.set(key, { ...map.get(key), ...c, _id: c._id });
      } else {
        map.set(key, { ...c, icon: "🏙️", isPopular: false });
      }
    });

    return Array.from(map.values());
  }, [dbCities]);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return allCities;
    return allCities.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        (c.state && c.state.toLowerCase().includes(query))
    );
  }, [allCities, search]);

  const handleSelect = (city) => {
    const cityName = typeof city === "string" ? city : city.name;
    const cityObj =
      typeof city === "object"
        ? city
        : allCities.find((c) => c.name.toLowerCase() === cityName.toLowerCase()) || {
            name: cityName,
          };

    dispatch(setCity(cityObj));
    setOpen(false);
    setSearch("");
    setDetectError("");

    // If currently on Movie Details page, update the city parameter in the URL
    const pathParts = locationRoute.pathname.split("/");
    if (pathParts[1] === "movies" && pathParts[2]) {
      const movieId = pathParts[2];
      navigate(`/movies/${movieId}/${encodeURIComponent(cityName)}`);
    }
  };

  // GPS Auto-detect location
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setDetectError("Geolocation is not supported by your browser");
      return;
    }

    setDetecting(true);
    setDetectError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;

        // Try reverse geocoding via OpenStreetMap free reverse geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { "User-Agent": "Eventify-App/1.0" } }
          );
          const data = await res.json();
          const detectedName =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.county;

          if (detectedName) {
            // Find in our city list
            const match = allCities.find(
              (c) =>
                c.name.toLowerCase() === detectedName.toLowerCase() ||
                detectedName.toLowerCase().includes(c.name.toLowerCase())
            );

            if (match) {
              handleSelect(match);
              setDetecting(false);
              return;
            }
          }
        } catch {
          // Fallback to closest metro calculation
        }

        // Calculate distance to all known cities with coords
        let closest = POPULAR_METROS[0];
        let minDistance = Infinity;

        POPULAR_METROS.forEach((metro) => {
          const dist = Math.hypot(metro.lat - latitude, metro.lng - longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closest = metro;
          }
        });

        handleSelect(closest);
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        setDetectError(
          err.code === 1
            ? "Location permission was denied. Please select your city manually."
            : "Could not detect location. Please select manually."
        );
      },
      { timeout: 8000, enableHighAccuracy: false }
    );
  };

  return (
    <>
      {/* NAVBAR TRIGGER PILL */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-full bg-gray-50/90 hover:bg-purple-50/70 border border-gray-200/80 hover:border-purple-200 text-gray-700 hover:text-purple-700 transition-all duration-200 cursor-pointer text-left focus:outline-none shadow-xs hover:shadow-sm active:scale-95"
        title="Change Location"
      >
        <IoLocationOutline className="text-base sm:text-lg text-purple-600 shrink-0 transition-transform duration-200 group-hover:scale-110" />
        <span className="font-semibold text-xs sm:text-sm text-gray-800 group-hover:text-purple-700 max-w-[100px] sm:max-w-[130px] truncate transition-colors">
          {selectedCity || "Select City"}
        </span>
        <IoChevronDown className="text-[11px] text-gray-400 group-hover:text-purple-600 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
      </button>

      {/* LOCATION PICKER MODAL */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 relative shadow-2xl animate-in zoom-in-95 duration-200">
            {/* CLOSE BUTTON */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition"
            >
              <IoClose className="text-2xl" />
            </button>

            {/* HEADER & AUTO-DETECT BUTTON */}
            <div className="mb-4 pr-10">
              <h2 className="text-xl font-bold text-gray-800">
                Select Your City
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Shows, movies, and venues will be customized for your location
              </p>
            </div>

            {/* SEARCH INPUT */}
            <div className="relative mb-4">
              <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search city, district, or state..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
              />
            </div>

            {/* AUTO DETECT ROW */}
            <div className="mb-5 flex items-center justify-between pb-3 border-b border-gray-100">
              <button
                type="button"
                onClick={handleDetectLocation}
                disabled={detecting}
                className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition"
              >
                <IoNavigateOutline className={`text-base ${detecting ? "animate-spin" : ""}`} />
                <span>
                  {detecting ? "Detecting location..." : "Auto-detect my location"}
                </span>
              </button>

              {selectedCity && (
                <span className="text-xs text-gray-500">
                  Current: <strong className="text-purple-600">{selectedCity}</strong>
                </span>
              )}
            </div>

            {detectError && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded-lg mb-3">
                {detectError}
              </p>
            )}

            {/* POPULAR CITIES GRID */}
            <div className="max-h-[340px] overflow-y-auto pr-1">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                {search.trim() ? "Search Results" : "Popular Cities"}
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {filteredCities.map((city) => {
                  const isSelected =
                    selectedCity?.toLowerCase() === city.name?.toLowerCase();

                  return (
                    <div
                      key={city._id || city.name}
                      onClick={() => handleSelect(city)}
                      className={`relative p-3.5 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition group ${
                        isSelected
                          ? "bg-purple-50/80 border-purple-500 ring-2 ring-purple-100"
                          : "bg-white hover:bg-gray-50/80 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <IoCheckmarkCircle className="absolute top-2 right-2 text-purple-600 text-sm" />
                      )}

                      <span className="text-2xl mb-1.5 transform group-hover:scale-110 transition duration-150">
                        {city.icon || "🏙️"}
                      </span>

                      <p
                        className={`text-sm font-semibold truncate max-w-full ${
                          isSelected ? "text-purple-700" : "text-gray-800"
                        }`}
                      >
                        {city.name}
                      </p>

                      {city.state && (
                        <p className="text-[11px] text-gray-400 truncate max-w-full">
                          {city.state}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredCities.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  <p>No cities found matching "{search}"</p>
                  <button
                    type="button"
                    onClick={() => handleSelect(search.trim())}
                    className="mt-2 text-xs font-semibold text-purple-600 hover:underline"
                  >
                    Select "{search.trim()}" as custom city
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Location;