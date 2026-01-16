import React from "react";

export default function CreateEventModal({ show, onClose, formData, setFormData, onSubmit, isEditing }) {
  if (!show) return null;

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, poster: file }));
    }
  };

  // Get today's date in YYYY-MM-DDTHH:MM format for min attribute
  const getTodayDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-xl w-full max-w-md relative shadow-2xl animate-fadeIn max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-b from-gray-900 to-gray-800 p-6 pb-4 z-10 border-b border-white/10">
          <h2 className="text-2xl font-bold text-white">{isEditing ? "Edit Event" : "Create Event"}</h2>
        </div>
        <form onSubmit={onSubmit} className="space-y-3 p-6 pt-4">
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2.5 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
            required
          />

          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2.5 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
            rows={3}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-2.5 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
            required
          />

          <div>
            <label className="block text-xs mb-1 text-white/80">Start Date & Time</label>
            <input
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              min={getTodayDateTime()}
              className="w-full p-2.5 rounded border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1 text-white/80">End Date & Time</label>
            <input
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              min={formData.startDate || getTodayDateTime()}
              className="w-full p-2.5 rounded border border-white/20 bg-white/10 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs mb-1 text-white/80">🪑 Standard Capacity</label>
              <input
                type="number"
                name="standardCapacity"
                placeholder="Standard"
                value={formData.standardCapacity}
                onChange={handleChange}
                className="w-full p-2.5 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-white/80">👑 VIP Capacity</label>
              <input
                type="number"
                name="vipCapacity"
                placeholder="VIP"
                value={formData.vipCapacity}
                onChange={handleChange}
                className="w-full p-2.5 rounded border border-white/20 bg-white/10 placeholder-white/60 text-white focus:ring-2 focus:ring-[#249E94] outline-none text-sm"
                required
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 text-white/80">Event Poster</label>
            <input
              type="file"
              name="poster"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 rounded border border-white/20 bg-white/10 text-white text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#249E94] file:text-white hover:file:bg-[#1f8b82] focus:ring-2 focus:ring-[#249E94] outline-none"
            />
            {formData.poster && (
              <p className="mt-1.5 text-xs text-white/70">Selected: {formData.poster.name}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/20 text-white rounded hover:bg-white/30 transition text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#249E94] text-white rounded hover:bg-[#1f8b82] transition text-sm font-medium"
            >
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
