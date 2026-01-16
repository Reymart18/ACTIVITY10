import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPublicEvents, fetchAllEvents, registerForEvent } from "../api/events.api";

const API_URL = "http://localhost:5000";

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", seatType: "standard" });
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadEvent();
  }, [id]);

  useEffect(() => {
    if (showRegisterForm && isLoggedIn) {
      const userInfo = getUserInfo();
      setFormData({
        name: userInfo.name || "",
        email: userInfo.email || "",
        company: "",
        seatType: "standard",
      });
      setIsEditingInfo(false);
    }
  }, [showRegisterForm, isLoggedIn]);

  const getUserInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return { name: user.name || "", email: user.email || "" };
    } catch {
      return { name: "", email: "" };
    }
  };

  const loadEvent = async () => {
    try {
      // Use authenticated endpoint if logged in to get isRegistered status
      const res = isLoggedIn ? await fetchAllEvents() : await fetchPublicEvents();
      const foundEvent = res.data.find(e => e.id === parseInt(id));
      setEvent(foundEvent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerForEvent(event.id, formData);
      alert("Registration successful!");
      setShowRegisterForm(false);
      loadEvent(); // Reload event data
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to register.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#249E94] mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl">
          <div className="text-6xl mb-4">😕</div>
          <p className="text-2xl text-gray-900 font-bold mb-2">Event not found</p>
          <p className="text-gray-600 mb-6">The event you're looking for doesn't exist</p>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-3 bg-[#249E94] text-white rounded-lg hover:bg-[#1f8b82] transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPastEvent = new Date(event.startDate) < new Date();
  const standardCount = event.tickets?.filter(t => t.seatType === 'standard').length || 0;
  const vipCount = event.tickets?.filter(t => t.seatType === 'vip').length || 0;
  const totalCapacity = (event.standardCapacity || 0) + (event.vipCapacity || 0);
  const totalBooked = standardCount + vipCount;
  const isFull = totalBooked >= totalCapacity;
  const isStandardFull = standardCount >= (event.standardCapacity || 0);
  const isVipFull = vipCount >= (event.vipCapacity || 0);

  return (
    <div className="min-h-screen pb-16 bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Hero Section with Event Poster */}
      <div className="relative h-[65vh] md:h-[75vh] overflow-hidden">
        <img
          src={event.poster ? `${API_URL}/uploads/posters/${event.poster}` : "/cover.png"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" />
        
        {/* Event Title Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="mb-6 px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all transform hover:scale-105 font-medium shadow-lg"
            >
              ← Back
            </button>
            <div className="animate-fadeIn">
              <h1 className="text-4xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
                {event.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-white">
                <span className="px-5 py-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium shadow-lg flex items-center gap-2 hover:bg-white/25 transition">
                  <span className="text-xl">📅</span>
                  {new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="px-5 py-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium shadow-lg flex items-center gap-2 hover:bg-white/25 transition">
                  <span className="text-xl">🕐</span>
                  {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="px-5 py-3 bg-white/15 backdrop-blur-md border border-white/20 rounded-xl font-medium shadow-lg flex items-center gap-2 hover:bg-white/25 transition">
                  <span className="text-xl">📍</span>
                  {event.location}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#249E94] to-[#1f8b82] rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  📝
                </div>
                <h2 className="text-3xl font-bold text-gray-900">About This Event</h2>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">
                {event.description || "No description available."}
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
                  ℹ️
                </div>
                <h3 className="text-3xl font-bold text-gray-900">Event Details</h3>
              </div>
              <div className="space-y-5">
                <div className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-bold text-gray-900 w-36 flex items-center gap-2">
                    <span className="text-xl">📆</span> Date & Time:
                  </span>
                  <span className="text-gray-700 font-medium">
                    {new Date(event.startDate).toLocaleString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                    {event.endDate && ` - ${new Date(event.endDate).toLocaleString('en-US', { 
                      hour: '2-digit',
                      minute: '2-digit'
                    })}`}
                  </span>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-bold text-gray-900 w-36 flex items-center gap-2">
                    <span className="text-xl">📍</span> Location:
                  </span>
                  <span className="text-gray-700 font-medium">{event.location}</span>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-bold text-gray-900 w-36 flex items-center gap-2">
                    <span className="text-xl">👥</span> Capacity:
                  </span>
                  <div className="flex-1 space-y-4">
                    {/* Standard Seats */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <span>🪑</span> Standard Seats
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {standardCount} / {event.standardCapacity || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#249E94] to-[#1f8b82] h-full rounded-full transition-all"
                          style={{ width: `${Math.min((standardCount / (event.standardCapacity || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    {/* VIP Seats */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 font-medium flex items-center gap-2">
                          <span>👑</span> VIP Seats
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {vipCount} / {event.vipCapacity || 0}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all"
                          style={{ width: `${Math.min((vipCount / (event.vipCapacity || 1)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="pt-2 border-t border-gray-300">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-900 font-bold">Total</span>
                        <span className="text-sm font-bold text-gray-900">
                          {totalBooked} / {totalCapacity}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                  <span className="font-bold text-gray-900 w-36 flex items-center gap-2">
                    <span className="text-xl">🎫</span> Status:
                  </span>
                  <span className={`font-bold px-4 py-1.5 rounded-lg text-sm ${
                    isPastEvent 
                      ? 'bg-gray-200 text-gray-600' 
                      : isFull 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {isPastEvent ? '⏰ Event Ended' : isFull ? '🔒 Full' : '✅ Open for Registration'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Registration Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-2xl shadow-2xl p-7 hover:shadow-3xl transition-all">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  {event.isRegistered ? '🎉 You\'re Registered!' : '🎟️ Register Now'}
                </h3>
                <div className="h-1 w-20 bg-gradient-to-r from-[#249E94] to-[#1f8b82] mx-auto rounded-full"></div>
              </div>

              {event.isRegistered ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 text-center transform hover:scale-105 transition">
                    <div className="text-4xl mb-2">✓</div>
                    <p className="text-green-800 font-bold text-xl mb-1">You're all set!</p>
                    <p className="text-green-700 text-sm">Check your email for your ticket</p>
                  </div>
                </div>
              ) : isPastEvent ? (
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">⏰</div>
                  <p className="text-gray-700 font-bold text-lg">This event has ended</p>
                </div>
              ) : isFull ? (
                <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 text-center">
                  <div className="text-4xl mb-2">🔒</div>
                  <p className="text-red-800 font-bold text-xl mb-1">Event is Full</p>
                  <p className="text-red-700 text-sm">No more spots available</p>
                </div>
              ) : !isLoggedIn ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-5 text-center">
                    <div className="text-3xl mb-2">🔐</div>
                    <p className="text-blue-700 font-medium text-sm">You need to be logged in to register for this event</p>
                  </div>
                  <button
                    onClick={() => navigate('/login', { state: { from: `/event/${event.id}` } })}
                    className="w-full bg-gradient-to-r from-[#249E94] to-[#1f8b82] hover:from-[#1f8b82] hover:to-[#249E94] text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                  >
                    🚀 Login to Register
                  </button>
                </div>
              ) : !showRegisterForm ? (
                <button
                  onClick={() => setShowRegisterForm(true)}
                  className="w-full bg-gradient-to-r from-[#249E94] to-[#1f8b82] hover:from-[#1f8b82] hover:to-[#249E94] text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl text-lg"
                >
                   Register for Event
                </button>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="✏️ Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      disabled={!isEditingInfo}
                      className="w-full p-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#249E94] focus:border-[#249E94] outline-none transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {!isEditingInfo && (
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#249E94] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f8b82] transition font-semibold"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="📧 Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      disabled={!isEditingInfo}
                      className="w-full p-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#249E94] focus:border-[#249E94] outline-none transition font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                    {!isEditingInfo && (
                      <button
                        type="button"
                        onClick={() => setIsEditingInfo(true)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs bg-[#249E94] text-white px-3 py-1.5 rounded-lg hover:bg-[#1f8b82] transition font-semibold"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="🏢 Company (Optional)"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full p-4 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-[#249E94] focus:border-[#249E94] outline-none transition font-medium"
                  />
                  
                  {/* Seat Type Selection */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-gray-900">🪑 Select Seat Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => !isStandardFull && setFormData({ ...formData, seatType: "standard" })}
                        disabled={isStandardFull}
                        className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                          isStandardFull
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            : formData.seatType === "standard"
                            ? "border-[#249E94] bg-[#249E94]/10 text-[#249E94] transform hover:scale-105"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 transform hover:scale-105"
                        }`}
                      >
                        <div className="text-2xl mb-1">🪑</div>
                        <div className="text-sm font-bold">Standard</div>
                        <div className="text-xs mt-1 opacity-80">
                          {isStandardFull ? "Seats Full" : "Regular Seating"}
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => !isVipFull && setFormData({ ...formData, seatType: "vip" })}
                        disabled={isVipFull}
                        className={`p-4 rounded-xl border-2 transition-all font-semibold ${
                          isVipFull
                            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                            : formData.seatType === "vip"
                            ? "border-amber-500 bg-amber-500/10 text-amber-600 transform hover:scale-105"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400 transform hover:scale-105"
                        }`}
                      >
                        <div className="text-2xl mb-1">👑</div>
                        <div className="text-sm font-bold">VIP</div>
                        <div className="text-xs mt-1 opacity-80">
                          {isVipFull ? "Seats Full" : "Premium Seating"}
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowRegisterForm(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all transform hover:scale-105 font-bold shadow-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-[#249E94] to-[#1f8b82] hover:from-[#1f8b82] hover:to-[#249E94] text-white rounded-xl transition-all transform hover:scale-105 font-bold shadow-lg"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-6 border-t-2 border-gray-200">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 text-center">
                  <p className="text-sm text-gray-600 font-medium">
                    💬 Questions? Contact the organizer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
