import EventCard from "./EventCard";

export default function EventsGrid({ events, loading, onDelete, onRegister }) {
  if (loading) return <p className="text-gray-300">Loading events...</p>;
  if (events.length === 0) return <p className="text-gray-400">No upcoming events found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {events.map(event => (
        <EventCard key={event.id} event={event} onDelete={onDelete} onRegister={onRegister} />
      ))}
    </div>
  );
}
