import { useState, useMemo } from "react";

export default function AttendeesModal({ show, attendees, onClose }) {
  const [search, setSearch] = useState("");

  // Filter attendees by search input
  const filtered = useMemo(
    () =>
      attendees.filter(a =>
        (a.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (a.email || "").toLowerCase().includes(search.toLowerCase())
      ),
    [attendees, search]
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 rounded-xl p-6 w-full max-w-3xl relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Registered Attendees</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 font-bold text-xl"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search attendees..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full p-3 mb-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#249E94]"
        />

        {/* Attendees List */}
        <div className="max-h-96 overflow-y-auto border-t border-gray-300 pt-2">
          {filtered.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No attendees found.</p>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-50">
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Seat Type</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{a.name || "—"}</td>
                    <td className="px-4 py-3">{a.email || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        a.seatType === 'vip' 
                          ? "bg-amber-100 text-amber-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {a.seatType === 'vip' ? "👑 VIP" : "🪑 Standard"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        a.checkedIn 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {a.checkedIn ? "✓ Checked In" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Close button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#249E94] text-white rounded hover:bg-[#1f8b82] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
