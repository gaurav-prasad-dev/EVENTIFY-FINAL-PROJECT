import { useEffect, useState } from "react";
import { IoLocationOutline } from "react-icons/io5";
import { getCities } from "../cityApi.js";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCity } from "../locationTimeSlice.js";

function Location() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { movieId } = useParams();

  const [cities, setCities] = useState([]);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // ✅ Redux state
  const selectedCity = useSelector((state) => state.location.city);

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const res = await getCities();
      setCities(res.data.cities);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = (city) => {
    // ✅ Redux update
    dispatch(setCity(city));

    setOpen(false);

    const pathParts = location.pathname.split("/");

    if (pathParts[1] === "movies" && pathParts[2]) {
      const movieId = pathParts[2];
      navigate(`/movies/${movieId}/${encodeURIComponent(city.name)}`);
    }
  };

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <IoLocationOutline className="text-xl text-purple-500" />
        <div>
          <p className="font-semibold">
            {selectedCity?.name || "Select City"}
          </p>
          <p>{selectedCity?.state}</p>
        </div>
      </div>

      {/* Modal */}

      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-[1000] flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-4 text-xl"
            >
              X
            </button>

            <input
              type="text"
              placeholder="Search City, area or locality"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 mb-4 outline-none focus:ring-2 focus:ring-purple-400"
            />

            <h3 className="font-semibold mb-3">Popular Cities</h3>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-4">
              {filteredCities.map((city) => (
                <div
                  key={city._id}
                  onClick={() => handleSelect(city)}
                  className={`p-4 rounded-xl border cursor-pointer text-center hover:bg-blue-50 transition
                    ${
                      selectedCity?._id === city._id
                        ? "bg-blue-100 border-blue-500"
                        : ""
                    }`}
                >
                  <div className="h-10 w-10 mx-auto mb-2 bg-purple-100 rounded-full flex items-center justify-center">
                    🏙️
                  </div>
                  <p className="text-sm font-medium">{city.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Location;