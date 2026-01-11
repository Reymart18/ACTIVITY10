import { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/events.api";

export default function ManageStaff() {
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrganizers();
  }, []);

  const loadOrganizers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/organizers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizers(res.data);
    } catch (err) {
      console.error("Failed to load organizers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await api.post("/auth/register-organizer", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Organizer created successfully!");
      setFormData({ name: "", email: "", password: "" });
      setShowForm(false);
      loadOrganizers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create organizer.");
    }
  };

  const toggleStatus = async (id, isActive) => {
    try {
      const token = localStorage.getItem("token");
      const url = `/auth/organizer/${id}/${isActive ? "deactivate" : "activate"}`;
      await api.patch(url, null, { headers: { Authorization: `Bearer ${token}` } });
      loadOrganizers();
    } catch (err) {
      console.error(err);
      alert("Failed to update organizer status.");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Manage Organizers & Staff</h2>
        <p className="mt-2 text-gray-300">
          Add, remove, and manage organizers and staff members.
        </p>
      </div>

      {/* Container: form + organizers list */}
      <div className="flex gap-6 transition-all duration-300">
        {/* Add Organizer Form */}
        {showForm && (
          <div className="w-full md:w-1/3 p-6 bg-[#1E2A5F] rounded-2xl border border-white/20 shadow-lg transition-all duration-300">
            <h3 className="text-xl font-bold text-white mb-4">Add Organizer</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20 focus:ring-2 focus:ring-[#249E94] outline-none"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20 focus:ring-2 focus:ring-[#249E94] outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full p-3 rounded-lg bg-[#272C3E] text-white border border-white/20 focus:ring-2 focus:ring-[#249E94] outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-[#249E94] hover:bg-[#1f8b82] text-white font-semibold transition duration-200"
              >
                Create Organizer
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="w-full py-3 mt-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition duration-200"
              >
                Hide Form
              </button>
            </form>
          </div>
        )}

        {/* Current Organizers List */}
        <div
          className={`p-6 bg-[#1E2A5F] rounded-2xl border border-white/20 shadow-lg transition-all duration-300 ${
            showForm ? "w-full md:w-2/3" : "w-full"
          }`}
        >
          <h3 className="text-xl font-bold text-white mb-4">Current Organizers</h3>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="mb-4 px-6 py-3 rounded-lg bg-[#249E94] hover:bg-[#1f8b82] text-white font-semibold transition duration-200"
            >
              Add Organizer
            </button>
          )}
          {organizers.length === 0 ? (
            <p className="text-gray-400">No organizers found.</p>
          ) : (
            <ul className="space-y-3 max-h-[600px] overflow-y-auto">
              {organizers.map((org) => (
                <li
                  key={org.id}
                  className="flex justify-between items-center p-3 bg-[#272C3E] rounded-lg border border-white/20 text-white hover:bg-[#2F3750] transition"
                >
                  <div>
                    <p className="font-medium">{org.name}</p>
                    <p className="text-gray-300 text-sm">{org.email}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(org.id, org.isActive)}
                      className={`px-3 py-1 rounded-lg text-sm font-semibold ${
                        org.isActive
                          ? "bg-red-600 hover:bg-red-500 text-white"
                          : "bg-green-600 hover:bg-green-500 text-white"
                      }`}
                    >
                      {org.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      className="px-3 py-1 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm"
                      // onClick={() => handleDelete(org.id)}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
