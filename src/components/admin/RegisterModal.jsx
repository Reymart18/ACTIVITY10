export default function RegisterModal({ formData, setFormData, onClose, onSubmit }) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1E2A5F] p-6 rounded-2xl w-full max-w-md border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Register for Event</h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
              required
            />
            <input
              type="text"
              placeholder="Company (optional)"
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
              className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#249E94] hover:bg-[#1f8b82] text-white"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
  