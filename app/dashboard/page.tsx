import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardClient } from "@/components/dashboard/dashboard-client"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export const metadata: Metadata = {
  title: "Dashboard | Query-SE",
  description: "View your search activity, saved results, and blockchain validations.",
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardClient />
    </Suspense>
  )
}
