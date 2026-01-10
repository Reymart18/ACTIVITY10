import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import MyTicketCard from "./MyTicketCard";
import Modal from "../../components/common/Modal";
import { fetchAllEvents, registerForEvent, fetchMyTickets } from "../../api/events.api";

export default function AttendeeLandingPage() {
  const [events, setEvents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  useEffect(() => {
    loadEvents();
    loadTickets();
  }, []);

  const loadEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await fetchAllEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingEvents(false);
    }
  };

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetchMyTickets();
      setTickets(res.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleRegisterClick = (event) => {
    if (event.capacity && event.tickets?.length >= event.capacity) {
      alert("This event is full!");
      return;
    }
    setSelectedEvent(event);
    setShowRegisterModal(true);
    setFormData({ name: "", email: "", company: "" });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEvent?.id) {
      alert("No event selected!");
      return;
    }
    try {
      await registerForEvent(selectedEvent.id, formData);
      alert("Registration successful!");
      setShowRegisterModal(false);
      loadTickets();
    } catch (err) {
      console.error(err.response || err);
      alert(err.response?.data?.message || "Failed to register.");
    }
  };

  return (
    <div className="min-h-screen bg-[#161E54] p-8 font-poppins text-white">
      <h1 className="text-3xl font-bold mb-8">Welcome to Your Events Dashboard</h1>

      {/* Events Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Available Events</h2>
        {loadingEvents ? (
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
                dark
              />
            ))}
          </div>
        )}
      </section>

      {/* Tickets Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">My Tickets</h2>
        {loadingTickets ? (
          <p className="text-gray-300">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-400">You have not registered for any events yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <MyTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>

      {/* Registration Modal */}
      {showRegisterModal && (
        <Modal onClose={() => setShowRegisterModal(false)} className="bg-[#1E2A5F] text-white border border-white/20">
          <h3 className="text-2xl font-bold mb-4">Register for {selectedEvent.title}</h3>
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#249E94] outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#249E94] outline-none"
            />
            <input
              type="text"
              placeholder="Company (Optional)"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full p-3 rounded-lg border border-white/20 bg-[#272C3E] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#249E94] outline-none"
            />
            <button
              type="submit"
              className="w-full bg-[#249E94] hover:bg-[#1f8b82] text-white p-3 rounded-lg font-semibold transition"
            >
              Register
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
}
