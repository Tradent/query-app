import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ValidateResultButton } from "@/components/validate-result-button"
import Link from "next/link"

interface SearchResultCardProps {
  query: string
  resultId: string
  title: string
  metric: string
  change: string
  description: string
}

export function SearchResultCard({ query, resultId, title, metric, change, description }: SearchResultCardProps) {
  // Simulate a network request or data processing
  // This makes the component behave more like the TrendCard in the blockchain-analysis page
  const isPositive = change.startsWith("+")

  return (
    <Card className="border-orange-200 hover:border-orange-300 transition-colors">
      <CardHeader className="pb-2 bg-orange-50/50">
        <CardTitle className="text-lg text-orange-800">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold">{metric}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <ValidateResultButton resultId={resultId} />
          <Link
            href={`/validation/${resultId}?q=${encodeURIComponent(query)}`}
            className="text-sm text-orange-600 hover:text-orange-700 hover:underline"
          >
            View details
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
