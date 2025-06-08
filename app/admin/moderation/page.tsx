import { AdminHeader } from "@/components/admin/admin-header"
import { AdminModerationQueue } from "@/components/admin/admin-moderation-queue"

export default function AdminModerationPage() {
  return (
    <div className="flex-1 space-y-4 p-8">
      <AdminHeader title="Content Moderation" description="Review and moderate flagged content" />

      <AdminModerationQueue />
    </div>
  )
}
