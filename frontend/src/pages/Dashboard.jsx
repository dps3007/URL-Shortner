import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import UrlCard from "../components/UrlCard";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all URLs for the logged-in user
  const fetchUrls = async () => {
    try {
      const res = await axiosInstance.get("/url/codes");
      setUrls(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  // Delete handler (called when UrlCard triggers onDelete)
  const handleDelete = (deletedCode) => {
    setUrls((prev) => prev.filter((url) => url.code !== deletedCode));
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-semibold mb-2">My Dashboard</h1>
        <p className="text-gray-600 mb-6">
          View all your shortened URLs and basic analytics.
        </p>

        {loading ? (
          <p className="text-gray-500">Loading URLs...</p>
        ) : urls.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            You haven’t shortened any URLs yet.
          </div>
        ) : (
          <div className="grid gap-4">
            {urls.map((url) => (
              <UrlCard key={url.id || url.code} url={url} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
