"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { joinNetwork } from "@/app/actions/validation-actions"
import { useToast } from "@/hooks/use-toast"
import { Shield, AlertCircle, CheckCircle } from "lucide-react"
import { useSolanaWallet } from "@/lib/solana/wallet-context"

export function JoinNetworkForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const { connected, publicKey, connectWallet } = useSolanaWallet()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!connected || !publicKey) {
      setError("Please connect your Solana wallet first")
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const result = await joinNetwork(publicKey.toString())

      if (result.success) {
        setSuccess(true)
        toast({
          title: "Welcome to the network!",
          description: "You have successfully joined the P2P validation network on the Solana blockchain.",
        })
      } else {
        setError(result.message || "Failed to join the network")
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <Alert className="bg-green-50 border-green-200">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <AlertTitle className="text-green-800">Successfully joined the network on the blockchain!</AlertTitle>
        <AlertDescription className="text-green-700">
          You are now a validator in the Query-SE P2P network. Your validator status is recorded on the Solana
          blockchain. Start validating search results to earn rewards and build your reputation.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="prose max-w-none">
        <h3>Why become a validator?</h3>
        <ul>
          <li>Earn QUERY tokens for each validation you perform</li>
          <li>Help ensure the accuracy and reliability of search results</li>
          <li>Build reputation in the network to increase your rewards</li>
          <li>Participate in network governance decisions</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="publicKey" className="block text-sm font-medium">
            Solana Wallet
          </label>

          {connected && publicKey ? (
            <div className="flex items-center space-x-2">
              <Input id="publicKey" value={publicKey.toString()} readOnly className="max-w-md bg-gray-50" />
              <Button variant="outline" onClick={() => {}}>
                Connected
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Input id="publicKey" placeholder="Connect your Solana wallet" readOnly className="max-w-md" />
              <Button variant="outline" onClick={connectWallet}>
                Connect
              </Button>
            </div>
          )}

          <p className="text-sm text-gray-500">
            Your Solana wallet will be used to identify you in the network and distribute rewards.
          </p>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertTitle>On-Chain Registration</AlertTitle>
          <AlertDescription>
            Joining the validator network creates an on-chain account on the Solana blockchain. This requires a small
            transaction fee.
          </AlertDescription>
        </Alert>

        <Button
          type="submit"
          disabled={isSubmitting || !connected}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Shield className="h-4 w-4" />
          {isSubmitting ? "Joining..." : "Join Validator Network"}
        </Button>
      </form>

      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium text-purple-800 mb-2">Validator Requirements</h3>
          <ul className="space-y-2 text-purple-700">
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-purple-200 p-1 mt-0.5">
                <CheckCircle className="h-3 w-3 text-purple-700" />
              </span>
              <span>Solana wallet with at least 0.1 SOL for transaction fees</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-purple-200 p-1 mt-0.5">
                <CheckCircle className="h-3 w-3 text-purple-700" />
              </span>
              <span>Reliable internet connection for consistent participation</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="rounded-full bg-purple-200 p-1 mt-0.5">
                <CheckCircle className="h-3 w-3 text-purple-700" />
              </span>
              <span>Commitment to provide accurate validations</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
