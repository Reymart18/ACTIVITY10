import React from "react";

export default function EventCard({ event, onViewAttendees, onExport }) {
  const registeredCount = event.attendees?.length || 0;
  const checkedInCount = event.attendees?.filter(a => a.checkedIn).length || 0;

  // Format datetime nicely
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

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
      <h3 className="text-xl font-semibold">{event.title}</h3>

      {event.description && (
        <p className="text-sm text-gray-400">{event.description}</p>
      )}

      <p className="text-sm text-gray-400">{event.location} • {eventDateTime}</p>

      <p className="text-sm text-gray-500">
        Capacity: {registeredCount} / {event.capacity}
      </p>

      <p className="text-sm text-gray-400">
        QR Validated / Scanned: {checkedInCount} / {registeredCount}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => onViewAttendees(event.id)}
        >
          View Registered Attendees
        </button>
        <button
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => onExport(event.id, "csv")}
        >
          Export CSV
        </button>
        <button
          className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
          onClick={() => onExport(event.id, "pdf")}
        >
          Export PDF
        </button>
      </div>
    </div>
  );
}
