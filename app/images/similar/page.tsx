import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { SearchBar } from "@/components/search-bar"
import { ImageSearchTools } from "@/components/image-search-tools"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { ImageSearchResults } from "@/components/image-search-results"

export default function SimilarImagesPage({
  searchParams,
}: {
  searchParams: { image_id?: string; image_url?: string }
}) {
  const imageId = searchParams.image_id
  const imageUrl = searchParams.image_url

  return (
    <main className="min-h-screen bg-white">
      <SearchBar />
      <ImageSearchTools />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center mb-6">
          <Link href="/images">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to image search
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-medium mb-4">Visually similar images</h1>

          {imageUrl && (
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-40 h-40 relative rounded-lg overflow-hidden border border-gray-200">
                <Image src={imageUrl || "/placeholder.svg"} alt="Source image" fill className="object-cover" />
              </div>
              <div>
                <p className="text-sm text-gray-700 mb-2">Showing images visually similar to:</p>
                <p className="text-sm text-blue-600 truncate max-w-md">{imageUrl}</p>
              </div>
            </div>
          )}

          {imageId && (
            <div className="mb-6">
              <p className="text-sm text-gray-700">Showing images visually similar to selected image (ID: {imageId})</p>
            </div>
          )}
        </div>

        <Suspense fallback={<SimilarImagesSkeleton />}>
          <ImageSearchResults query="" />
        </Suspense>
      </div>
    </main>
  )
}

function SimilarImagesSkeleton() {
  return (
    <div>
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
