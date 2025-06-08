"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSolanaWallet } from "@/lib/solana/wallet-context"
import { getValidationStatus, getValidationsForResult } from "@/lib/solana/validation-service"
import { ValidationStatus } from "@/lib/solana/types"

export function OnChainValidationDetails({ resultId }: { resultId: string }) {
  const [loading, setLoading] = useState(true)
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null)
  const [confidence, setConfidence] = useState(0)
  const [validations, setValidations] = useState<any[]>([])
  const { connection } = useSolanaWallet()

  useEffect(() => {
    const fetchData = async () => {
      if (!connection) return

      setLoading(true)
      try {
        // Fetch validation status
        const status = await getValidationStatus(connection, resultId)
        if (status) {
          setValidationStatus(status.status)
          setConfidence(status.confidence)
        }

        // Fetch individual validations
        const validationsList = await getValidationsForResult(connection, resultId)
        setValidations(validationsList)
      } catch (error) {
        console.error("Error fetching validation details:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [connection, resultId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-full" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusBadge = () => {
    switch (validationStatus) {
      case ValidationStatus.VALIDATED:
        return <Badge className="bg-green-100 text-green-800">Validated</Badge>
      case ValidationStatus.DISPUTED:
        return <Badge className="bg-yellow-100 text-yellow-800">Disputed</Badge>
      case ValidationStatus.REJECTED:
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
      default:
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Blockchain Validation</CardTitle>
          {getStatusBadge()}
        </div>
        <CardDescription>Validation data stored on the Solana blockchain</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">Confidence Score</p>
            <div className="flex items-center mt-1">
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600" style={{ width: `${confidence * 100}%` }} />
              </div>
              <span className="ml-2 text-sm">{Math.round(confidence * 100)}%</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Recent Validations</p>
            {validations.length === 0 ? (
              <p className="text-sm text-gray-500">No validations recorded yet</p>
            ) : (
              <ul className="space-y-2">
                {validations.map((validation, index) => (
                  <li key={index} className="text-sm border-b pb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        {validation.validator.toString().slice(0, 4)}...{validation.validator.toString().slice(-4)}
                      </span>
                      <Badge variant="outline" className={validation.isValid ? "bg-green-50" : "bg-red-50"}>
                        {validation.isValid ? "Valid" : "Invalid"}
                      </Badge>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-gray-500">Confidence: {Math.round(validation.confidence * 100)}%</span>
                      <span className="text-gray-500 text-xs">
                        {new Date(validation.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="text-xs text-gray-500 mt-2">
            <p>
              Transaction ID: {resultId.slice(0, 8)}...{resultId.slice(-8)}
            </p>
            <p>Last updated: {new Date().toLocaleString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
