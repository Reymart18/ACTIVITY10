// src/pages/components/EventCard.jsx
import React from "react";

export default function EventCard({ event, onViewAttendees, onExport }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
      <h3 className="text-xl font-semibold">{event.title}</h3>
      <p className="text-sm text-gray-400">
        {event.location} • {new Date(event.startDate).toLocaleDateString()}
      </p>
      <p className="text-sm text-gray-500">Capacity: {event.capacity}</p>

      <div className="flex gap-2 mt-3">
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
