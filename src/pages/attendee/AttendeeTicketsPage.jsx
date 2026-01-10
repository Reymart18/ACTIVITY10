import { useEffect, useState } from "react";
import MyTicketCard from "./MyTicketCard";
import { fetchMyTickets } from "../../api/events.api";

export default function AttendeeTicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const res = await fetchMyTickets();
        setTickets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadTickets();
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
