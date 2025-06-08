import { AdminHeader } from "@/components/admin/admin-header"
import { AdminMetricCard } from "@/components/admin/admin-metric-card"
import { AdminChart } from "@/components/admin/admin-chart"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"
import { AdminStatusOverview } from "@/components/admin/admin-status-overview"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <AdminHeader title="Dashboard" description="Overview of your platform's performance and key metrics" />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminMetricCard
          title="Total Searches"
          value="1,234,567"
          description="Last 30 days"
          trend="up"
          percentage={12.5}
        />
        <AdminMetricCard title="Active Users" value="45,678" description="Last 30 days" trend="up" percentage={8.2} />
        <AdminMetricCard
          title="Verified Images"
          value="89,432"
          description="Total verified"
          trend="up"
          percentage={15.7}
        />
        <AdminMetricCard title="Validation Rate" value="98.2%" description="Last 30 days" trend="up" percentage={2.3} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <AdminChart title="Search Trends" description="Search volume over time" type="line" variant="earth" />
        <AdminChart title="Verification Activity" description="Image verifications by type" type="bar" variant="sun" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <AdminStatusOverview className="md:col-span-1" />
        <AdminRecentActivity className="md:col-span-2" />
      </div>
    </div>
  )
}
