import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, ExternalLink } from "lucide-react"
import { OnChainValidationDetails } from "@/components/on-chain-validation-details"

// Mock function to get result details
async function getResultDetails(resultId: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: resultId,
    title: "Solana DeFi: Comprehensive Analysis",
    url: "https://example.com/solana-defi",
    source: "Blockchain Journal",
    timestamp: "2 hours ago",
    validationStatus: "validated",
    validationConfidence: 0.95,
    transactionId: "5KKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    blockHeight: 123456789,
    validatorCount: 15,
    consensusReached: true,
    consensusTimestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  }
}

export default async function ValidationDetailsPage({ params }: { params: { resultId: string } }) {
  const { resultId } = params
  const result = await getResultDetails(resultId)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/search">
          <Button variant="ghost" className="pl-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Search Results
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl">{result.title}</CardTitle>
                  <CardDescription className="mt-2">
                    <span className="font-medium">{result.source}</span> • {result.timestamp}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    result.validationStatus === "validated"
                      ? "bg-green-100 text-green-800"
                      : result.validationStatus === "disputed"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                  }
                >
                  {result.validationStatus.charAt(0).toUpperCase() + result.validationStatus.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Result Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Result ID</p>
                        <p className="font-mono text-sm">{result.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Source URL</p>
                        <a
                          href={result.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:underline flex items-center"
                        >
                          {result.url.length > 30 ? result.url.substring(0, 30) + "..." : result.url}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Validation Confidence</p>
                        <div className="flex items-center">
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-purple-600"
                              style={{ width: `${result.validationConfidence * 100}%` }}
                            />
                          </div>
                          <span className="ml-2">{Math.round(result.validationConfidence * 100)}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Validators</p>
                        <p>{result.validatorCount} validators participated</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Blockchain Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Transaction ID</p>
                        <p className="font-mono text-sm">
                          {result.transactionId.slice(0, 8)}...{result.transactionId.slice(-8)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Block Height</p>
                        <p>{result.blockHeight.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-500">Consensus Status</p>
                        <Badge
                          className={
                            result.consensusReached ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {result.consensusReached ? "Consensus Reached" : "Pending Consensus"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Consensus Timestamp</p>
                        <p>{new Date(result.consensusTimestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Shield className="mr-2 h-4 w-4" />
                    View on Solana Explorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <OnChainValidationDetails resultId={resultId} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
