import { Outlet } from "react-router-dom";
import OrganizerSidebar from "../sidebar/OrganizerSidebar";
import OrganizerTopbar from "./OrganizerTopbar";

export default function OrganizerDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#161E54] text-white">
      {/* Sidebar */}
      <OrganizerSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
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
