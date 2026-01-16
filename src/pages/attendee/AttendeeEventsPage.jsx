import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Calendar, Sparkles, Clock } from "lucide-react";
import EventCard from "./EventCard";
import Modal from "../../components/common/Modal";
import { fetchAllEvents, registerForEvent, cancelRegistration } from "../../api/events.api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function EventCarousel({ title, items, onRegister, onCancel, showDivider = false }) {
  const swiperRef = useRef(null);
  const [ghostIdx, setGhostIdx] = useState(0);

  if (!items || items.length === 0) return null;

  const isUpcoming = title === "Upcoming Events";

  const updateGhost = (swiper) => {
    if (!items?.length) return;
    const spv =
      typeof swiper.params.slidesPerView === "number"
        ? swiper.params.slidesPerView
        : 1.5;
    const fullVisible = Math.floor(spv);
    const base = swiper.realIndex ?? 0;
    setGhostIdx((base + fullVisible) % items.length);
  };

  return (
    <>
      {/* Title with decorative elements */}
      <div className="text-center mb-12 relative">
        <div className="flex items-center justify-center gap-4 mb-4">
          {isUpcoming ? (
            <Sparkles className="text-[#249E94] animate-pulse" size={36} />
          ) : (
            <Clock className="text-gray-600" size={36} />
          )}
          <h2 
            className="text-transparent bg-clip-text bg-gradient-to-r from-[#249E94] to-[#1f8b82] leading-[1.2]"
            style={{ fontWeight: 800, fontSize: "52px" }}
          >
            {title}
          </h2>
          {isUpcoming ? (
            <Sparkles className="text-[#249E94] animate-pulse" size={36} />
          ) : (
            <Clock className="text-gray-600" size={36} />
          )}
        </div>
        <p className="text-gray-600 text-lg">
          {isUpcoming 
            ? "Discover amazing events happening soon" 
            : "Relive the moments from past events"}
        </p>
      </div>

      {/* Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={300}
        slidesPerView={1.5}
        loop={items.length >= 5}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          updateGhost(swiper);
          swiper.on("breakpoint", () => updateGhost(swiper));
        }}
        onSlideChange={(swiper) => updateGhost(swiper)}
        breakpoints={{
          640: { slidesPerView: 1.5 },
          768: { slidesPerView: 2.5 },
          1024: { slidesPerView: 3.5 },
          1280: { slidesPerView: 4.5 },
        }}
      >
        {items.map((event) => (
          <SwiperSlide key={event.id} className="flex justify-center items-end">
            <div className="w-[90%] sm:w-[300px] mx-3 sm:mx-4 lg:mx-6">
              <EventCard
                event={event}
                onRegister={() => onRegister(event)}
                onCancel={() => onCancel(event.id)}
                isPastEvent={title === "Recent Events"}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Divider */}
      {showDivider && (
        <div
          className="mx-auto mt-20 mb-28"
          style={{
            width: "1812px",
            maxWidth: "100%",
            border: "0.1px solid #90A3BF",
          }}
        />
      )}
    </>
  );
}

export default function AttendeeEventsPage() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "", seatType: "standard" });
  const [isEditingInfo, setIsEditingInfo] = useState(false);

  // Get user info from localStorage
  const getUserInfo = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Load all events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      const now = new Date();
      const events = res.data;

      // Separate upcoming and recent events
      const upcoming = events.filter(e => new Date(e.startDate) >= now);
      const recent = events.filter(e => new Date(e.startDate) < now);

      setUpcomingEvents(upcoming);
      setRecentEvents(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Navigate to event details page
  const handleRegisterClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  // Cancel registration
  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;

    try {
      await cancelRegistration(eventId);

      // Update both upcoming and recent events
      setUpcomingEvents(prev =>
        prev.map(ev =>
          ev.id === eventId
            ? { ...ev, isRegistered: false, tickets: [] }
            : ev
        )
      );
      setRecentEvents(prev =>
        prev.map(ev =>
          ev.id === eventId
            ? { ...ev, isRegistered: false, tickets: [] }
            : ev
        )
      );
      alert("Registration canceled.");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to cancel registration.");
    }
  };

  // Submit registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent?.id) return;

    try {
      await registerForEvent(selectedEvent.id, formData);
      alert("Registration successful!");
      setShowRegisterModal(false);

      // Update events state immediately
      setUpcomingEvents(prev =>
        prev.map(ev =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                isRegistered: true,
                tickets: [...(ev.tickets || []), { checkedIn: false }],
              }
            : ev
        )
      );
      setRecentEvents(prev =>
        prev.map(ev =>
          ev.id === selectedEvent.id
            ? {
                ...ev,
                isRegistered: true,
                tickets: [...(ev.tickets || []), { checkedIn: false }],
              }
            : ev
        )
      );
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to register.");
    }
  };

  return (
    <section className="relative w-full min-h-screen pt-20 pb-16">
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-900 text-2xl">Loading events...</p>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          {upcomingEvents.length > 0 && (
            <EventCarousel
              title="Upcoming Events"
              items={upcomingEvents}
              onRegister={handleRegisterClick}
              onCancel={handleCancelRegistration}
              showDivider={recentEvents.length > 0}
            />
          )}

          {recentEvents.length > 0 && (
            <div className="mt-24">
              <EventCarousel
                title="Recent Events"
                items={recentEvents}
                onRegister={handleRegisterClick}
                onCancel={handleCancelRegistration}
              />
            </div>
          )}

          {upcomingEvents.length === 0 && recentEvents.length === 0 && (
            <div className="text-center py-20">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">No Events Available</h2>
              <p className="text-gray-600">Check back later for upcoming events!</p>
            </div>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <Modal
          onClose={() => setShowRegisterModal(false)}
          className="bg-white text-gray-900 border border-gray-200"
        >
          <h3 className="text-2xl font-bold mb-4 text-gray-900">
            Register for {selectedEvent.title}
          </h3>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {(() => {
              const standardCount = selectedEvent.tickets?.filter(t => t.seatType === 'standard').length || 0;
              const vipCount = selectedEvent.tickets?.filter(t => t.seatType === 'vip').length || 0;
              const isStandardFull = standardCount >= (selectedEvent.standardCapacity || 0);
              const isVipFull = vipCount >= (selectedEvent.vipCapacity || 0);

              return (
                <>
                  <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Full Name</label>
                <button
                  type="button"
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="text-sm text-[#249E94] hover:text-[#1f8b82] font-medium"
                >
                  {isEditingInfo ? "Lock" : "Edit"}
                </button>
              </div>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                disabled={!isEditingInfo}
                className={`w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#249E94] outline-none ${
                  !isEditingInfo ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">Email</label>
              </div>
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled={!isEditingInfo}
                className={`w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#249E94] outline-none ${
                  !isEditingInfo ? 'bg-gray-50 cursor-not-allowed' : ''
                }`}
              />
            </div>

            <input
              type="text"
              placeholder="Company (Optional)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-3 rounded-lg border border-gray-300 bg-white text-gray-900 focus:ring-2 focus:ring-[#249E94] outline-none"
            />

            {/* Seat Type Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">🪑 Select Seat Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => !isStandardFull && setFormData({ ...formData, seatType: "standard" })}
                  disabled={isStandardFull}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                    isStandardFull
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                      : formData.seatType === "standard"
                      ? "border-[#249E94] bg-[#249E94]/10 text-[#249E94]"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xl mb-1">🪑</div>
                  <div className="text-xs font-bold">Standard</div>
                  <div className="text-xs opacity-70">
                    {isStandardFull ? "Seats Full" : "Regular Seating"}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => !isVipFull && setFormData({ ...formData, seatType: "vip" })}
                  disabled={isVipFull}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                    isVipFull
                      ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                      : formData.seatType === "vip"
                      ? "border-amber-500 bg-amber-500/10 text-amber-600"
                      : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                  }`}
                >
                  <div className="text-xl mb-1">👑</div>
                  <div className="text-xs font-bold">VIP</div>
                  <div className="text-xs opacity-70">
                    {isVipFull ? "Seats Full" : "Premium Seating"}
                  </div>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#249E94] hover:bg-[#1f8b82] p-3 rounded-lg font-semibold text-white transition"
            >
              Register
            </button>
                </>
              );
            })()}
          </form>
        </Modal>
      )}
    </section>
  );
}
