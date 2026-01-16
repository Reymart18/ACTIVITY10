import { useState, useEffect } from "react";
import { Bell, Calendar, Megaphone, Sparkles } from "lucide-react";
import api from "../../api/events.api";

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all, recent, older

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

  const getFilteredAnnouncements = () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    if (filter === "recent") {
      return announcements.filter(a => new Date(a.createdAt) >= threeDaysAgo);
    } else if (filter === "older") {
      return announcements.filter(a => new Date(a.createdAt) < threeDaysAgo);
    }
    return announcements;
  };

  const filteredAnnouncements = getFilteredAnnouncements();

  return (
    <div className="flex flex-col h-full">
      {/* Header Section */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg shadow-lg">
            <Megaphone className="text-white" size={28} />
          </div>
          <h1 className="text-4xl font-extrabold text-white">
            Announcements
          </h1>
          <Sparkles className="text-pink-400 animate-pulse" size={24} />
        </div>
        <p className="text-gray-300 ml-14">Stay updated with the latest news from your events</p>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-4 ml-14">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "all"
                ? "bg-pink-500 text-white shadow-md"
                : "text-white hover:bg-white/10 border border-gray-500"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("recent")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "recent"
                ? "bg-pink-500 text-white shadow-md"
                : "text-white hover:bg-white/10 border border-gray-500"
            }`}
          >
            Recent (3 days)
          </button>
          <button
            onClick={() => setFilter("older")}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              filter === "older"
                ? "bg-pink-500 text-white shadow-md"
                : "text-white hover:bg-white/10 border border-gray-500"
            }`}
          >
            Older
          </button>
        </div>
      </div>

      {/* Announcements List */}
      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <Bell className="text-pink-400 animate-bounce" size={48} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
            <p className="text-gray-300 mt-4 text-lg font-medium">Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl shadow-lg border border-gray-100">
            <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-4">
              <Bell className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Announcements Yet</h3>
            <p className="text-gray-300 text-center max-w-md">
              {filter === "all" 
                ? "There are no announcements at the moment. Check back later for updates!"
                : `No ${filter} announcements found. Try a different filter.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAnnouncements.map((item) => {
              const isRecent = new Date(item.createdAt) >= new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
              
              return (
                <div
                  key={item.id}
                  className="group rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-600 hover:border-pink-500/50 relative bg-gradient-to-br from-[#2D132C] to-[#1A1520]"
                >
                  {/* New Badge */}
                  {isRecent && (
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-3 py-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-lg animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}

                  {/* Event Badge */}
                  {item.event && (
                    <div className="p-4 bg-gradient-to-r from-pink-500/10 to-pink-600/10 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <Calendar className="text-pink-400" size={16} />
                        <span className="text-sm font-semibold text-pink-400">
                          {item.event.title}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Image */}
                  {item.image && (
                    <div className="relative overflow-hidden">
                      <img
                        src={`http://localhost:5000/uploads/announcements/${item.image}`}
                        alt={item.title}
                        className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h2 className="font-bold text-2xl text-white mb-3 group-hover:text-pink-400 transition-colors">
                      {item.title}
                    </h2>
                    <p className="text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                      {item.message}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <Bell size={16} />
                        <span>Posted</span>
                      </div>
                      <span className="text-sm font-medium text-gray-300">
                        {new Date(item.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
