import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#2D132C] to-[#801336] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
