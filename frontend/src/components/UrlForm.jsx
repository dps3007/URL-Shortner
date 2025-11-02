import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const UrlForm = ({ onShortened }) => {
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/url/shorten", {
        target_url: url,   // ✅ must match schema
        code: code || undefined,
      });
      onShortened(res.data);
    } catch (err) {
      console.error("Shorten failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Failed to shorten URL");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="url"
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Custom short code (optional)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Shorten
      </button>
    </form>
  );
};

export default UrlForm;
