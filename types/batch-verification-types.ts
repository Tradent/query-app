import type { ImageIntegrityRecord } from "@/lib/image-integrity-service"
import type { DetectionResult } from "@/types/ai-detection-types"

export type BatchVerificationStatus = "pending" | "processing" | "completed" | "failed" | "cancelled"

export interface BatchVerificationResult {
  imageId: string
  imageUrl: string
  verified: boolean
  manipulationProbability: number
  blockchainRecord?: ImageIntegrityRecord
  aiAnalysis?: DetectionResult
  error: string | null
}

export interface BatchVerificationJob {
  id: string
  status: BatchVerificationStatus
  progress: number
  totalImages: number
  completedImages: number
  startTime: number
  endTime: number | null
  results: Record<string, BatchVerificationResult>
  options: {
    runAiAnalysis: boolean
  }
  error?: string
}
