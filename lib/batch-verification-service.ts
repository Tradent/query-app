import { verifyImageIntegrity, runAIAnalysisOnImage } from "@/lib/image-integrity-service"
import type { DetectionResult } from "@/types/ai-detection-types"
import type { BatchVerificationResult, BatchVerificationJob } from "@/types/batch-verification-types"

// Mock storage for batch verification jobs
const batchJobs: Record<string, BatchVerificationJob> = {}

/**
 * Start a batch verification job for multiple images
 */
export async function startBatchVerification(
  images: Array<{ id: string; url: string }>,
  options: { runAiAnalysis: boolean },
): Promise<string> {
  // Generate a unique job ID
  const jobId = `batch_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

  // Create a new batch job
  const job: BatchVerificationJob = {
    id: jobId,
    status: "pending",
    progress: 0,
    totalImages: images.length,
    completedImages: 0,
    startTime: Date.now(),
    endTime: null,
    results: {},
    options,
  }

  // Store the job
  batchJobs[jobId] = job

  // Start processing in the background
  processBatchJob(jobId, images, options).catch((error) => {
    console.error(`Error processing batch job ${jobId}:`, error)
    if (batchJobs[jobId]) {
      batchJobs[jobId].status = "failed"
      batchJobs[jobId].error = "Failed to process batch verification job"
    }
  })

  return jobId
}

/**
 * Process a batch verification job
 */
async function processBatchJob(
  jobId: string,
  images: Array<{ id: string; url: string }>,
  options: { runAiAnalysis: boolean },
): Promise<void> {
  const job = batchJobs[jobId]
  if (!job) return

  job.status = "processing"

  // Process images in batches of 3 for better performance
  const batchSize = 3
  const totalBatches = Math.ceil(images.length / batchSize)

  for (let i = 0; i < totalBatches; i++) {
    const startIdx = i * batchSize
    const endIdx = Math.min(startIdx + batchSize, images.length)
    const batch = images.slice(startIdx, endIdx)

    // Process batch in parallel
    const batchPromises = batch.map((image) => processImage(image, options))
    const batchResults = await Promise.all(batchPromises)

    // Update job with results
    batchResults.forEach((result, idx) => {
      const imageId = batch[idx].id
      job.results[imageId] = result
      job.completedImages++
      job.progress = Math.round((job.completedImages / job.totalImages) * 100)
    })

    // Simulate network delay between batches
    if (i < totalBatches - 1) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  job.status = "completed"
  job.endTime = Date.now()
}

/**
 * Process a single image in the batch
 */
async function processImage(
  image: { id: string; url: string },
  options: { runAiAnalysis: boolean },
): Promise<BatchVerificationResult> {
  try {
    // Verify image integrity
    const integrityResult = await verifyImageIntegrity(image.id, image.url)

    let aiAnalysisResult: DetectionResult | undefined = undefined

    // Run AI analysis if requested
    if (options.runAiAnalysis) {
      const aiResult = await runAIAnalysisOnImage(image.id, image.url)
      aiAnalysisResult = aiResult.aiAnalysis || undefined
    }

    return {
      imageId: image.id,
      imageUrl: image.url,
      verified: integrityResult.verified,
      manipulationProbability: integrityResult.manipulationProbability,
      blockchainRecord: integrityResult.blockchainRecord,
      aiAnalysis: aiAnalysisResult,
      error: null,
    }
  } catch (error) {
    console.error(`Error processing image ${image.id}:`, error)
    return {
      imageId: image.id,
      imageUrl: image.url,
      verified: false,
      manipulationProbability: 1.0,
      error: "Failed to verify image",
    }
  }
}

/**
 * Get the status of a batch verification job
 */
export function getBatchVerificationStatus(jobId: string): BatchVerificationJob | null {
  return batchJobs[jobId] || null
}

/**
 * Get all batch verification jobs
 */
export function getAllBatchVerificationJobs(): BatchVerificationJob[] {
  return Object.values(batchJobs)
}

/**
 * Cancel a batch verification job
 */
export function cancelBatchVerification(jobId: string): boolean {
  const job = batchJobs[jobId]
  if (!job || job.status === "completed" || job.status === "failed") {
    return false
  }

  job.status = "cancelled"
  job.endTime = Date.now()
  return true
}

/**
 * Delete a batch verification job
 */
export function deleteBatchVerification(jobId: string): boolean {
  if (!batchJobs[jobId]) {
    return false
  }

  delete batchJobs[jobId]
  return true
}

/**
 * Generate a summary of batch verification results
 */
export function generateBatchSummary(jobId: string): {
  totalImages: number
  verifiedCount: number
  suspiciousCount: number
  failedCount: number
  processingTimeMs: number | null
  aiAnalyzedCount: number
  manipulationDetectedCount: number
} {
  const job = batchJobs[jobId]
  if (!job) {
    return {
      totalImages: 0,
      verifiedCount: 0,
      suspiciousCount: 0,
      failedCount: 0,
      processingTimeMs: null,
      aiAnalyzedCount: 0,
      manipulationDetectedCount: 0,
    }
  }

  const results = Object.values(job.results)
  const verifiedCount = results.filter((r) => r.verified).length
  const suspiciousCount = results.filter((r) => r.manipulationProbability > 0.3).length
  const failedCount = results.filter((r) => r.error !== null).length
  const aiAnalyzedCount = results.filter((r) => r.aiAnalysis !== undefined).length
  const manipulationDetectedCount = results.filter((r) => r.aiAnalysis?.isManipulated).length

  const processingTimeMs = job.endTime ? job.endTime - job.startTime : null

  return {
    totalImages: job.totalImages,
    verifiedCount,
    suspiciousCount,
    failedCount,
    processingTimeMs,
    aiAnalyzedCount,
    manipulationDetectedCount,
  }
}
