import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
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
  const searchInputRef = useRef(null);

  const locationState = useSelector((state) => state.location);

  // Safely extract string city name to avoid object render crashes
  const currentCityName = useMemo(() => {
    if (!locationState) return "Indore";
    if (typeof locationState.city === "string" && locationState.city.trim()) {
      return locationState.city;
    }
    if (typeof locationState.city === "object" && locationState.city?.name) {
      return locationState.city.name;
    }
    if (typeof locationState.selectedCity === "object" && locationState.selectedCity?.name) {
      return locationState.selectedCity.name;
    }
    if (typeof locationState.selectedCity === "string" && locationState.selectedCity.trim()) {
      return locationState.selectedCity;
    }
    return "Indore";
  }, [locationState]);

  useEffect(() => {
    let isMounted = true;
    const fetchCities = async () => {
      try {
        const res = await getCities();
        const list = res?.cities || res?.data?.cities || (Array.isArray(res) ? res : []);
        if (isMounted && Array.isArray(list) && list.length > 0) {
          setDbCities(list);
        }
      } catch (error) {
        console.log("Error loading cities:", error);
      }
    };

    fetchCities();
    return () => {
      isMounted = false;
    };
  }, []);

  // Keyboard escape listener and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  // Focus search input when modal opens
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Combine DB cities with popular cities list (avoid duplicates)
  const allCities = useMemo(() => {
    const map = new Map();

    POPULAR_METROS.forEach((c) => {
      map.set(c.name.toLowerCase(), { ...c, isPopular: true });
    });

    dbCities.forEach((c) => {
      const key = c.name?.toLowerCase();
      if (!key) return;
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
        (c?.name && c.name.toLowerCase().includes(query)) ||
        (c?.state && c.state.toLowerCase().includes(query))
    );
  }, [allCities, search]);

  const handleSelect = (city) => {
    const cityName = typeof city === "string" ? city : city?.name;
    if (!cityName) return;

    const cityObj =
      typeof city === "object"
        ? city
        : allCities.find((c) => c.name?.toLowerCase() === cityName.toLowerCase()) || {
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
            const match = allCities.find(
              (c) =>
                c.name?.toLowerCase() === detectedName.toLowerCase() ||
                detectedName.toLowerCase().includes(c.name?.toLowerCase())
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
          {currentCityName}
        </span>
        <IoChevronDown className="text-[11px] text-gray-400 group-hover:text-purple-600 transition-transform duration-200 group-hover:translate-y-0.5 shrink-0" />
      </button>

      {/* LOCATION PICKER MODAL (Rendered in Portal to escape navbar stacking context & backdrop-blur) */}
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto transition-opacity"
            onClick={(e) => {
              if (e.target === e.currentTarget) setOpen(false);
            }}
          >
            <div
              className="bg-white w-full max-w-2xl max-h-[85vh] sm:max-h-[88vh] rounded-3xl p-5 sm:p-7 relative shadow-2xl flex flex-col my-auto border border-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE BUTTON */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
                title="Close"
              >
                <IoClose className="text-xl sm:text-2xl" />
              </button>

              {/* HEADER & SUBTITLE */}
              <div className="mb-4 pr-10 shrink-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Select Your City
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Shows, movies, and venues will be customized for your location
                </p>
              </div>

              {/* SEARCH INPUT */}
              <div className="relative mb-3 shrink-0">
                <IoSearchOutline className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search city, district, or state..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border border-gray-200 rounded-xl text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                    title="Clear search"
                  >
                    <IoClose className="text-base" />
                  </button>
                )}
              </div>

              {/* AUTO DETECT ROW */}
              <div className="mb-4 flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
                <button
                  type="button"
                  onClick={handleDetectLocation}
                  disabled={detecting}
                  className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition cursor-pointer disabled:opacity-60"
                >
                  <IoNavigateOutline className={`text-base ${detecting ? "animate-spin" : ""}`} />
                  <span>
                    {detecting ? "Detecting location..." : "Auto-detect my location"}
                  </span>
                </button>

                {currentCityName && (
                  <span className="text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[240px]">
                    Current: <strong className="text-purple-600">{currentCityName}</strong>
                  </span>
                )}
              </div>

              {detectError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-xl mb-3 shrink-0">
                  {detectError}
                </div>
              )}

              {/* CITIES GRID (SCROLLABLE AREA) */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-1.5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                    {search.trim() ? `Search Results (${filteredCities.length})` : "Popular Cities"}
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3">
                  {filteredCities.map((city) => {
                    const isSelected =
                      currentCityName.toLowerCase() === city.name?.toLowerCase();

                    return (
                      <div
                        key={city._id || city.name}
                        onClick={() => handleSelect(city)}
                        className={`relative p-3 sm:p-3.5 rounded-2xl border cursor-pointer flex flex-col items-center justify-center text-center transition-all duration-150 group active:scale-95 select-none ${
                          isSelected
                            ? "bg-purple-50/90 border-purple-500 ring-2 ring-purple-200/80 shadow-xs"
                            : "bg-white hover:bg-purple-50/30 border-gray-200 hover:border-purple-200 hover:shadow-xs"
                        }`}
                      >
                        {isSelected && (
                          <IoCheckmarkCircle className="absolute top-2 right-2 text-purple-600 text-sm sm:text-base" />
                        )}

                        <span className="text-2xl sm:text-3xl mb-1.5 transform group-hover:scale-110 transition duration-150">
                          {city.icon || "🏙️"}
                        </span>

                        <p
                          className={`text-xs sm:text-sm font-semibold truncate max-w-full ${
                            isSelected ? "text-purple-700 font-bold" : "text-gray-800 group-hover:text-purple-700"
                          }`}
                        >
                          {city.name}
                        </p>

                        {city.state && (
                          <p className="text-[10px] sm:text-[11px] text-gray-400 truncate max-w-full mt-0.5">
                            {city.state}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredCities.length === 0 && (
                  <div className="text-center py-10 text-gray-500 text-sm">
                    <p className="text-gray-600 font-medium">No cities found matching "{search}"</p>
                    <p className="text-xs text-gray-400 mt-1">You can still select this location as a custom city</p>
                    <button
                      type="button"
                      onClick={() => handleSelect(search.trim())}
                      className="mt-3 inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold shadow-xs transition cursor-pointer"
                    >
                      Select "{search.trim()}" as custom city
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default Location;
