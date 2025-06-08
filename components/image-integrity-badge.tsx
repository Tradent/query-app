"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { getImageIntegrityRecord } from "@/lib/image-integrity-service"
import type { ImageIntegrityRecord } from "@/lib/image-integrity-service"

interface ImageIntegrityBadgeProps {
  imageId: string
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export function ImageIntegrityBadge({ imageId, size = "md", showTooltip = true }: ImageIntegrityBadgeProps) {
  const [integrityRecord, setIntegrityRecord] = useState<ImageIntegrityRecord | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchIntegrityRecord = async () => {
      try {
        const record = await getImageIntegrityRecord(imageId)
        setIntegrityRecord(record)
      } catch (error) {
        console.error("Error fetching image integrity record:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchIntegrityRecord()
  }, [imageId])

  if (loading) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        <Clock className={size === "sm" ? "h-2 w-2 mr-0.5" : size === "lg" ? "h-4 w-4 mr-1" : "h-3 w-3 mr-1"} />
        <span className={size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[10px]"}>Verifying...</span>
      </Badge>
    )
  }

  if (!integrityRecord) {
    return (
      <Badge variant="outline" className="bg-gray-100 text-gray-800">
        <AlertTriangle className={size === "sm" ? "h-2 w-2 mr-0.5" : size === "lg" ? "h-4 w-4 mr-1" : "h-3 w-3 mr-1"} />
        <span className={size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[10px]"}>Unverified</span>
      </Badge>
    )
  }

  const badgeContent = () => {
    if (integrityRecord.verified && integrityRecord.manipulationProbability < 0.05) {
      return {
        icon: (
          <CheckCircle className={size === "sm" ? "h-2 w-2 mr-0.5" : size === "lg" ? "h-4 w-4 mr-1" : "h-3 w-3 mr-1"} />
        ),
        text: "Verified Original",
        className: "bg-green-100 text-green-800 border-green-200",
        tooltipText: "This image has been verified as original with blockchain proof",
      }
    } else if (integrityRecord.verified && integrityRecord.manipulationProbability < 0.1) {
      return {
        icon: <Shield className={size === "sm" ? "h-2 w-2 mr-0.5" : size === "lg" ? "h-4 w-4 mr-1" : "h-3 w-3 mr-1"} />,
        text: "Likely Original",
        className: "bg-blue-100 text-blue-800 border-blue-200",
        tooltipText: "This image is likely original with minor acceptable changes",
      }
    } else {
      return {
        icon: (
          <AlertTriangle
            className={size === "sm" ? "h-2 w-2 mr-0.5" : size === "lg" ? "h-4 w-4 mr-1" : "h-3 w-3 mr-1"}
          />
        ),
        text: "Possibly Manipulated",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        tooltipText: "This image may have been manipulated since its original registration",
      }
    }
  }

  const { icon, text, className, tooltipText } = badgeContent()

  if (!showTooltip) {
    return (
      <Badge variant="outline" className={className}>
        {icon}
        <span className={size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[10px]"}>{text}</span>
      </Badge>
    )
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={className}>
            {icon}
            <span className={size === "sm" ? "text-[8px]" : size === "lg" ? "text-xs" : "text-[10px]"}>{text}</span>
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
          <p className="text-xs mt-1">
            Verified {integrityRecord.verificationCount} times • Last verified{" "}
            {new Date(integrityRecord.lastVerifiedAt).toLocaleDateString()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
