import { Outlet } from "react-router-dom";
import AttendeeSidebar from "../sidebar/AttendeeSidebar";
import AttendeeTopbar from "./AttendeeTopbar";

export default function AttendeeDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2D132C] to-[#801336] text-white">
      {/* Sidebar */}
      <AttendeeSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <AttendeeTopbar />

        {/* Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
