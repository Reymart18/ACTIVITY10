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
import MessageBox from "../../components/messagebox/MessageBox";

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", location: "", startDate: "", capacity: "" });

  const [showAttendeesModal, setShowAttendeesModal] = useState(false);
  const [attendees, setAttendees] = useState([]);

  const [message, setMessage] = useState(null); // ✅ message state

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    fetchMyEvents()
      .then(res => setEvents(res.data))
      .catch(err => setMessage({ type: "error", text: "Failed to load events." }))
      .finally(() => setLoading(false));
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowCreateModal(false);
      setFormData({ title: "", location: "", startDate: "", capacity: "" });
      loadEvents();
      setMessage({ type: "success", text: "Event created successfully!" });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to create event." });
    }
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const res = await fetchAttendees(eventId);
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
      setMessage({ type: "error", text: "Failed to load attendees." });
    }
  };

  const handleExport = async (eventId, type) => {
    try {
      const res = await exportAttendees(eventId, type, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${eventId}_attendees.${type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      setMessage({ type: "success", text: `${type.toUpperCase()} exported successfully!` });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: `Failed to export ${type.toUpperCase()}` });
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

      {/* ✅ Message Box */}
      {message && (
        <MessageBox
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
    </div>
  );
}
