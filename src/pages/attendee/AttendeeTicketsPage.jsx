import { useEffect, useState } from "react";
import MyTicketCard from "./MyTicketCard";
import { fetchMyTickets } from "../../api/events.api";

export default function AttendeeTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTickets = async () => {
    try {
      const res = await fetchMyTickets();
      setTickets(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadInitialTickets = async () => {
      setLoading(true);
      await loadTickets();
      setLoading(false);
    };
    loadInitialTickets();

    // Poll for updates every 3 seconds to check for check-in status changes
    const pollInterval = setInterval(loadTickets, 3000);

    return () => clearInterval(pollInterval);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Tickets</h2>
      {loading ? (
        <p className="text-gray-500">Loading tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="text-gray-400">No tickets yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {tickets.map((ticket) => (
            <MyTicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  );
}
