export default function Attendees() {
    return (
      <div className="min-h-screen bg-[#161E54] text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Registered Attendees</h1>
        <p className="mb-6 text-gray-300">
          View the list of attendees with search and filter options.
        </p>
  
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg overflow-x-auto">
          {/* TODO: Add table of attendees */}
          <p className="text-gray-200">Attendee list will appear here.</p>
        </div>
      </div>
    )
  }
  