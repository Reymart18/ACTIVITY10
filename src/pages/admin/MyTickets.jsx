import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import AdminLayout from "../../components/layout/AdminLayout";
import { fetchMyTickets } from "../../api/events.api";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const res = await fetchMyTickets(); // Fetch tickets for logged-in admin
      setTickets(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold text-white">My Tickets</h2>
      <p className="mt-2 text-gray-300">View and manage your purchased tickets.</p>

      {loading ? (
        <p className="mt-4 text-gray-300">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="mt-4 text-gray-400">You have no tickets yet.</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => {
            // Fix Invalid Date by replacing space with "T"
            const eventDate = ticket.event.startDate
              ? new Date(ticket.event.startDate.replace(" ", "T"))
              : null;

            return (
              <div
                key={ticket.id}
                className="border border-white/20 p-6 rounded-xl bg-[#1E2A5F] shadow-lg flex flex-col items-center max-w-sm mx-auto"
              >
                {/* Event Info */}
                <h3 className="font-bold text-xl text-white text-center">{ticket.event.title}</h3>
                <p className="text-gray-300 mt-1">{ticket.event.location}</p>
                <p className="text-gray-400 mt-1 text-sm">
                  {!eventDate || isNaN(eventDate.getTime())
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
          })}
        </div>
      )}
    </AdminLayout>
  );
}
