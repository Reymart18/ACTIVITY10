import { useState, useEffect } from "react";
import api from "../../api/events.api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnnouncements();
    fetchOrganizerEvents();
  }, []);

  const fetchOrganizerEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/events/my-events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

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
    if (!selectedEventId) return setError("Please select an event.");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("message", message);
      formData.append("eventId", selectedEventId);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await api.post("/announcements", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setTitle("");
      setMessage("");
      setSelectedEventId("");
      setImageFile(null);
      setImagePreview(null);
      setShowForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to post announcement:", err);
      setError("Failed to post announcement");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
            ${showForm ? "bg-red-500 hover:bg-red-600" : "bg-pink-500 hover:bg-pink-600"} 
            text-white shadow-md`}
        >
          {showForm ? "Cancel" : "Create Announcement"}
        </button>
      </div>

      {/* Create Announcement Form */}
      {showForm && (
        <div className="mb-6 p-6 bg-gradient-to-br from-[#2D132C] to-[#1A1520] rounded-xl shadow-xl border border-white/10">
          {error && (
            <p className="text-red-400 mb-3 text-sm font-medium">{error}</p>
          )}
          <form
            onSubmit={handlePostAnnouncement}
            className="flex flex-col space-y-4"
          >
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Select Event *
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/5 text-gray-400 border border-white/20 outline-none focus:ring-2 focus:ring-pink-400 transition"
                required
              >
                <option value="">-- Choose an event --</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.title} ({new Date(event.startDate).toLocaleDateString()})
                  </option>
                ))}
              </select>
              <p className="text-gray-400 text-xs mt-1">
                This announcement will be sent to all registered attendees of the selected event
              </p>
            </div>
            <input
              type="text"
              placeholder="Announcement Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-3 rounded-lg bg-white/5 text-white border border-white/20 outline-none focus:ring-2 focus:ring-pink-400 transition"
              required
            />
            <textarea
              placeholder="Announcement Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-3 rounded-lg bg-white/5 text-white border border-white/20 outline-none focus:ring-2 focus:ring-pink-400 resize-none transition"
              rows={5}
              required
            />
            
            {/* Image Upload */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Announcement Image (Optional)
              </label>
              <div className="flex flex-col gap-3">
                <label className="cursor-pointer">
                  <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-white/5 text-gray-300 border border-white/20 hover:border-pink-400 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{imageFile ? "Change Image" : "Choose Image"}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg border border-white/20"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-400 text-xs mt-1">
                Max file size: 5MB. Supported formats: JPG, PNG, GIF
              </p>
            </div>

            <button
              type="submit"
              className="px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow-md transition"
            >
              Post Announcement & Send Emails
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
                className="p-5 bg-gradient-to-br from-[#2D132C] to-[#1A1520] text-white rounded-2xl shadow-lg border border-white/10 hover:scale-[1.02] transition-transform duration-200"
              >
                {item.event && (
                  <div className="mb-2 px-3 py-1 bg-pink-500 text-white text-xs font-semibold rounded-full inline-block">
                    📅 {item.event.title}
                  </div>
                )}
                {item.image && (
                  <img
                    src={`http://localhost:5000/uploads/announcements/${item.image}`}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-lg mb-3 border border-white/10"
                  />
                )}
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
