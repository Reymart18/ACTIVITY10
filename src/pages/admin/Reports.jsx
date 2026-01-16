import { useState, useEffect } from "react";
import { FileSpreadsheet, TrendingUp, Users, Calendar, Download, Filter } from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import api from "../../api/events.api"; // your axios instance
import * as XLSX from "xlsx";

export default function Reports() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState("");

  // Fetch attendance and events on mount
  useEffect(() => {
    fetchEvents();
    fetchAttendance();
  }, []);

  // Fetch attendance
  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/checkin", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAttendance(res.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch events for the dropdown
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/events", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  // Filtered attendance by selected event
  const filteredAttendance = selectedEvent
    ? attendance.filter((a) => a.eventName === selectedEvent)
    : attendance;

  // Calculate statistics
  const totalCheckIns = filteredAttendance.length;
  const uniqueEvents = [...new Set(filteredAttendance.map(a => a.eventName))].length;
  const uniqueAttendees = [...new Set(filteredAttendance.map(a => a.attendeeName))].length;
  const averagePerEvent = uniqueEvents > 0 ? (totalCheckIns / uniqueEvents).toFixed(1) : 0;

  // Remove "checkedIn" column for table and Excel
  const keysToDisplay = filteredAttendance.length
    ? Object.keys(filteredAttendance[0]).filter((key) => key !== "checkedIn")
    : [];

  const exportToExcel = () => {
    if (!filteredAttendance.length) return;

    // Remove "checkedIn" from exported data
    const dataToExport = filteredAttendance.map((row) => {
      const copy = { ...row };
      delete copy.checkedIn;
      return copy;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, "attendance_report.xlsx");
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-2">
            <FileSpreadsheet className="text-pink-400" size={32} />
            <h2 className="text-3xl font-bold text-white">Reports & Analytics</h2>
          </div>
          <p className="text-gray-300">
            View attendance statistics and export data to Excel.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Total Check-ins */}
          <div className="bg-gradient-to-br from-pink-500/20 to-[#2D132C] border border-pink-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Total Registered</p>
                <h3 className="text-4xl font-bold text-white">{totalCheckIns}</h3>
              </div>
              <div className="bg-pink-500/20 p-4 rounded-xl">
                <TrendingUp className="text-pink-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              {selectedEvent ? `For ${selectedEvent}` : "Across all events"}
            </p>
          </div>

          {/* Unique Events */}
          <div className="bg-gradient-to-br from-purple-500/20 to-[#2D132C] border border-purple-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Events</p>
                <h3 className="text-4xl font-bold text-white">{uniqueEvents}</h3>
              </div>
              <div className="bg-purple-500/20 p-4 rounded-xl">
                <Calendar className="text-purple-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              {selectedEvent ? "Selected event" : "Total events with attendance"}
            </p>
          </div>

          {/* Average per Event */}
          <div className="bg-gradient-to-br from-rose-500/20 to-[#2D132C] border border-rose-500/30 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-1">Avg per Event</p>
                <h3 className="text-4xl font-bold text-white">{averagePerEvent}</h3>
              </div>
              <div className="bg-amber-500/20 p-4 rounded-xl">
                <TrendingUp className="text-amber-400" size={28} />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Average attendance rate</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="p-6 bg-gradient-to-br from-[#2D132C] to-[#1A1520] rounded-2xl border border-white/20 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileSpreadsheet size={24} className="text-pink-400" />
                Attendance Records
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {filteredAttendance.length} record{filteredAttendance.length !== 1 ? 's' : ''} found
              </p>
            </div>

            <div className="flex flex-wrap gap-3 w-full md:w-auto">
              {/* Event Filter Dropdown */}
              <div className="flex items-center gap-2 flex-1 md:flex-initial">
                <Filter size={18} className="text-gray-400" />
                <select
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                  className="flex-1 md:w-64 px-4 py-2.5 rounded-lg bg-white/5 text-gray-400 border border-white/20 focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition"
                >
                  <option value="">All Events</option>
                  {events.map((ev) => (
                    <option key={ev.id} value={ev.title}>
                      {ev.title}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={exportToExcel}
                disabled={filteredAttendance.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                <Download size={18} />
                Export to Excel
              </button>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mb-4"></div>
              <p className="text-gray-400">Loading attendance data...</p>
            </div>
          ) : filteredAttendance.length === 0 ? (
            <div className="text-center py-16">
              <FileSpreadsheet size={64} className="mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg font-medium">No attendance data found</p>
              <p className="text-gray-500 text-sm mt-2">
                {selectedEvent 
                  ? "Try selecting a different event" 
                  : "Check-ins will appear here once attendees scan their tickets"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-white/10">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-white/5 text-white">
                    {keysToDisplay.map((key) => (
                      <th
                        key={key}
                        className="border-b border-white/20 px-6 py-4 text-left font-semibold uppercase text-xs tracking-wider text-gray-300"
                      >
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendance.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b border-white/5 transition-colors ${
                        idx % 2 === 0 ? "bg-white/5" : "bg-white/[0.02]"
                      } hover:bg-pink-500/10`}
                    >
                      {keysToDisplay.map((key, i) => (
                        <td key={i} className="px-6 py-4 text-white text-sm">
                          {row[key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
