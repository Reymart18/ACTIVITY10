import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { fetchAllEvents, deleteEvent, registerForEvent } from "../../api/events.api";

import EventFilters from "../../components/admin/EventFilters";
import EventsGrid from "../../components/admin/EventsGrid";
import RegisterModal from "../../components/admin/RegisterModal";
import MessageBox from "../../components/messagebox/MessageBox";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  // Modal state
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [registeringEventId, setRegisteringEventId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", company: "" });

  // Message Box state
  const [message, setMessage] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const res = await fetchAllEvents();
      setEvents(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load events." });
    } finally {
      setLoading(false);
    }
  };

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => new Date(e.startDate) >= now);
  }, [events]);

  const filteredEvents = useMemo(() => {
    return upcomingEvents.filter(event => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.location.toLowerCase().includes(search.toLowerCase());

      const isFull = event.capacity && event.tickets?.length >= event.capacity;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "available" && !isFull) ||
        (statusFilter === "full" && isFull);

      const matchesDate =
        !dateFilter ||
        new Date(event.startDate).toISOString().slice(0, 10) === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [upcomingEvents, search, statusFilter, dateFilter]);

  // ✅ Delete using confirmation MessageBox
  const handleDelete = (id) => {
    // Set confirm action
    setConfirmAction(() => async () => {
      try {
        await deleteEvent(id);
        setEvents(prev => prev.filter(e => e.id !== id));
        setMessage({ type: "success", text: "Event deleted successfully!" });
      } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to delete event." });
      } finally {
        setConfirmAction(null);
      }
    });

    // Show confirm message box
    setMessage({
      type: "warning",
      text: "Delete this event permanently?",
      isConfirm: true,
    });
  };

  const openRegisterModal = (eventId) => {
    setRegisteringEventId(eventId);
    setFormData({ name: "", email: "", company: "" });
    setShowRegisterModal(true);
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setMessage({ type: "error", text: "Name and Email are required!" });
      return;
    }

    try {
      await registerForEvent(registeringEventId, formData);

      setEvents(prev =>
        prev.map(e =>
          e.id === registeringEventId ? { ...e, isRegistered: true } : e
        )
      );

      setShowRegisterModal(false);
      setMessage({ type: "success", text: "Registered successfully! Your QR ticket is now available." });
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to register for this event." });
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-white">Upcoming Events</h2>
        <p className="text-gray-300">
          View all upcoming events, search & filter, manage event details
        </p>
      </div>

      <EventFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
      />

      <EventsGrid
        events={filteredEvents}
        loading={loading}
        onDelete={handleDelete}
        onRegister={openRegisterModal}
      />

      {showRegisterModal && (
        <RegisterModal
          formData={formData}
          setFormData={setFormData}
          onClose={() => setShowRegisterModal(false)}
          onSubmit={handleRegisterSubmit}
        />
      )}

      {/* ✅ Message Box (toast & confirm) */}
      {message && (
        <MessageBox
          type={message.type}
          message={message.text}
          isConfirm={message.isConfirm}
          onClose={() => {
            setMessage(null);
            setConfirmAction(null);
          }}
          onConfirm={confirmAction}
        />
      )}
    </AdminLayout>
  );
}
