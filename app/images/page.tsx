import { Suspense } from "react"
import { SearchBar } from "@/components/search-bar"
import { ImageSearchTools } from "@/components/image-search-tools"
import { ImageSearchResults } from "@/components/image-search-results"
import { Skeleton } from "@/components/ui/skeleton"

export default function ImageSearchPage({
  searchParams,
}: {
  searchParams: { q?: string }
}) {
  const query = searchParams.q || ""

  return (
    <main className="min-h-screen bg-white">
      <SearchBar initialQuery={query} />
      <ImageSearchTools />

      <div className="pt-2 pb-20">
        <Suspense fallback={<ImageSearchSkeleton />}>
          <ImageSearchResults query={query} />
        </Suspense>
      </div>
    </main>
  )
}

function ImageSearchSkeleton() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <Skeleton className="h-4 w-48 mb-6" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {Array(24)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="h-full w-full rounded-lg" />
            </div>
          ))}
      </div>
    </div>
  )
}
