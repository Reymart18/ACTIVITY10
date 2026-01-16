import { useEffect, useState } from "react";
import { PlusCircle } from "lucide-react";
import {
  fetchMyEvents,
  createEvent,
  updateEvent,
  fetchAttendees,
  exportAttendees
} from "../../api/events.api";
import CreateEventModal from "../../components/organizer/CreateEventModal";
import EventCard from "../../components/organizer/EventCard";
import AttendeesModal from "../../components/organizer/AttendeesModal";
import MessageBox from "../../components/messagebox/MessageBox";

export default function OrganizerEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "", location: "", startDate: "", endDate: "", standardCapacity: "", vipCapacity: "", poster: null });

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
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description || '');
      data.append('location', formData.location);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('standardCapacity', formData.standardCapacity);
      data.append('vipCapacity', formData.vipCapacity);
      if (formData.poster) {
        data.append('poster', formData.poster);
      }
      
      if (editingEvent) {
        // Update existing event
        await updateEvent(editingEvent.id, data);
        setMessage({ type: "success", text: "Event updated successfully!" });
      } else {
        // Create new event
        await createEvent(data);
        setMessage({ type: "success", text: "Event created successfully!" });
      }
      
      setShowCreateModal(false);
      setEditingEvent(null);
      setFormData({ title: "", description: "", location: "", startDate: "", endDate: "", standardCapacity: "", vipCapacity: "", poster: null });
      loadEvents();
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: editingEvent ? "Failed to update event." : "Failed to create event." });
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      standardCapacity: event.standardCapacity || "",
      vipCapacity: event.vipCapacity || "",
      poster: null,
    });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingEvent(null);
    setFormData({ title: "", description: "", location: "", startDate: "", endDate: "", standardCapacity: "", vipCapacity: "", poster: null });
  };

  const handleViewAttendees = async (eventId) => {
    try {
      const res = await fetchAttendees(eventId);
      const mappedAttendees = res.data.map(a => ({
        id: a.id,
        name: a.name || "—",
        email: a.email || "—",
        checkedIn: a.checkedIn || false,
        seatType: a.seatType || "standard",
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

  // Separate events into upcoming and recent
  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.startDate) >= now);
  const recentEvents = events.filter(e => new Date(e.startDate) < now);

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
        onClose={handleCloseModal}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleCreateSubmit}
        isEditing={!!editingEvent}
      />

      {/* Events List */}
      <div className="space-y-10">
        {loading && <p className="text-gray-400">Loading events...</p>}
        {!loading && events.length === 0 && <p className="text-gray-400">No events created yet.</p>}

        {/* Upcoming Events */}
        {!loading && upcomingEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-[#249E94]">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewAttendees={handleViewAttendees}
                  onExport={handleExport}
                  onEdit={handleEditEvent}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recent Events */}
        {!loading && recentEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-400">Recent Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {recentEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  onViewAttendees={handleViewAttendees}
                  onExport={handleExport}
                  onEdit={handleEditEvent}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Attendees Modal */}
      <AttendeesModal
        show={showAttendeesModal}
        attendees={attendees}
        onClose={() => setShowAttendeesModal(false)}
      />

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
