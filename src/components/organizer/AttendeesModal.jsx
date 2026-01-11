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
      <div className="bg-[#1E1E1E] text-white rounded-xl p-6 w-full max-w-3xl relative shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Registered Attendees</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold"
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
          className="w-full p-2 mb-4 rounded text-black focus:outline-none"
        />

        {/* Attendees List */}
        <div className="max-h-96 overflow-y-auto border-t border-gray-600 pt-2">
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No attendees found.</p>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="border-b border-gray-600">
                  <th className="px-2 py-1">Name</th>
                  <th className="px-2 py-1">Email</th>
                  <th className="px-2 py-1">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(a => (
                  <tr key={a.id} className="border-b border-gray-700">
                    <td className="px-2 py-1">{a.name || "—"}</td>
                    <td className="px-2 py-1">{a.email || "—"}</td>
                    <td className="px-2 py-1">
                      {a.checkedIn ? "Checked In" : "Not Checked In"}
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
            className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
