import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { NetworkGraph } from "@/components/network-graph"
import { ValidatorsList } from "@/components/validators-list"
import { JoinNetworkForm } from "@/components/join-network-form"
import { BlockchainExplorer } from "@/components/blockchain-explorer"
import { getValidators, getActiveValidators } from "@/lib/validation-utils"

export default function ValidationNetworkPage() {
  // Get validators data
  const validators = getValidators()
  const activeValidators = getActiveValidators()

  // Calculate network stats
  const totalValidators = validators.length
  const activeValidatorsCount = activeValidators.length
  const averageReputation = Math.round(validators.reduce((sum, v) => sum + v.reputation, 0) / totalValidators)
  const totalValidations = validators.reduce((sum, v) => sum + v.validationsCount, 0)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">P2P Validation Network</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Validators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalValidators}</p>
            <p className="text-sm text-gray-500">Nodes in the network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Active Validators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{activeValidatorsCount}</p>
            <p className="text-sm text-gray-500">
              {Math.round((activeValidatorsCount / totalValidators) * 100)}% of network online
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Average Reputation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{averageReputation}</p>
            <p className="text-sm text-gray-500">Out of 100 points</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Validations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalValidations.toLocaleString()}</p>
            <p className="text-sm text-gray-500">Processed by the network</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="network">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="network">Network Visualization</TabsTrigger>
          <TabsTrigger value="validators">Validators</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Explorer</TabsTrigger>
          <TabsTrigger value="join">Join Network</TabsTrigger>
        </TabsList>

        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>P2P Validation Network</CardTitle>
              <CardDescription>Visual representation of the peer-to-peer validation network</CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <NetworkGraph validators={validators} activeValidators={activeValidators} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validators">
          <Card>
            <CardHeader>
              <CardTitle>Validator Nodes</CardTitle>
              <CardDescription>List of validators in the network and their statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <ValidatorsList validators={validators} activeValidators={activeValidators} />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain">
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <BlockchainExplorer />
          </Suspense>
        </TabsContent>

        <TabsContent value="join">
          <Card>
            <CardHeader>
              <CardTitle>Join the Validator Network</CardTitle>
              <CardDescription>
                Become a validator and earn rewards for contributing to the P2P validation network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JoinNetworkForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
