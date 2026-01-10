import {
    Home,
    CalendarDays,
    Ticket,
    LayoutDashboard,
    Users,
    BarChart3
  } from "lucide-react"
  import SidebarItem from "../sidebar/SidebarItem"
  
  export default function Sidebar() {
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
          <h1 className="text-3xl font-extrabold tracking-wide">
            🎟 EventAdmin
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Admin Control Panel
          </p>
        </div>
  
        {/* Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          <SidebarItem to="/admin" icon={Home} label="Home" end />
          <SidebarItem to="/admin/events" icon={CalendarDays} label="Events" />
          <SidebarItem to="/admin/tickets" icon={Ticket} label="My Tickets" />
          <SidebarItem
            to="/admin/organizer"
            icon={LayoutDashboard}
            label="Organizer Dashboard"
          />
          <SidebarItem
            to="/admin/manage"
            icon={Users}
            label="Manage Organizers & Staff"
          />
          <SidebarItem
            to="/admin/reports"
            icon={BarChart3}
            label="Reports"
          />
        </nav>
  
        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 text-sm text-gray-400">
          © 2026 EventAdmin
        </div>
      </aside>
    )
  }
  