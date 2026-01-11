import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  fetchMyEvents,
  createEvent,
  fetchAttendees,
  exportAttendees
} from "../../api/events.api";
import CreateEventModal from "../../components/organizer/CreateEventModal";
import EventCard from "../../components/organizer/EventCard";
import AttendeesModal from "../../components/organizer/AttendeesModal";
import CheckinScanner from "../../components/organizer/CheckinScanner";

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", location: "", startDate: "", capacity: "" });

  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendees, setAttendees] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    fetchMyEvents()
      .then(res => setEvents(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowCreateModal(false);
      setFormData({ title: "", location: "", startDate: "", capacity: "" });
      loadEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const res = await fetchAttendees(eventId);

      // ✅ Updated: API already returns {name, email, checkedIn}, no need for ticket.user
      const mappedAttendees = res.data.map(a => ({
        id: a.id,
        name: a.name || "—",
        email: a.email || "—",
        checkedIn: a.checkedIn || false,
      }));

      setAttendees(mappedAttendees);
      setShowAttendeesModal(true);
    } catch (err) {
      console.error(err);
      alert("Failed to load attendees.");
    }
  };

  const handleExport = async (eventId, type) => {
    try {
      await exportAttendees(eventId, type);
      alert(`${type.toUpperCase()} exported successfully!`);
    } catch (err) {
      console.error(err);
      alert(`Failed to export ${type.toUpperCase()}`);
    }
  };

  return (
    <div className="p-8 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events</h1>
          <p className="text-gray-400 mt-1">Create, manage, and monitor your events</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-[#249E94] hover:bg-[#1f8b82] rounded-xl font-medium transition"
        >
          <PlusCircle size={18} /> Create Event
        </button>
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateSubmit}
      />

      {/* Events List */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">My Events</h2>
        {loading && <p className="text-gray-400">Loading events...</p>}
        {!loading && events.length === 0 && <p className="text-gray-400">No events created yet.</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map(event => (
            <EventCard
              key={event.id}
              event={event}
              onViewAttendees={handleViewAttendees}
              onExport={handleExport}
            />
          ))}
        </div>
      </div>

      {/* Attendees Modal */}
      <AttendeesModal
        show={showAttendeesModal}
        attendees={attendees}
        onClose={() => setShowAttendeesModal(false)}
      />

      {/* Check-in Scanner */}
      <CheckinScanner />
    </div>
  );
}
