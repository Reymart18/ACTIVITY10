import React from "react";

export default function EventCard({ event, onRegister, onCancel }) {
  const isFull = event.capacity && event.tickets?.length >= event.capacity;
  const isRegistered = event.isRegistered === true;

  // Check if any ticket for this user is already checked in
  const ticketCheckedIn = event.tickets?.some(t => t.checkedIn);

  return (
    <div className="bg-[#1E2A5F] rounded-2xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-between border border-white/20">
      <div>
        <h3 className="text-xl font-bold text-white">{event.title}</h3>

        {/* Event description visible to attendees */}
        {event.description && (
          <p className="text-gray-300 mt-1">{event.description}</p>
        )}

        <p className="text-gray-300 mt-1">{new Date(event.startDate).toLocaleString()}</p>
        <p className="text-gray-400 mt-1">{event.location}</p>
        <p className="text-gray-400 mt-1">
          {event.tickets?.length || 0}/{event.capacity} attendees
        </p>
      </div>

      <div className="mt-4 flex gap-2 flex-wrap">
        {/* Register button */}
        {!isRegistered && !isFull && (
          <button
            onClick={onRegister}
            className="flex-1 bg-[#249E94] text-white hover:bg-[#1f8b82] p-3 rounded-lg font-semibold transition"
          >
            Register
          </button>
        )}

        {/* Registered + Cancel (only if not checked in) */}
        {isRegistered && !ticketCheckedIn && (
          <>
            <button
              disabled
              className="flex-1 bg-gray-500 text-gray-300 p-3 rounded-lg font-semibold cursor-not-allowed"
            >
              Registered
            </button>
            <button
              onClick={onCancel}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg font-semibold transition"
            >
              Cancel
            </button>
          </>
        )}

        {/* Registered + Checked In */}
        {ticketCheckedIn && (
          <button
            disabled
            className="flex-1 bg-green-600 text-white p-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Checked In
          </button>
        )}

        {/* Full event */}
        {!isRegistered && isFull && (
          <button
            disabled
            className="flex-1 bg-gray-600 text-gray-400 p-3 rounded-lg font-semibold cursor-not-allowed"
          >
            Full
          </button>
        )}
      </div>
    </div>
  );
}
