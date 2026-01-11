import { CalendarDays, LayoutDashboard, Users } from "lucide-react";

export default function DashboardCards({ events }) {
  const allEvents = events || [];
  const now = new Date();

  // Ongoing Events = events where startDate <= now
  const ongoingEvents = allEvents.filter(event => new Date(event.startDate) <= now).length;

  // Events Organized = total events
  const eventsOrganized = allEvents.length;

  // Highest Attendees = max checked-in attendees among events
  const highestAttendees = allEvents.reduce((max, event) => {
    const validatedCount = event.tickets?.filter(t => t.checkedIn).length || 0;
    return Math.max(max, validatedCount);
  }, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Ongoing Events */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Ongoing Events</p>
            <h2 className="text-4xl font-bold mt-2">{ongoingEvents}</h2>
          </div>
          <div className="bg-[#249E94]/20 p-4 rounded-xl">
            <CalendarDays className="text-[#249E94]" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Events currently happening</p>
      </div>

      {/* Events Organized */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Events Organized</p>
            <h2 className="text-4xl font-bold mt-2">{eventsOrganized}</h2>
          </div>
          <div className="bg-blue-500/20 p-4 rounded-xl">
            <LayoutDashboard className="text-blue-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Total events created</p>
      </div>

      {/* Highest Attendees */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg hover:shadow-xl transition">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Highest Attendees</p>
            <h2 className="text-4xl font-bold mt-2">{highestAttendees.toLocaleString()}</h2>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-xl">
            <Users className="text-purple-400" size={28} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">Peak attendance (validated QR codes)</p>
      </div>
    </div>
  );
}
