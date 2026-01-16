import {
    LayoutDashboard,
    CalendarDays,
    BellRing,
    QrCode
  } from "lucide-react";
  import SidebarItem from "../sidebar/SidebarItem";
  
  export default function OrganizerSidebar() {
    return (
      <aside
        className="
          w-72 h-screen sticky top-0
          bg-gradient-to-b from-[#2D132C] to-[#801336]
          border-r border-white/10
          shadow-xl
          flex flex-col
          flex-shrink-0
        "
      >
        {/* Brand */}
        <div className="px-6 py-6 border-b border-white/10">
          <h1 className="text-3xl font-extrabold tracking-wide">
            🎟 LiveScene
          </h1>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem to="/organizer" icon={LayoutDashboard} label="Dashboard" end/>
          <SidebarItem to="/organizer/events" icon={CalendarDays} label="Events" />
          <SidebarItem to="/organizer/qr-scanner" icon={QrCode} label="QR Scanner" />
          <SidebarItem to="/organizer/announcements" icon={BellRing} label="Announcements" />
        </nav>
  
        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400">
          © 2026 EventOrganizer
        </div>
      </aside>
    );
  }
  