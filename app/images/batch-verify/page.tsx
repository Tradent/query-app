import { Suspense } from "react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { BatchVerificationHistory } from "@/components/batch-verification-history"

export default function BatchVerifyPage() {
  return (
    <main className="min-h-screen bg-white">
      <SearchBar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-6">
          <Link href="/images">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to image search
            </Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Batch Image Verification</h1>
          <p className="text-gray-600 mb-8">
            View history of batch verification jobs and verify multiple images at once for improved efficiency.
          </p>

          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <BatchVerificationHistory />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
