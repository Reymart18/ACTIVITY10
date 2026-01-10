// src/pages/components/AttendeesModal.jsx
import React, { useState } from "react";

export default function AttendeesModal({ show, attendees, onClose }) {
  const [search, setSearch] = useState("");

  if (!show) return null;

  const filtered = attendees.filter(a =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1E1E1E] text-white rounded-xl p-8 w-full max-w-2xl relative shadow-2xl">
        <h2 className="text-xl font-bold mb-4">Registered Attendees</h2>
        <input
          type="text"
          placeholder="Search attendees..."
          className="w-full p-2 mb-4 rounded text-black"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="max-h-96 overflow-y-auto">
          {filtered.map(a => (
            <div key={a.id} className="flex justify-between py-1 border-b border-gray-600">
              <span>{a.name}</span>
              <span>{a.email}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-400 rounded hover:bg-gray-500">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
