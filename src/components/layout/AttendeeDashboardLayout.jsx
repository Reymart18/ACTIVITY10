import { Outlet } from "react-router-dom";
import AttendeeSidebar from "../sidebar/AttendeeSidebar";
import AttendeeTopbar from "./AttendeeTopbar";

export default function AttendeeDashboardLayout() {
  return (
    <div className="flex min-h-screen bg-[#161E54] text-white">
      {/* Sidebar */}
      <AttendeeSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#161E54]">
        {/* Topbar */}
        <AttendeeTopbar />

        {/* Content */}
        <main className="p-8 bg-[#161E54]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
