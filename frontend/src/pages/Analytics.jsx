import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function UrlAnalytics() {
  const { code } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/urls/${code}/analytics`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, [code]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">
        Analytics for <span className="text-blue-600">{code}</span>
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No analytics data found.</p>
      ) : (
        <div className="grid gap-4">
          {data.map((a) => (
            <div
              key={a.id}
              className="border p-4 rounded-xl bg-white shadow-sm hover:shadow-md transition"
            >
              <p><b>Country:</b> {a.country || "—"}</p>
              <p><b>City:</b> {a.city || "—"}</p>
              <p><b>Browser:</b> {a.browser || "—"}</p>
              <p><b>OS:</b> {a.os || "—"}</p>
              <p><b>Device:</b> {a.deviceType || "—"}</p>
              <p><b>Visited At:</b> {new Date(a.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
