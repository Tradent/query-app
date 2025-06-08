import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ValidateResultButton } from "@/components/validate-result-button"
import { Shield, ChevronRight, ExternalLink } from "lucide-react"

// Mock function to simulate fetching search results
async function fetchSearchResults(query: string) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock data
  return [
    {
      id: 1,
      title: `Solana DeFi: ${query}`,
      metric: "1.2M",
      change: "+12.5%",
      description: "Daily search volume",
      url: "https://example.com/solana-defi",
      validationStatus: "validated",
      validationConfidence: 0.95,
    },
    {
      id: 2,
      title: `Web3 Development: ${query}`,
      metric: "845K",
      change: "+23.1%",
      description: "Developer activity",
      url: "https://example.com/web3-dev",
      validationStatus: "pending",
      validationConfidence: 0.4,
    },
    {
      id: 3,
      title: `${query} Market Trends`,
      metric: "4,128",
      change: "+5.3%",
      description: "Transactions per second",
      url: "https://example.com/market-trends",
      validationStatus: "validated",
      validationConfidence: 0.87,
    },
    {
      id: 4,
      title: `P2P Research: ${query}`,
      metric: "99.8%",
      change: "+0.3%",
      description: "Validation accuracy",
      url: "https://example.com/p2p-research",
      validationStatus: "disputed",
      validationConfidence: 0.65,
    },
    {
      id: 5,
      title: `${query} Implementation`,
      metric: "120ms",
      change: "-15.2%",
      description: "Average response time",
      url: "https://example.com/implementation-guide",
      validationStatus: "validated",
      validationConfidence: 0.92,
    },
    {
      id: 6,
      title: `${query} Network Analysis`,
      metric: "12,450",
      change: "+8.7%",
      description: "Active nodes in network",
      url: "https://example.com/network-analysis",
      validationStatus: "validated",
      validationConfidence: 0.89,
    },
  ]
}

export async function SearchResults({ query }: { query: string }) {
  const results = await fetchSearchResults(query)

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No results found for "{query}"</h3>
        <p className="text-gray-500 mt-2">Try adjusting your search terms or browse trending topics</p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-6">About {results.length * 1000} results (0.42 seconds)</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <SearchResultCard key={result.id} result={result} />
        ))}
      </div>

      <div className="mt-12 mb-8">
        <div className="flex justify-center">
          <Button variant="outline" size="sm" className="mx-1">
            1
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            2
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            3
          </Button>
          <Button variant="outline" size="sm" className="mx-1">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function SearchResultCard({ result }: { result: any }) {
  const isPositive = result.change.startsWith("+")

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{result.title}</CardTitle>
          <Link href={result.url} className="text-gray-400 hover:text-gray-600">
            <ExternalLink className="h-4 w-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold">{result.metric}</p>
            <p className="text-sm text-gray-500">{result.description}</p>
          </div>
          <div className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{result.change}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Badge
            variant="outline"
            className={`${
              result.validationStatus === "validated"
                ? "bg-green-50 text-green-700 border-green-200"
                : result.validationStatus === "disputed"
                  ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
            }`}
          >
            <Shield className="h-3 w-3 mr-1" />
            {result.validationStatus.charAt(0).toUpperCase() + result.validationStatus.slice(1)}
          </Badge>

          <ValidateResultButton resultId={result.id.toString()} />

          <Button variant="link" asChild className="text-blue-800 p-0 h-auto font-normal">
            <Link href={`/validation/${result.id}`}>Details</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
