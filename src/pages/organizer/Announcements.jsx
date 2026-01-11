import { useState, useEffect } from "react";
import api from "../../api/events.api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    setError("");
    if (!title || !message) return setError("Title and message are required.");

    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/announcements",
        { title, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle("");
      setMessage("");
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to post announcement:", err);
      setError("Failed to post announcement");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white tracking-wide">
          Announcements
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`px-5 py-2 font-semibold rounded-lg transition 
            ${showForm ? "bg-red-500 hover:bg-red-600" : "bg-[#249E94] hover:bg-[#1f8b82]"} 
            text-white shadow-md`}
        >
          {showForm ? "Cancel" : "Create Announcement"}
        </button>
      </div>

      {/* Create Announcement Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-gradient-to-r from-[#1F274A] to-[#1E2A5F] rounded-xl shadow-xl border border-white/10">
          {error && (
            <p className="text-red-400 mb-3 text-sm font-medium">{error}</p>
          )}
          <form
            onSubmit={handlePostAnnouncement}
            className="flex flex-col space-y-4"
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg bg-[#272C3E] text-white border border-white/20 outline-none focus:ring-2 focus:ring-[#249E94] transition"
              required
            />
            <textarea
              placeholder="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 rounded-lg bg-[#272C3E] text-white border border-white/20 outline-none focus:ring-2 focus:ring-[#249E94] resize-none transition"
              rows={5}
              required
            />
            <button
              type="submit"
              className="px-5 py-2 bg-[#249E94] hover:bg-[#1f8b82] text-white font-semibold rounded-lg shadow-md transition"
            >
              Post Announcement
            </button>
          </form>
        </div>
      )}

      {/* Announcement List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {loading ? (
          <p className="text-gray-300 text-center mt-6">Loading announcements...</p>
        ) : announcements.length === 0 ? (
          <p className="text-gray-400 text-center mt-6">No announcements yet.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {announcements.map((item) => (
              <li
                key={item.id}
                className="p-5 bg-gradient-to-r from-[#1F274A] to-[#1E2A5F] text-white rounded-2xl shadow-lg border border-white/10 hover:scale-[1.02] transition-transform duration-200"
              >
                <h2 className="font-bold text-xl mb-2">{item.title}</h2>
                <p className="text-gray-300">{item.message}</p>
                <p className="text-gray-400 text-sm mt-3 text-right">
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
