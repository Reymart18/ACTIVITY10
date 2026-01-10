export default function ExportAttendees() {
    return (
      <div className="min-h-screen bg-[#161E54] text-white p-8">
        <h1 className="text-3xl font-bold mb-4">Export Attendee List</h1>
        <p className="mb-6 text-gray-300">
          Download the attendee list in CSV or PDF format.
        </p>
  
        <div className="bg-white/10 p-6 rounded-2xl shadow-lg flex flex-col gap-4">
          {/* TODO: Add export buttons */}
          <button className="bg-[#249E94] px-4 py-2 rounded-md hover:bg-[#1f7e7a] transition">
            Export CSV
          </button>
          <button className="bg-[#249E94] px-4 py-2 rounded-md hover:bg-[#1f7e7a] transition">
            Export PDF
          </button>
        </div>
      </div>
    )
  }
  