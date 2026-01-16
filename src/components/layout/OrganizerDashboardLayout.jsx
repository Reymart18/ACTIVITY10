import { Outlet } from "react-router-dom";
import OrganizerSidebar from "../sidebar/OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

export default function OrganizerDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2D132C] to-[#801336] text-white">
      {/* Sidebar */}
      <div className="flex-shrink-0">
        <OrganizerSidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <OrganizerTopbar />

        {/* Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
