import { Suspense } from "react"
import { Breadcrumbs } from "./breadcrumbs"

export function BreadcrumbsWrapper() {
  return (
    <Suspense fallback={<div className="h-8 py-2">Loading breadcrumbs...</div>}>
      <Breadcrumbs />
    </Suspense>
  )
}
