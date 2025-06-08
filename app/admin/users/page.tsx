import { AdminHeader } from "@/components/admin/admin-header"
import { AdminUserTable } from "@/components/admin/admin-user-table"

export default function AdminUsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <AdminHeader title="User Management" description="Manage platform users and permissions" />

      <AdminUserTable />
    </div>
  )
}
