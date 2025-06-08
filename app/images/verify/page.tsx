import { Suspense } from "react"
import Link from "next/link"
import { SearchBar } from "@/components/search-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { RegisterImageForm } from "@/components/register-image-form"

export default function VerifyImagePage() {
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

        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Image Integrity Verification</h1>
          <p className="text-gray-600 mb-8">
            Register and verify images on the blockchain to protect against manipulation and ensure authenticity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <RegisterImageForm />
              </Suspense>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">How It Works</h2>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Upload your image or provide a URL</li>
                  <li>We generate a unique hash of your image</li>
                  <li>The hash is stored on the Solana blockchain</li>
                  <li>Anyone can verify if the image has been manipulated</li>
                </ol>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Benefits</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tamper-proof verification using blockchain technology</li>
                  <li>Protect your images from unauthorized manipulation</li>
                  <li>Verify the authenticity of images you find online</li>
                  <li>Contribute to a more trustworthy visual web</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Use Cases</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Verify news and documentary photography</li>
                  <li>Protect creative works and intellectual property</li>
                  <li>Ensure authenticity of historical images</li>
                  <li>Combat misinformation and deepfakes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
