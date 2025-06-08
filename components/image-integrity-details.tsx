"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckCircle, AlertTriangle, Shield, ExternalLink } from "lucide-react"
import { verifyImageIntegrity, updateVerificationCount } from "@/lib/image-integrity-service"
import type { ImageIntegrityRecord } from "@/lib/image-integrity-service"

interface ImageIntegrityDetailsProps {
  imageId: string
  imageUrl: string
}

export function ImageIntegrityDetails({ imageId, imageUrl }: ImageIntegrityDetailsProps) {
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean
    originalHash: string
    currentHash: string
    manipulationProbability: number
    blockchainRecord?: ImageIntegrityRecord
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [verifying, setVerifying] = useState(false)

  useEffect(() => {
    const verifyImage = async () => {
      setLoading(true)
      try {
        const result = await verifyImageIntegrity(imageId, imageUrl)
        setVerificationResult(result)
      } catch (error) {
        console.error("Error verifying image integrity:", error)
      } finally {
        setLoading(false)
      }
    }

    verifyImage()
  }, [imageId, imageUrl])

  const handleVerifyNow = async () => {
    setVerifying(true)
    try {
      // Verify the image again
      const result = await verifyImageIntegrity(imageId, imageUrl)

      // Update the verification count
      if (result.blockchainRecord) {
        await updateVerificationCount(imageId)
      }

      // Update the UI
      setVerificationResult(result)
    } catch (error) {
      console.error("Error verifying image:", error)
    } finally {
      setVerifying(false)
    }
  }

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

  if (!verificationResult || !verificationResult.blockchainRecord) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
            Not Registered on Blockchain
          </CardTitle>
          <CardDescription>
            This image has not been registered on the blockchain for integrity verification.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">
            Images must be registered on the blockchain to verify their integrity and detect manipulation.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Register This Image</Button>
        </CardFooter>
      </Card>
    )
  }

  const { verified, originalHash, currentHash, manipulationProbability, blockchainRecord } = verificationResult
  const manipulationPercentage = Math.round(manipulationProbability * 100)
  const integrityPercentage = 100 - manipulationPercentage

  const getStatusIcon = () => {
    if (verified && manipulationProbability < 0.05) {
      return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
    } else if (verified && manipulationProbability < 0.1) {
      return <Shield className="h-5 w-5 text-blue-500 mr-2" />
    } else {
      return <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
    }
  }

  const getStatusTitle = () => {
    if (verified && manipulationProbability < 0.05) {
      return "Verified Original Image"
    } else if (verified && manipulationProbability < 0.1) {
      return "Likely Original Image"
    } else {
      return "Possibly Manipulated Image"
    }
  }

  const getStatusDescription = () => {
    if (verified && manipulationProbability < 0.05) {
      return "This image matches its original blockchain record with high confidence."
    } else if (verified && manipulationProbability < 0.1) {
      return "This image closely matches its original blockchain record with minor acceptable differences."
    } else {
      return "This image may have been manipulated since it was registered on the blockchain."
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          {getStatusIcon()}
          {getStatusTitle()}
        </CardTitle>
        <CardDescription>{getStatusDescription()}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Image Integrity Score</span>
            <span className="text-sm font-medium">{integrityPercentage}%</span>
          </div>
          <Progress value={integrityPercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-1">
            {integrityPercentage >= 95
              ? "High integrity - image matches original"
              : integrityPercentage >= 90
                ? "Good integrity - minor acceptable differences"
                : "Low integrity - significant differences detected"}
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-sm">
            <span className="font-medium">Registered on blockchain:</span>{" "}
            {new Date(blockchainRecord.timestampCreated).toLocaleDateString()}
          </div>
          <div className="text-sm">
            <span className="font-medium">Verification count:</span> {blockchainRecord.verificationCount} times
          </div>
          <div className="text-sm">
            <span className="font-medium">Last verified:</span>{" "}
            {new Date(blockchainRecord.lastVerifiedAt).toLocaleDateString()}
          </div>
          <div className="text-sm">
            <span className="font-medium">Block height:</span> {blockchainRecord.blockHeight.toLocaleString()}
          </div>
        </div>

        <div className="pt-2">
          <div className="text-xs text-gray-500 mb-1">Transaction ID</div>
          <div className="flex items-center justify-between">
            <code className="text-xs bg-gray-100 p-1 rounded">
              {blockchainRecord.transactionId.slice(0, 8)}...{blockchainRecord.transactionId.slice(-8)}
            </code>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">View on Solana Explorer</span>
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleVerifyNow} disabled={verifying} className="w-full">
          {verifying ? "Verifying..." : "Verify Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
