import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import Modal from "../../components/common/Modal";
import { fetchAllEvents, registerForEvent, cancelRegistration } from "../../api/events.api";

export default function AttendeeEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  // Load all events
  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchAllEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Open registration modal
  const handleRegisterClick = (event) => {
    if (event.isRegistered) return;

    if (event.capacity && event.tickets?.length >= event.capacity) {
      alert("This event is full!");
      return;
    }

    setSelectedEvent(event);
    setShowRegisterModal(true);
    setFormData({ name: "", email: "", company: "" });
  };

  // Cancel registration
  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?")) return;

    try {
      await cancelRegistration(eventId);

      setEvents(prev =>
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
      setEvents(prev =>
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
    <div className="p-8 font-poppins text-white min-h-screen bg-[#161E54]">
      <h2 className="text-2xl font-bold mb-6">Available Events</h2>

      {loading ? (
        <p className="text-gray-300">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-400">No events available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onRegister={() => handleRegisterClick(event)}
              onCancel={() => handleCancelRegistration(event.id)}
            />
          ))}
        </div>
      )}

      {/* Registration Modal */}
      {showRegisterModal && selectedEvent && (
        <Modal
          onClose={() => setShowRegisterModal(false)}
          className="bg-[#1E2A5F] text-white border border-white/20"
        >
          <h3 className="text-2xl font-bold mb-4">
            Register for {selectedEvent.title}
          </h3>

          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E]"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E]"
            />
            <input
              type="text"
              placeholder="Company (Optional)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E]"
            />

            <button
              type="submit"
              className="w-full bg-[#249E94] hover:bg-[#1f8b82] p-3 rounded-lg font-semibold"
            >
              Register
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
