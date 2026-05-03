import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  createShowThunk,
  resetOrganizerState,
} from "../../Features/organizer/organizerSlice";

import apiClient from "../../services/apiClient";
import { ENDPOINTS } from "../../services/apis";

const CreateShow = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, success, error } = useSelector(
    (state) => state.organizer
  );

  const [form, setForm] = useState({
    content: "",
    screenId: "",
    date: "",
    startTime: "",
    endTime: "",
    basePrice: "",
    publishedStatus: "draft",
  });

  const [contents, setContents] = useState([]);
  const [screens, setScreens] = useState([]);

  // ================= FETCH CONTENT =================
  useEffect(() => {
    const fetchContent = async () => {
      try {
       
         const res = await apiClient.get(ENDPOINTS.CONTENT.GET_ALL);
console.log("CONTENT API RESPONSE:", res.data);
        setContents(res.data.data || []);
      } catch (err) {
        console.log("CONTENT ERROR:", err);
      }
    };

    fetchContent();
  }, []);

  // ================= FETCH SCREENS =================
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const res = await apiClient.get("/screen");
        console.log("SCREEN DATA:", res.data);
        setScreens(res.data.data || []);
      } catch (err) {
        console.log("SCREEN ERROR:", err);
      }
    };

    fetchScreens();
  }, []);

  // ================= HANDLE =================
  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // ================= SUBMIT =================
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      createShowThunk({
        content: form.content,
        screenId: form.screenId,
        date: form.date,
        startTime: form.startTime,
        endTime: form.endTime,
        basePrice: Number(form.basePrice),
        publishedStatus: form.publishedStatus,
      })
    );
  };

  // ================= SUCCESS =================
  useEffect(() => {
    if (success) {
      alert("Show Created 🎉");

      dispatch(resetOrganizerState());

      setForm({
        content: "",
        screenId: "",
        date: "",
        startTime: "",
        endTime: "",
        basePrice: "",
      });
    }
  }, [success]);

  return (
    <div className="max-w-4xl mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        🎬 Create Show
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* CONTENT */}
        <select
          value={form.content}
          onChange={(e) => handleChange("content", e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Content</option>

          {contents.length === 0 && (
            <option disabled>No content found</option>
          )}

          {contents.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>

        {/* SCREEN */}
        <select
          value={form.screenId}
          onChange={(e) => handleChange("screenId", e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Select Screen</option>

          {screens.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        {/* DATE */}
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full p-3 border rounded"
        />

        {/* TIME */}
        <div className="flex gap-2">
          <input
            type="time"
            value={form.startTime}
            onChange={(e) =>
              handleChange("startTime", e.target.value)
            }
            className="w-full p-3 border rounded"
          />

          <input
            type="time"
            value={form.endTime}
            onChange={(e) =>
              handleChange("endTime", e.target.value)
            }
            className="w-full p-3 border rounded"
          />
        </div>

        {/* PRICE */}
        <input
          type="number"
          placeholder="Base Price"
          value={form.basePrice}
          onChange={(e) =>
            handleChange("basePrice", e.target.value)
          }
          className="w-full p-3 border rounded"
        />

        <select
  value={form.publishedStatus}
  onChange={(e) =>
    handleChange(
      "publishedStatus",
      e.target.value
    )
  }
  className="w-full p-3 border rounded"
>
  <option value="draft">
    Save as Draft
  </option>

  <option value="published">
    Publish Now
  </option>
</select>

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full bg-purple-600 text-white p-3 rounded"
        >
          {loading ? "Creating..." : "Create Show"}
        </button>

        {error && (
          <p className="text-red-500">{error}</p>
        )}
      </form>
    </div>
  );
};

export default CreateShow;