// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import DashboardCards from "../../components/organizer/DashboardCards"; // your whole dashboard module
import { fetchMyEvents } from "../../api/events.api";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const res = await fetchMyEvents(); // fetch events from your API
      setEvents(res.data); // <-- pass this to DashboardCards
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {loading ? (
        <p className="text-gray-400">Loading dashboard...</p>
      ) : (
        <DashboardCards events={events} />
      )}
    </div>
  );
}
