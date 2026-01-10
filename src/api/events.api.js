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

// Fetch all events for attendees
export const fetchAllEvents = () => api.get("/events");

// Register for an event
export const registerForEvent = (eventId, data) =>
  api.post(`/events/${eventId}/register`, data);

// Fetch tickets of logged-in attendee
export const fetchMyTickets = () => api.get("/tickets/my-tickets");

// ============================
// Organizer Endpoints
// ============================

// Fetch events created by the logged-in organizer
export const fetchMyEvents = () => api.get("/events/my-events");

// Create a new event
export const createEvent = (data) => api.post("/events", data);

// Fetch attendees for a specific event
export const fetchAttendees = (eventId) => api.get(`/attendees/${eventId}`);

// Export attendees (CSV/Excel)
export const exportAttendees = (eventId, type) =>
  api.get(`/attendees/${eventId}/export`, {
    params: { type },
    responseType: "blob",
  });

// ============================
// ✅ CHECK-IN (QR SCAN)
// ============================

export const verifyCheckin = (referenceCode) =>
  api.post("/checkin/verify", { referenceCode });

export default api;
