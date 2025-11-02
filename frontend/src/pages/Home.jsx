import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { toast } from "react-toastify";

const UrlForm = ({ onShortened }) => {
  const [longUrl, setLongUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!longUrl) return toast.error("Enter a valid URL");

    try {
      setLoading(true);
      const res = await axiosInstance.post("/url/shorten", {
        target_url: longUrl,
        code: customCode.trim() || undefined, // optional
      });
      toast.success("URL shortened successfully!");
      setLongUrl("");
      setCustomCode("");
      if (onShortened) onShortened(res.data);
    } catch (err) {
      toast.error(err?.response?.data?.error || "Shorten failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row gap-3 items-center"
    >
      <input
        type="url"
        placeholder="Paste long URL (include https://)"
        value={longUrl}
        onChange={(e) => setLongUrl(e.target.value)}
        className="border rounded px-3 py-2 w-full sm:w-96"
        required
      />
      <input
        type="text"
        placeholder="Custom code (optional)"
        value={customCode}
        onChange={(e) => setCustomCode(e.target.value)}
        className="border rounded px-3 py-2 w-full sm:w-64"
      />
      <button
        className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
        disabled={loading}
      >
        {loading ? "Shortening..." : "Shorten"}
      </button>
    </form>
  );
};

export default UrlForm;
