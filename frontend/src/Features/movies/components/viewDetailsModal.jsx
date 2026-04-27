import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const ViewDetailsModal = () => {
  const navigate = useNavigate();

  const { movieDetails, trailerKey, cast, reviews, posters } =
    useSelector((state) => state.movies);
console.log({ movieDetails, cast, reviews, posters });

  const [activeTab, setActiveTab] = useState("reviews");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* 🔥 BLUR */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        onClick={() => navigate(-1)}
      />

      {/* 🎬 MODAL */}
      <div className="relative bg-white w-[90%] md:w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl p-6 shadow-2xl">

        {/* ❌ CLOSE */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 text-xl"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold">Movie details</h2>
        <p className="text-gray-500">{movieDetails?.title}</p>

        {/* TABS */}
        <div className="flex gap-6 mt-6 border-b pb-2 text-sm font-medium">
          {["reviews", "synopsis", "cast", "videos", "posters"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`capitalize ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }`}
            >
              {tab === "cast" ? "Cast & Crew" : tab}
            </button>
          ))}
        </div>

        {/* CONTENT
        <div className="mt-4"> */}

         {/* {activeTab === "posters" && (
  <div className="grid grid-cols-3 gap-3">
    {posters?.length ? (
      posters.map((p, i) => (
        <img
          key={i}
          src={p}   // ✅ FIXED
          className="rounded-lg"
        />
      ))
    ) : (
      <p>No posters available</p>
    )}
  </div>
)} */}

          {/* SYNOPSIS ✅ */}
          {activeTab === "synopsis" && (
            <p>{movieDetails?.overview}</p>
          )}

          {activeTab === "cast" && (
  <div className="grid grid-cols-3 gap-4">
    {cast?.length ? (
      cast.map((c, i) => (
        <div key={i} className="text-center">
          <img
            src={
    c.profile_path
      ? `https://image.tmdb.org/t/p/w200${c.profile_path}`
      : "https://via.placeholder.com/80?text=No+Image"
  }
            className="w-20 h-20 rounded-full mx-auto object-cover"
          />
          <p className="text-sm mt-2">{c.name}</p>
        </div>
      ))
    ) : (
      <p>No cast available</p>
    )}
  </div>
)}

          {/* VIDEOS ✅ */}
          {activeTab === "videos" && trailerKey && (
            <iframe
              className="w-full h-[300px]"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allowFullScreen
            />
          )}
{activeTab === "posters" && (
  <div className="grid grid-cols-3 gap-3">
    {posters
      ?.filter(p => p?.file_path)
      .map((p, i) => (
        <img
          key={i}
          src={`https://image.tmdb.org/t/p/w300${p.file_path}`}
          alt="poster"
          className="rounded-lg"
          onError={(e) => (e.target.style.display = "none")}
        />
      ))}
  </div>
)}
        </div>
      </div>
   
  );
};

export default ViewDetailsModal;