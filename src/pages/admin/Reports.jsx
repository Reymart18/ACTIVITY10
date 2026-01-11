import { useState, useEffect } from "react";
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
      <h2 className="text-3xl font-bold text-white">Reports / Exports</h2>
      <p className="mt-2 text-gray-300">
        Attendance stats with Excel download.
      </p>

      <div className="mt-6 p-6 bg-[#1E2A5F] rounded-2xl border border-white/20 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Attendance Stats</h3>

          {/* Event Filter Dropdown */}
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="mr-4 px-3 py-2 rounded-lg bg-[#272C3E] text-white border border-white/20"
          >
            <option value="">All Events</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.title}>
                {ev.title}
              </option>
            ))}
          </select>

          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-[#249E94] hover:bg-[#1f8b82] text-white rounded-lg transition"
          >
            Export to Excel
          </button>
        </div>

        {loading ? (
          <p className="text-gray-300">Loading...</p>
        ) : filteredAttendance.length === 0 ? (
          <p className="text-gray-400">No attendance data found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-[#272C3E] text-white">
                  {keysToDisplay.map((key) => (
                    <th
                      key={key}
                      className="border border-white/20 px-4 py-2 text-left"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredAttendance.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-white/10 ${
                      idx % 2 === 0 ? "bg-[#1F274A]" : "bg-[#272C3E]"
                    }`}
                  >
                    {keysToDisplay.map((key, i) => (
                      <td key={i} className="px-4 py-2 text-white">
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
    </AdminLayout>
  );
}
