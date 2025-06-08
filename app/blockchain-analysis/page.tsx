import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function BlockchainAnalysisPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blockchain Analysis Dashboard</h1>

      <Tabs defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="trends">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Suspense fallback={<CardSkeleton />}>
              <TrendCard
                title="Search Volume"
                metric="1.2M"
                change="+12.5%"
                description="Daily search queries processed"
              />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <TrendCard title="Solana TPS" metric="4,128" change="+5.3%" description="Transactions per second" />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <TrendCard
                title="Active Users"
                metric="845K"
                change="+23.1%"
                description="Daily active users on the network"
              />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <TrendCard title="Data Validation" metric="99.8%" change="+0.3%" description="P2P validation accuracy" />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <TrendCard title="Query Latency" metric="120ms" change="-15.2%" description="Average response time" />
            </Suspense>

            <Suspense fallback={<CardSkeleton />}>
              <TrendCard
                title="Network Nodes"
                metric="12,450"
                change="+8.7%"
                description="Active nodes in the network"
              />
            </Suspense>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Analysis</CardTitle>
              <CardDescription>Detailed breakdown of blockchain transactions related to search queries</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Transaction analysis dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle>Token Analytics</CardTitle>
              <CardDescription>Token performance and distribution metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-12 text-gray-500">Token analytics dashboard coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}

function TrendCard({
  title,
  metric,
  change,
  description,
}: {
  title: string
  metric: string
  change: string
  description: string
}) {
  const isPositive = change.startsWith("+")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-3xl font-bold">{metric}</p>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <div className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{change}</div>
        </div>
      </CardContent>
    </Card>
  )
}

function CardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <Skeleton className="h-5 w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
    </Card>
  )
}
