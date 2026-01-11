import { useState, useEffect } from "react";
import api from "../../api/events.api"; // your axios instance

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch announcements on mount
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/announcements", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <h1 className="text-3xl font-bold text-white mb-6">Announcements</h1>

      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-gray-300">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-400">No announcements yet.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="p-4 bg-[#1E2A5F] text-white rounded-xl shadow-md"
              >
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="text-gray-300 mt-1">{item.message}</p>
                <p className="text-gray-400 text-sm mt-1">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
