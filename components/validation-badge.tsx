"use client"

import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CheckCircle, AlertCircle, Clock, HelpCircle } from "lucide-react"

type ValidationStatus = "validated" | "disputed" | "pending" | "rejected"

interface ValidationBadgeProps {
  status: ValidationStatus
  confidence: number
}

export function ValidationBadge({ status, confidence }: ValidationBadgeProps) {
  const confidencePercent = Math.round(confidence * 100)

  const getBadgeContent = () => {
    switch (status) {
      case "validated":
        return {
          icon: <CheckCircle className="h-4 w-4 mr-1" />,
          text: "Validated",
          variant: "success",
          className: "bg-green-100 text-green-800 hover:bg-green-200",
          tooltipText: `This result has been validated by the P2P network with ${confidencePercent}% confidence.`,
        }
      case "disputed":
        return {
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          text: "Disputed",
          variant: "warning",
          className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
          tooltipText: `This result has conflicting validations with ${confidencePercent}% confidence.`,
        }
      case "pending":
        return {
          icon: <Clock className="h-4 w-4 mr-1" />,
          text: "Pending",
          variant: "outline",
          className: "bg-blue-50 text-blue-800 hover:bg-blue-100",
          tooltipText: "This result is awaiting validation from the P2P network.",
        }
      case "rejected":
        return {
          icon: <AlertCircle className="h-4 w-4 mr-1" />,
          text: "Rejected",
          variant: "destructive",
          className: "bg-red-100 text-red-800 hover:bg-red-200",
          tooltipText: `This result has been rejected by the P2P network with ${confidencePercent}% confidence.`,
        }
      default:
        return {
          icon: <HelpCircle className="h-4 w-4 mr-1" />,
          text: "Unknown",
          variant: "outline",
          className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
          tooltipText: "The validation status of this result is unknown.",
        }
    }
  }

  const { icon, text, className, tooltipText } = getBadgeContent()

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className={`flex items-center ${className}`}>
            {icon}
            {text}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
          <p className="text-xs mt-1">Confidence: {confidencePercent}%</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
