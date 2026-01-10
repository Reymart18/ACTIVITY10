import Sidebar from "./Sidebar"
import Topbar from "./Topbar"

export default function AdminLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#161E54] text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
