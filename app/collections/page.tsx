import { Suspense } from "react"
import type { Metadata } from "next"
import { CollectionsClient } from "@/components/collections/collections-client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Collections | Query-SE",
  description: "Manage your saved image collections",
}

export default function CollectionsPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col space-y-2 mb-8">
        <h1 className="text-3xl font-bold">Collections</h1>
        <p className="text-muted-foreground">Manage your saved image collections.</p>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Collections</TabsTrigger>
          <TabsTrigger value="recent">Recently Updated</TabsTrigger>
          <TabsTrigger value="largest">Largest</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <Suspense fallback={<CollectionsSkeleton />}>
            <CollectionsClient filter="all" />
          </Suspense>
        </TabsContent>

        <TabsContent value="recent" className="space-y-6">
          <Suspense fallback={<CollectionsSkeleton />}>
            <CollectionsClient filter="recent" />
          </Suspense>
        </TabsContent>

        <TabsContent value="largest" className="space-y-6">
          <Suspense fallback={<CollectionsSkeleton />}>
            <CollectionsClient filter="largest" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CollectionsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="pt-4">
              <Skeleton className="h-24 w-full" />
            </div>
            <div className="flex justify-between pt-2">
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/4" />
            </div>
          </div>
        ))}
    </div>
  )
}
