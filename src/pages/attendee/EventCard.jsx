export default function EventCard({ event, onRegister }) {
    const isFull = event.tickets?.length >= event.capacity;
    return (
      <div className="bg-[#1E2A5F] rounded-2xl p-6 shadow-lg hover:shadow-xl transition flex flex-col justify-between border border-white/20">
        <div>
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-gray-300">{new Date(event.startDate).toLocaleString()}</p>
          <p className="text-gray-400 mt-1">{event.location}</p>
          <p className="text-gray-400 mt-1">{event.tickets?.length || 0}/{event.capacity} attendees</p>
        </div>
        <button
          onClick={onRegister}
          disabled={isFull}
          className={`mt-4 w-full p-3 rounded-lg font-semibold transition ${
            isFull
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-[#249E94] text-white hover:bg-[#1f8b82]"
          }`}
        >
          {isFull ? "Full" : "Register"}
        </button>
      </div>
    );
  }
  