import { useState, useEffect } from "react";
import { UserPlus, Users, Trash2, Power, CheckCircle, XCircle } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/events.api";

export default function ManageStaff() {
  const [organizers, setOrganizers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganizers();
  }, []);

  const loadOrganizers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/auth/organizers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrganizers(res.data);
    } catch (err) {
      console.error("Failed to load organizers:", err);
    } finally {
      setLoading(false);
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

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete organizer "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await api.delete(`/auth/organizer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Organizer deleted successfully!");
      loadOrganizers();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete organizer.");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Users className="text-pink-400" size={32} />
              <h2 className="text-3xl font-bold text-white">Manage Organizers</h2>
            </div>
            <p className="text-gray-300">
              Add, remove, and manage event organizers and staff members.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus size={20} />
              Add Organizer
            </button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-pink-500/20 to-[#2D132C] border border-pink-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Organizers</p>
                <h3 className="text-4xl font-bold text-white mt-2">{organizers.length}</h3>
              </div>
              <div className="bg-pink-500/20 p-4 rounded-xl">
                <Users className="text-pink-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-[#2D132C] border border-green-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active</p>
                <h3 className="text-4xl font-bold text-white mt-2">
                  {organizers.filter(o => o.isActive).length}
                </h3>
              </div>
              <div className="bg-green-500/20 p-4 rounded-xl">
                <CheckCircle className="text-green-400" size={28} />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-500/20 to-[#2D132C] border border-red-500/30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Inactive</p>
                <h3 className="text-4xl font-bold text-white mt-2">
                  {organizers.filter(o => !o.isActive).length}
                </h3>
              </div>
              <div className="bg-red-500/20 p-4 rounded-xl">
                <XCircle className="text-red-400" size={28} />
              </div>
            </div>
          </div>
        </div>

        {/* Container: form + organizers list */}
        <div className="flex flex-col lg:flex-row gap-6 transition-all duration-300">
          {/* Add Organizer Form */}
          {showForm && (
            <div className="w-full lg:w-1/3 p-6 bg-gradient-to-br from-[#2D132C] to-[#1A1520] rounded-2xl border border-white/20 shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <UserPlus size={24} className="text-pink-400" />
                  Add New Organizer
                </h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3 rounded-lg bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Create Organizer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition-all duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Organizers List */}
          <div
            className={`p-6 bg-gradient-to-br from-[#2D132C] to-[#1A1520] rounded-2xl border border-white/20 shadow-xl transition-all duration-300 ${
              showForm ? "w-full lg:w-2/3" : "w-full"
            }`}
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Users size={24} className="text-pink-400" />
              Current Organizers ({organizers.length})
            </h3>
            
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400"></div>
              </div>
            ) : organizers.length === 0 ? (
              <div className="text-center py-12">
                <Users size={48} className="mx-auto text-gray-600 mb-4" />
                <p className="text-gray-400">No organizers found.</p>
                <p className="text-gray-500 text-sm mt-2">Click "Add Organizer" to create one.</p>
              </div>
            ) : (
              <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                {organizers.map((org) => (
                  <li
                    key={org.id}
                    className="group p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hover:border-white/20 text-white transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${org.isActive ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
                          <p className="font-semibold text-lg">{org.name}</p>
                          <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            org.isActive 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                              : 'bg-red-500/20 text-red-300 border border-red-500/30'
                          }`}>
                            {org.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1 ml-6">{org.email}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleStatus(org.id, org.isActive)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            org.isActive
                              ? "bg-orange-600/20 hover:bg-orange-600/40 text-orange-300 border border-orange-500/30"
                              : "bg-green-600/20 hover:bg-green-600/40 text-green-300 border border-green-500/30"
                          }`}
                          title={org.isActive ? "Deactivate organizer" : "Activate organizer"}
                        >
                          <Power size={16} />
                          {org.isActive ? "Deactivate" : "Activate"}
                        </button>
                        <button
                          onClick={() => handleDelete(org.id, org.name)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/30 text-sm font-semibold transition-all duration-200"
                          title="Delete organizer permanently"
                        >
                          <Trash2 size={16} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(236, 72, 153, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(236, 72, 153, 0.7);
        }
      `}</style>
    </AdminLayout>
  );
}
