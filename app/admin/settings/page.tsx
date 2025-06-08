import { AdminHeader } from "@/components/admin/admin-header"
import { AdminSettingsForm } from "@/components/admin/admin-settings-form"

export default function AdminSettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <AdminHeader title="Settings" description="Manage platform settings and configuration" />

      <AdminSettingsForm />
    </div>
  )
}
