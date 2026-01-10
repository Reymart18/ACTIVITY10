import AdminLayout from "../../components/layout/AdminLayout"

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold">Welcome, Admin 👋</h2>
      <p className="mt-2 text-gray-300">
        This is your admin landing page.
      </p>
    </AdminLayout>
  )
}
