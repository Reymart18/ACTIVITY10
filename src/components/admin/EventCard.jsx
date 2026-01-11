export default function EventCard({ event, onDelete, onRegister }) {
    const isFull = event.capacity && event.tickets?.length >= event.capacity;
    const canRegister = !isFull && !event.isRegistered;
  
    return (
      <div className="bg-[#1E2A5F] p-6 rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-gray-300 mt-1">{new Date(event.startDate).toLocaleString()}</p>
          <p className="text-gray-400 mt-1">{event.location}</p>
          <p className="text-gray-400 mt-1">{event.tickets?.length || 0}/{event.capacity} attendees</p>
          <p className="text-gray-400 mt-1 line-clamp-3">{event.description}</p>
        </div>
  
        <div className="mt-4 flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${isFull ? "bg-red-600 text-white" : "bg-[#249E94] text-white"}`}>
            {isFull ? "Full" : "Available"}
          </span>
  
          <button
            onClick={() => onRegister(event.id)}
            disabled={!canRegister}
            className={`flex-1 p-2 rounded-lg text-sm font-semibold text-white ${!canRegister ? "bg-gray-500 cursor-not-allowed" : "bg-[#249E94] hover:bg-[#1f8b82]"}`}
          >
            {isFull ? "Full" : event.isRegistered ? "Registered" : "Register"}
          </button>
  
          <button
            onClick={() => onDelete(event.id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
  