import AdminLayout from "../../components/layout/AdminLayout"

export default function MyTickets() {
  return (
    <AdminLayout>
      <h2 className="text-3xl font-bold">My Tickets</h2>
      <p className="mt-2 text-gray-300">
        View and manage your purchased tickets.
      </p>
    </AdminLayout>
  )
}
