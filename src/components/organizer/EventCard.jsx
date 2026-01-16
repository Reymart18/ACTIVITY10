import React from "react";

const API_URL = "http://localhost:5000";

export default function EventCard({ event, onViewAttendees, onExport, onEdit }) {
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
    <div
      className="group w-full
      h-80 sm:h-96 hover:h-[520px] sm:hover:h-[580px]
      relative rounded-[5px] overflow-hidden
      shadow-xl cursor-pointer
      transition-[height] duration-300 ease-out"
    >
      <img
        src={event.poster ? `${API_URL}/uploads/posters/${event.poster}` : "/cover.png"}
        alt={event.title}
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-0 w-full bg-black/70 text-white p-4 transition-all duration-300 group-hover:pb-6">
        <h3 className="font-extrabold text-lg mb-1">
          {event.title}
        </h3>
        
        {event.description && (
          <p className="text-sm text-gray-300 mb-2 line-clamp-2">{event.description}</p>
        )}

        <p className="text-sm mb-1">{eventDateTime}</p>
        <p className="text-sm mb-2">{event.location}</p>

        <p className="text-xs text-gray-300 mb-1">
          Capacity: {registeredCount} / {event.capacity}
        </p>

        <p className="text-xs text-gray-300 mb-3">
          Checked In: {checkedInCount} / {registeredCount}
        </p>

        <div className="flex gap-2 flex-wrap">
          <button
            className="px-3 py-1.5 bg-[#249E94] text-white text-sm rounded hover:bg-[#1f8b82] transition"
            onClick={(e) => {
              e.stopPropagation();
              onViewAttendees(event.id);
            }}
          >
            View Attendees
          </button>
          <button
            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(event);
            }}
          >
            Edit Event
          </button>
          <button
            className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            onClick={(e) => {
              e.stopPropagation();
              onExport(event.id, "csv");
            }}
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
