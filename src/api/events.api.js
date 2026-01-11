import axios from "axios";

const API_URL = "http://localhost:5000";

// Create a reusable axios instance with JWT interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ============================
// Attendee Endpoints
// ============================

// Fetch all events (used by attendees & admin)
export const fetchAllEvents = () => api.get("/events");

// Register for an event
export const registerForEvent = (eventId, data) =>
  api.post(`/events/${eventId}/register`, data);

// Cancel a registration
export const cancelRegistration = (eventId) =>
  api.delete(`/events/${eventId}/cancel`);

// Fetch tickets of logged-in attendee
export const fetchMyTickets = () => api.get("/tickets/my-tickets");

// ============================
// Organizer / Admin Endpoints
// ============================

// Fetch events created by the logged-in organizer
export const fetchMyEvents = () => api.get("/events/my-events");

// Create a new event
export const createEvent = (data) => api.post("/events", data);

// 🔴 DELETE EVENT (ADMIN)
export const deleteEvent = (eventId) =>
  api.delete(`/events/${eventId}`);

// 🟡 UPDATE / EDIT EVENT (ADMIN)
export const updateEvent = (eventId, data) =>
  api.put(`/events/${eventId}`, data);

// Fetch attendees for a specific event
export const fetchAttendees = (eventId) =>
  api.get(`/attendees/${eventId}`);

// Export attendees (CSV / PDF)
export const exportAttendees = (eventId, type) =>
  api.get(`/events/${eventId}/export`, {
    params: { type },
    responseType: "blob",
  });


// ============================
// ✅ CHECK-IN (QR SCAN)
// ============================

export const verifyCheckin = (referenceCode) =>
  api.post("/checkin/verify", { referenceCode });

// ============================
// Admin: Organizer Management
// ============================

// Fetch all organizers (for admin dropdown)
export const fetchOrganizers = () => api.get("/organizers");

// Fetch events by a specific organizer (for admin dashboard view)
export const fetchEventsByOrganizer = (organizerId) =>
  api.get(`/events/organizer/${organizerId}`);

export default api;
