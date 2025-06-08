import { Suspense } from "react"
import type { Metadata } from "next"
import { CollectionDetail } from "@/components/collections/collection-detail"
import { Skeleton } from "@/components/ui/skeleton"

interface CollectionPageProps {
  params: {
    id: string
  }
}

export function generateMetadata({ params }: CollectionPageProps): Metadata {
  return {
    title: `Collection | Query-SE`,
    description: "View and manage your saved image collection",
  }
}

export default function CollectionPage({ params }: CollectionPageProps) {
  return (
    <div className="container mx-auto py-8">
      <Suspense fallback={<CollectionDetailSkeleton />}>
        <CollectionDetail collectionId={params.id} />
      </Suspense>
    </div>
  )
}

function CollectionDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {Array(10)
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
