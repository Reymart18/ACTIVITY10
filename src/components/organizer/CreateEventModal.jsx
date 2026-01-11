import React from "react";

export default function CreateEventModal({ show, onClose, formData, setFormData, onSubmit }) {
  if (!show) return null;

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gradient-to-b from-[#0F143D] to-[#161E54] text-white rounded-xl p-8 w-full max-w-md relative shadow-2xl animate-fadeIn">
        <h2 className="text-2xl font-bold mb-6 text-white">Create Event</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            rows={4}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            required
          />

          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            className="w-full p-3 rounded border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            required
          />

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="w-full p-3 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none"
            required
          />

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#249E94] text-white rounded hover:bg-[#1f8b82] transition"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
