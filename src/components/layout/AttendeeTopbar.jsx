// src/components/layout/AttendeeTopbar.jsx
import { useNavigate } from "react-router-dom";

export default function AttendeeTopbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  return (
    <header className="h-16 flex items-center justify-between px-8 bg-[#0F143D] border-b border-white/10">
      <h1 className="text-lg font-semibold tracking-wide text-white">
        Attendee Dashboard
      </h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-[#249E94] hover:bg-[#1f7e7a] transition-colors px-4 py-2 rounded-md text-white font-medium"
      >
        Logout
      </button>
    </header>
  );
}
