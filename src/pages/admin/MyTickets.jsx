import { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import MyTicketCard from "../attendee/MyTicketCard";
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
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">My Tickets</h2>
        <p className="text-gray-300 mb-6">View and manage your registered event tickets.</p>

        {loading ? (
          <p className="text-gray-400">Loading tickets...</p>
        ) : tickets.length === 0 ? (
          <p className="text-gray-400">You have no tickets yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <MyTicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
