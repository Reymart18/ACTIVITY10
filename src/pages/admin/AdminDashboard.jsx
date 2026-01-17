import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { CalendarDays, LayoutDashboard, Users } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import EventCard from "../attendee/EventCard";
import { fetchAllEvents, cancelRegistration, fetchOrganizers, fetchEventsByOrganizer } from "../../api/events.api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function EventCarousel({ title, items, onRegister, onCancel, showDivider = false }) {
  const swiperRef = useRef(null);

  if (!items || items.length === 0) return null;

  return (
    <>
      {/* Title */}
      <h2
        className="text-gray-900 text-center mb-12 leading-[1.2]"
        style={{ fontWeight: 800, fontSize: "52px" }}
      >
        {title}
      </h2>

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
        }}
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

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [ongoingEvents, setOngoingEvents] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Organizer selector state
  const [organizers, setOrganizers] = useState([]);
  const [selectedOrganizer, setSelectedOrganizer] = useState("all");
  const [organizerEvents, setOrganizerEvents] = useState([]);

  // Load organizers and initial events on mount
  useEffect(() => {
    loadOrganizers();
    loadEvents();
  }, []);

  // Auto-update current time every second to move events between sections immediately
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  const loadOrganizers = async () => {
    try {
      const res = await fetchOrganizers();
      setOrganizers(res.data);
    } catch (err) {
      console.error("Failed to load organizers:", err);
    }
  };

  // Load events when organizer selection changes
  useEffect(() => {
    if (selectedOrganizer !== "all") {
      loadOrganizerEvents(selectedOrganizer);
    }
  }, [selectedOrganizer]);

  const loadOrganizerEvents = async (organizerId) => {
    setLoading(true);
    try {
      const res = await fetchEventsByOrganizer(organizerId);
      setOrganizerEvents(res.data);
    } catch (err) {
      console.error("Failed to load organizer events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load all events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      const events = res.data;

      // Separate upcoming, ongoing, and recent events
      const upcoming = events.filter(e => new Date(e.startDate) > currentTime);
      const ongoing = events.filter(e => {
        const startDate = new Date(e.startDate);
        const endDate = new Date(e.endDate);
        return startDate <= currentTime && endDate >= currentTime;
      });
      const recent = events.filter(e => new Date(e.endDate) < currentTime);

      setUpcomingEvents(upcoming);
      setOngoingEvents(ongoing);
      setRecentEvents(recent);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Navigate to event details page
  const handleRegisterClick = (event) => {
    navigate(`/event/${event.id}`);
  };

  // Cancel registration
  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;

    try {
      await cancelRegistration(eventId);

      // Update upcoming, ongoing, and recent events
      setUpcomingEvents(prev =>
        prev.map(ev =>
          ev.id === eventId
            ? { ...ev, isRegistered: false, tickets: [] }
            : ev
        )
      );
      setOngoingEvents(prev =>
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

  return (
    <AdminLayout>
      <section className="relative w-full min-h-screen pt-8 pb-16">
        {/* Organizer Selector */}
        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-8">
          <div className="flex items-center gap-4">
            <label className="text-white font-semibold text-lg">View Dashboard:</label>
            <select
              value={selectedOrganizer}
              onChange={(e) => setSelectedOrganizer(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            >
              <option value="all" className="bg-[#161E54]">All Events</option>
              {organizers.map((org) => (
                <option key={org.id} value={org.id} className="bg-[#161E54]">
                  {org.name} Dashboard
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dashboard Cards */}
        {selectedOrganizer !== "all" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12">
            <DashboardCards events={organizerEvents} />
          </div>
        )}

        {selectedOrganizer === "all" && (
          <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12">
            <GlobalDashboardCards 
              upcomingEvents={upcomingEvents}
              ongoingEvents={ongoingEvents}
              allEvents={[...upcomingEvents, ...ongoingEvents, ...recentEvents]} 
            />
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <p className="text-gray-900 text-2xl">Loading events...</p>
          </div>
        ) : selectedOrganizer === "all" ? (
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            {upcomingEvents.length > 0 && (
              <EventCarousel
                title="Upcoming Events"
                items={upcomingEvents}
                onRegister={handleRegisterClick}
                onCancel={handleCancelRegistration}
                showDivider={ongoingEvents.length > 0 || recentEvents.length > 0}
              />
            )}

            {ongoingEvents.length > 0 && (
              <div className="mt-24">
                <EventCarousel
                  title="Ongoing Events"
                  items={ongoingEvents}
                  onRegister={handleRegisterClick}
                  onCancel={handleCancelRegistration}
                  showDivider={recentEvents.length > 0}
                />
              </div>
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

            {upcomingEvents.length === 0 && ongoingEvents.length === 0 && recentEvents.length === 0 && (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">No Events Available</h2>
                <p className="text-gray-600">Check back later for upcoming events!</p>
              </div>
            )}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-6 sm:px-10">
            {organizerEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {organizerEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onRegister={() => handleRegisterClick(event)}
                    onCancel={() => handleCancelRegistration(event.id)}
                    isPastEvent={new Date(event.startDate) < new Date()}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">No Events</h2>
                <p className="text-gray-600">This organizer has not created any events yet.</p>
              </div>
            )}
          </div>
        )}
      </section>
    </AdminLayout>
  );
}

// Dashboard Cards for specific organizer
function DashboardCards({ events }) {
  const allEvents = events || [];
  const now = new Date();

  const upcomingEvents = allEvents.filter(event => new Date(event.startDate) >= now).length;
  const totalEvents = allEvents.length;
  const highestAttendees = allEvents.reduce((max, event) => {
    const checkedInCount = event.tickets?.filter(t => t.checkedIn).length || 0;
    return Math.max(max, checkedInCount);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Upcoming Events</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{upcomingEvents}</h2>
          </div>
          <div className="bg-[#249E94]/20 p-4 rounded-xl">
            <CalendarDays className="text-[#249E94]" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Events scheduled ahead</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Events</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{totalEvents}</h2>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-xl">
            <LayoutDashboard className="text-blue-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">All events created</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Highest Attendees</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{highestAttendees.toLocaleString()}</h2>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-xl">
            <Users className="text-purple-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Peak event attendance</p>
      </div>
    </div>
  );
}

// Global Dashboard Cards for all events
function GlobalDashboardCards({ upcomingEvents, ongoingEvents, allEvents }) {
  const upcomingCount = upcomingEvents.length;
  const ongoingCount = ongoingEvents.length;
  const totalEvents = allEvents.length;
  const highestAttendees = allEvents.reduce((max, event) => {
    const checkedInCount = event.tickets?.filter(t => t.checkedIn).length || 0;
    return Math.max(max, checkedInCount);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Upcoming Events</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{upcomingCount}</h2>
          </div>
          <div className="bg-[#249E94]/20 p-4 rounded-xl">
            <CalendarDays className="text-[#249E94]" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Scheduled ahead</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Ongoing Events</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{ongoingCount}</h2>
          </div>
          <div className="bg-orange-500/20 p-4 rounded-xl">
            <CalendarDays className="text-orange-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Currently happening</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Total Events</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{totalEvents}</h2>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-xl">
            <LayoutDashboard className="text-blue-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Platform-wide events</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Highest Attendees</p>
            <h2 className="text-4xl font-bold mt-2 text-white">{highestAttendees.toLocaleString()}</h2>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-xl">
            <Users className="text-purple-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Peak event attendance</p>
      </div>
    </div>
  );
}
