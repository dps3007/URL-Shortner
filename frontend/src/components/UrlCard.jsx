import React, { useState } from "react";
import { FiCopy, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import QRCode from "react-qr-code";
import {BACKEND_URL} from "../api/axiosInstance.js"

const UrlCard = ({ url, onDelete }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const shortUrl = `${BACKEND_URL}/url/codes/${url.code}`;
  const longUrl = url.longUrl || url.target_url || "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this URL?")) return;

    const token = localStorage.getItem("token");
    if (!token) return toast.error("You must be logged in");

    try {
      setDeleting(true);
      const res = await fetch(`${BACKEND_URL}/url/codes/${url.code}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");

      toast.success("Deleted successfully");
      onDelete?.(url.code); // notify parent (Dashboard)
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="border rounded p-3 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex-1">
        <a
          href={shortUrl}
          target="_blank"
          rel="noreferrer"
          className="text-sky-600 font-medium break-all"
        >
          {shortUrl}
        </a>
        <p className="text-sm text-gray-600 mt-1 break-all">{longUrl}</p>
        <div className="text-xs text-gray-500 mt-2">
          Created:{" "}
          {new Date(url.createdAt || url.created_at || Date.now()).toLocaleString()}
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <button
          onClick={handleCopy}
          className="px-2 py-1 border rounded flex items-center gap-2 hover:bg-gray-100 transition"
        >
          <FiCopy /> {copied ? "Copied" : "Copy"}
        </button>

        <div className="bg-white p-2 rounded border">
          <QRCode value={shortUrl} size={64} />
        </div>

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="mt-2 px-2 py-1 border border-red-500 text-red-500 rounded flex items-center gap-2 hover:bg-red-50 transition disabled:opacity-50"
        >
          <FiTrash2 /> {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default UrlCard;
