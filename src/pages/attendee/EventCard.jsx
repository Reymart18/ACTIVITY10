import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000";

export default function EventCard({ event, onRegister, onCancel, isPastEvent = false }) {
  const navigate = useNavigate();
  
  // Calculate total capacity (standard + VIP)
  const totalCapacity = (event.standardCapacity || 0) + (event.vipCapacity || 0);
  const registeredCount = event.ticketsCount || 0;
  const isFull = totalCapacity > 0 && registeredCount >= totalCapacity;
  const isRegistered = event.isRegistered === true;

  // Get current user's ID
  const currentUserId = JSON.parse(localStorage.getItem("user") || "{}")?.id;

  // Find the current user's ticket
  const userTicket = event.tickets?.find(t => t.user?.id === currentUserId || t.userId === currentUserId);

  // Check if any ticket for this user is already checked in
  const ticketCheckedIn = userTicket?.checkedIn;

  // State to track if cancellation is still available
  const [canCancel, setCanCancel] = useState(false);

  // Effect to check cancellation availability and set up timer
  useEffect(() => {
    if (!userTicket) {
      setCanCancel(false);
      return;
    }

    const checkCancellationAvailability = () => {
      const registrationTime = new Date(userTicket.createdAt).getTime();
      const currentTime = new Date().getTime();
      const secondsPassed = (currentTime - registrationTime) / 1000;
      return secondsPassed < 30;
    };

    // Initial check
    const initialCanCancel = checkCancellationAvailability();
    setCanCancel(initialCanCancel);

    if (!initialCanCancel) return; // Don't set up timer if already expired

    // Calculate remaining time until 30 seconds
    const registrationTime = new Date(userTicket.createdAt).getTime();
    const thirtySecondsLater = registrationTime + (30 * 1000);
    const timeUntilExpiry = thirtySecondsLater - new Date().getTime();

    // Set up timer to update when cancellation expires
    const timer = setTimeout(() => {
      setCanCancel(false);
    }, timeUntilExpiry);

    // Clean up timer on unmount
    return () => clearTimeout(timer);
  }, [userTicket]);

  return (
    <div
      onClick={() => navigate(`/event/${event.id}`)}
      className="group w-full
      h-80 sm:h-96 hover:h-[500px] sm:hover:h-[560px]
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

        {/* Event description visible to attendees */}
        {event.description && (
          <p className="text-sm text-gray-300 mt-1 line-clamp-2">{event.description}</p>
        )}

        <p className="text-sm mt-1">{new Date(event.startDate).toLocaleString()}</p>
        <p className="text-sm">{event.location}</p>
        <p className="text-xs text-gray-300 mt-1">
          {registeredCount}/{totalCapacity} registered
        </p>

        <div className="mt-3 flex gap-2 flex-wrap">
          {/* Register button - only show for upcoming events */}
          {!isPastEvent && !isRegistered && !isFull && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRegister();
              }}
              className="flex-1 bg-[#249E94] text-white hover:bg-[#1f8b82] px-4 py-2 rounded-lg font-semibold text-sm transition"
            >
              Register Now
            </button>
          )}

          {/* Registered + Cancel (only if not checked in, not past event, and within 5 minutes) */}
          {!isPastEvent && isRegistered && !ticketCheckedIn && canCancel && (
            <>
              <button
                disabled
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
              >
                ✓ Registered
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCancel();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition"
              >
                Cancel
              </button>
            </>
          )}

          {/* Registered - Cannot Cancel (5 minutes passed) */}
          {!isPastEvent && isRegistered && !ticketCheckedIn && !canCancel && (
            <button
              disabled
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              ✓ Registered
            </button>
          )}

          {/* Registered + Checked In */}
          {ticketCheckedIn && (
            <button
              disabled
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              ✓ Checked In
            </button>
          )}

          {/* Past Event indicator */}
          {isPastEvent && !isRegistered && (
            <button
              disabled
              className="flex-1 bg-gray-500 text-gray-300 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              Event Ended
            </button>
          )}

          {/* Past Event - Was Registered */}
          {isPastEvent && isRegistered && !ticketCheckedIn && (
            <button
              disabled
              className="flex-1 bg-gray-500 text-gray-300 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              Event Ended
            </button>
          )}

          {/* Full event - only show for upcoming events */}
          {!isPastEvent && !isRegistered && isFull && (
            <button
              disabled
              className="flex-1 bg-gray-600 text-gray-400 px-4 py-2 rounded-lg font-semibold text-sm cursor-not-allowed"
            >
              Full
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
