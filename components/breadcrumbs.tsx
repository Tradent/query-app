"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"

// Map of route paths to human-readable titles
const routeTitles: Record<string, string> = {
  "/": "Home",
  "/search": "Search",
  "/images": "Images",
  "/blockchain-analysis": "Blockchain Analysis",
  "/validation-network": "Validation Network",
  "/about": "About",
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/settings": "Settings",
  "/admin": "Admin",
  "/admin/users": "Users",
  "/admin/analytics": "Analytics",
  "/admin/moderation": "Moderation",
  "/admin/verification": "Verification",
  "/admin/logs": "Logs",
  "/admin/reports": "Reports",
  "/admin/database": "Database",
  "/admin/settings": "Settings",
}

export function Breadcrumbs() {
  const pathname = usePathname()

  // Don't show breadcrumbs on homepage or search pages
  if (pathname === "/" || pathname === "/search" || pathname.startsWith("/search?")) {
    return null
  }

  // Split the pathname into segments
  const segments = pathname.split("/").filter(Boolean)

  // If there are no segments, return null
  if (segments.length === 0) {
    return null
  }

  // Create breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    // Create the path for this breadcrumb
    const path = `/${segments.slice(0, index + 1).join("/")}`

    // Get the title for this path, or capitalize the segment if not found
    const title = routeTitles[path] || segment.charAt(0).toUpperCase() + segment.slice(1)

    // Check if this is the last segment (current page)
    const isCurrentPage = index === segments.length - 1

    return {
      path,
      title,
      isCurrentPage,
    }
  })

  return (
    <nav aria-label="Breadcrumb" className="py-2">
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="text-earth-600 hover:text-sun-600 flex items-center" aria-label="Home">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-earth-400" />
        </li>

        {breadcrumbs.map((breadcrumb, index) => (
          <li key={breadcrumb.path} className="flex items-center">
            {breadcrumb.isCurrentPage ? (
              <span className="text-sun-600 font-medium" aria-current="page">
                {breadcrumb.title}
              </span>
            ) : (
              <>
                <Link href={breadcrumb.path} className="text-earth-600 hover:text-sun-600">
                  {breadcrumb.title}
                </Link>
                <ChevronRight className="h-4 w-4 mx-2 text-earth-400" />
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
