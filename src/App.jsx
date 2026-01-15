import { Routes, Route } from "react-router-dom";

// Public
import BlogLanding from "./pages/BlogLanding";
import GuestExploreEvents from "./pages/GuestExploreEvents"; 

// Auth
import Login from "./pages/Login";
import Register from "./pages/Register";

// Admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import MyTickets from "./pages/admin/MyTickets";
import ManageStaff from "./pages/admin/ManageStaff";
import Reports from "./pages/admin/Reports";

// Organizer
import OrganizerDashboardLayout from "./components/layout/OrganizerDashboardLayout";
import Dashboard from "./pages/organizer/Dashboard";
import OrganizerEvents from "./pages/organizer/OrganizerEvents";
import Announcements from "./pages/organizer/Announcements";

// Attendee
import AttendeeDashboardLayout from "./components/layout/AttendeeDashboardLayout";
import AttendeeLandingPage from "./pages/attendee/AttendeeLandingPage";
import AttendeeEventsPage from "./pages/attendee/AttendeeEventsPage";
import AttendeeTicketsPage from "./pages/attendee/AttendeeTicketsPage";
import AttendeeAnnouncements from "./pages/attendee/Announcements";

function App() {
  return (
    <Routes>
        {/* Public Landing / Blog */}
        <Route path="/" element={<BlogLanding />} />
        {/* Guest Explore Events */}
        <Route path="/explore" element={<GuestExploreEvents />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/tickets" element={<MyTickets />} />
      <Route path="/admin/manage" element={<ManageStaff />} />
      <Route path="/admin/reports" element={<Reports />} />

      {/* Organizer */}
      <Route path="/organizer" element={<OrganizerDashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="events" element={<OrganizerEvents />} />
        <Route path="announcements" element={<Announcements />} />
      </Route>

      {/* Attendee */}
      <Route path="/attendee" element={<AttendeeDashboardLayout />}>
        <Route index element={<AttendeeLandingPage />} />
        <Route path="events" element={<AttendeeEventsPage />} />
        <Route path="tickets" element={<AttendeeTicketsPage />} />
        <Route path="announcements" element={<AttendeeAnnouncements />} />
      </Route>
    </Routes>
  );
}

export default App;
