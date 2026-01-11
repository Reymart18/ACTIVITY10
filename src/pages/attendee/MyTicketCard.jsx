import React from "react";
import QRCode from "react-qr-code";

export default function MyTicketCard({ ticket }) {
  const eventDate = new Date(ticket.event.startDate);

  return (
    <div className="border border-white/20 p-6 rounded-xl bg-[#1E2A5F] shadow-lg flex flex-col items-center max-w-sm mx-auto">
      {/* Event Info */}
      <h3 className="font-bold text-xl text-white text-center">{ticket.event.title}</h3>
      <p className="text-gray-300 mt-1">{ticket.event.location}</p>
      <p className="text-gray-400 mt-1 text-sm">
        {isNaN(eventDate.getTime())
          ? "Date not set"
          : eventDate.toLocaleDateString("en-US", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
      </p>
      <p className="mt-2 text-gray-200 font-medium">Reference: {ticket.referenceCode}</p>

      {/* QR Code */}
      <div className="my-4 p-4 bg-white border border-white/20 rounded-lg shadow-md flex justify-center">
        <QRCode
            value={JSON.stringify({
                type: "EVENT_TICKET",
                ticketId: ticket.id,
                referenceCode: ticket.referenceCode,
                eventId: ticket.event.id,
            })}
            size={220}
            bgColor="#ffffff"
            fgColor="#000000"
        />
        </div>


      {/* Checked In Badge */}
      {ticket.checkedIn && (
        <span className="mt-2 px-4 py-1 bg-green-500 text-white font-semibold rounded-full">
          Checked In
        </span>
      )}
    </div>
  );
}
