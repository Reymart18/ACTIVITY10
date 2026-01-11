import { useEffect, useState } from "react";
import { CalendarDays, Users, ClipboardList } from "lucide-react";
import { fetchAllEvents } from "../../api/events.api";

export default function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = () => {
    setLoading(true);
    fetchAllEvents()
      .then((res) => setEvents(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const now = new Date();

  // Events stats
  const registeredEvents = events.filter((e) => e.tickets?.length > 0);
  const attendedCount = registeredEvents.filter((e) =>
    e.tickets?.some((t) => t.checkedIn)
  ).length;
  const missedCount = registeredEvents.filter(
    (e) => e.tickets?.some((t) => !t.checkedIn) && new Date(e.startDate) < now
  ).length;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Attendee Dashboard</h1>
      <p className="text-gray-400">See your event participation summary</p>

      {loading && <p className="text-gray-400">Loading events...</p>}

      {!loading && registeredEvents.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Events Registered */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Events Registered</p>
                <h2 className="text-4xl font-bold mt-2">{registeredEvents.length}</h2>
              </div>
              <div className="bg-blue-500/20 p-4 rounded-xl">
                <ClipboardList className="text-blue-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Total events you registered for
            </p>
          </div>

          {/* Events Attended */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Events Attended</p>
                <h2 className="text-4xl font-bold mt-2">{attendedCount}</h2>
              </div>
              <div className="bg-green-500/20 p-4 rounded-xl">
                <CalendarDays className="text-green-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Events where your QR code was validated
            </p>
          </div>

          {/* Events Missed */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Events Missed</p>
                <h2 className="text-4xl font-bold mt-2">{missedCount}</h2>
              </div>
              <div className="bg-red-500/20 p-4 rounded-xl">
                <Users className="text-red-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Past events you registered for but didn’t attend
            </p>
          </div>
        </div>
      )}

      {!loading && registeredEvents.length === 0 && (
        <p className="text-gray-400 mt-4">You have no events registered yet.</p>
      )}

      {/* Event List */}
      <div className="mt-8 space-y-4">
        {registeredEvents.map((event) => {
          const ticket = event.tickets?.[0]; // Assuming 1 ticket per attendee per event
          const checkedIn = ticket?.checkedIn || false;
          const eventDateTime = event.startDate
            ? new Date(event.startDate).toLocaleString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "TBD";

          // Determine event status
          let statusLabel = "";
          let bgColor = "";
          let textColor = "";
          if (checkedIn) {
            statusLabel = "QR Validated / Attended";
            bgColor = "bg-green-50";
            textColor = "text-green-700";
          } else if (new Date(event.startDate) < now) {
            statusLabel = "Missed / Not Checked In";
            bgColor = "bg-red-50";
            textColor = "text-red-700";
          } else {
            statusLabel = "Upcoming / Not Checked In";
            bgColor = "bg-blue-300";
            textColor = "text-blue-700";
          }

          return (
            <div
              key={event.id}
              className={`p-4 rounded-xl border ${bgColor} ${textColor} border-transparent`}
            >
              <h3 className="font-semibold text-lg">{event.title}</h3>
              <p className="text-sm text-gray-600">
                {event.location} • {eventDateTime}
              </p>
              <p className={`mt-2 font-medium`}>{statusLabel}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
