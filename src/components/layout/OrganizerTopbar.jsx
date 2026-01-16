import { useNavigate, useLocation } from "react-router-dom";

export default function OrganizerTopbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/"); // redirect to login
  };

  // Determine page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === "/organizer" || path === "/organizer/") return "Dashboard";
    if (path.includes("/events")) return "Events";
    if (path.includes("/qr-scanner")) return "QR Scanner";
    if (path.includes("/announcements")) return "Announcements";
    return "Dashboard";
  };

  return (
    <header className="w-full h-16 flex items-center justify-between px-8 bg-gradient-to-r from-[#2D132C] to-[#801336] border-b border-white/10">
      <h1 className="text-lg font-semibold tracking-wide text-white">
        {getPageTitle()}
      </h1>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-white text-[#2D132C] hover:bg-pink-100 transition-colors px-4 py-2 rounded-md font-medium"
      >
        Logout
      </button>
    </header>
  );
}
