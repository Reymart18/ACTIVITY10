// src/components/sidebar/AttendeeSidebar.jsx
import { LayoutDashboard, CalendarDays, Ticket } from "lucide-react";
import SidebarItem from "./SidebarItem";

export default function AttendeeSidebar() {
  return (
    <aside
      className="
        w-72 min-h-screen
        bg-gradient-to-b from-[#0F143D] to-[#161E54]
        border-r border-white/10
        shadow-xl
        flex flex-col
      "
    >
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <h1 className="text-3xl font-extrabold tracking-wide">🎟 Attendee</h1>
        <p className="text-sm text-gray-400 mt-1">Attendee Panel</p>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        <SidebarItem to="/attendee" icon={LayoutDashboard} label="Dashboard" end />
        <SidebarItem to="/attendee/events" icon={CalendarDays} label="Events" />
        <SidebarItem to="/attendee/tickets" icon={Ticket} label="My Tickets" />
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400">
        © 2026 EventHub
      </div>
    </aside>
  );
}
