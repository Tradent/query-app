import { sha256 } from "js-sha256"
import { analyzeImageWithAI } from "@/lib/ai-manipulation-detection"
import type { DetectionResult } from "@/types/ai-detection-types"

// Types for image integrity verification
export interface ImageIntegrityRecord {
  imageId: string
  originalHash: string
  timestampCreated: number
  blockHeight: number
  transactionId: string
  verificationCount: number
  lastVerifiedAt: number
  manipulationProbability: number
  verified: boolean
  aiAnalysis?: DetectionResult
  lastAiAnalysisAt?: number
}

// Mock database of image integrity records
// In a real implementation, these would be stored on the blockchain
const mockImageIntegrityRecords: Record<string, ImageIntegrityRecord> = {
  img1: {
    imageId: "img1",
    originalHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    timestampCreated: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
    blockHeight: 123456789,
    transactionId: "5KKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 42,
    lastVerifiedAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
    manipulationProbability: 0.01,
    verified: true,
    lastAiAnalysisAt: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
  },
  img2: {
    imageId: "img2",
    originalHash: "6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b",
    timestampCreated: Date.now() - 25 * 24 * 60 * 60 * 1000,
    blockHeight: 123456800,
    transactionId: "4xRsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 18,
    lastVerifiedAt: Date.now() - 5 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.05,
    verified: true,
    lastAiAnalysisAt: Date.now() - 6 * 24 * 60 * 60 * 1000, // 6 days ago
  },
  img3: {
    imageId: "img3",
    originalHash: "d4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35",
    timestampCreated: Date.now() - 20 * 24 * 60 * 60 * 1000,
    blockHeight: 123456900,
    transactionId: "3LKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 27,
    lastVerifiedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.02,
    verified: true,
    lastAiAnalysisAt: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
  },
  img4: {
    imageId: "img4",
    originalHash: "4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce",
    timestampCreated: Date.now() - 15 * 24 * 60 * 60 * 1000,
    blockHeight: 123457000,
    transactionId: "2JKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 12,
    lastVerifiedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.15,
    verified: false,
    lastAiAnalysisAt: Date.now() - 4 * 24 * 60 * 60 * 1000, // 4 days ago
  },
  img5: {
    imageId: "img5",
    originalHash: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    timestampCreated: Date.now() - 10 * 24 * 60 * 60 * 1000,
    blockHeight: 123457100,
    transactionId: "1HKsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 31,
    lastVerifiedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.03,
    verified: true,
    lastAiAnalysisAt: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
  },
  img6: {
    imageId: "img6",
    originalHash: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    timestampCreated: Date.now() - 28 * 24 * 60 * 60 * 1000,
    blockHeight: 123457200,
    transactionId: "0GJsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 24,
    lastVerifiedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.01,
    verified: true,
    lastAiAnalysisAt: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
  },
  img7: {
    imageId: "img7",
    originalHash: "7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451",
    timestampCreated: Date.now() - 22 * 24 * 60 * 60 * 1000,
    blockHeight: 123457300,
    transactionId: "9FIsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 19,
    lastVerifiedAt: Date.now() - 4 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.08,
    verified: true,
    lastAiAnalysisAt: Date.now() - 8 * 24 * 60 * 60 * 1000, // 8 days ago
  },
  img8: {
    imageId: "img8",
    originalHash: "2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef06fdefb64a3",
    timestampCreated: Date.now() - 18 * 24 * 60 * 60 * 1000,
    blockHeight: 123457400,
    transactionId: "8EHsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 36,
    lastVerifiedAt: Date.now() - 1 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.02,
    verified: true,
    lastAiAnalysisAt: Date.now() - 9 * 24 * 60 * 60 * 1000, // 9 days ago
  },
  img9: {
    imageId: "img9",
    originalHash: "e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683",
    timestampCreated: Date.now() - 14 * 24 * 60 * 60 * 1000,
    blockHeight: 123457500,
    transactionId: "7DGsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 22,
    lastVerifiedAt: Date.now() - 3 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.04,
    verified: true,
    lastAiAnalysisAt: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
  },
  img10: {
    imageId: "img10",
    originalHash: "6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918",
    timestampCreated: Date.now() - 12 * 24 * 60 * 60 * 1000,
    blockHeight: 123457600,
    transactionId: "6CFsWtA9rV8AHzrKWj6BYDyNvmkTbUzG1rCFpkJ7rLGDrSiNwVwRZWgUQz9kGzLEY",
    verificationCount: 17,
    lastVerifiedAt: Date.now() - 2 * 24 * 60 * 60 * 1000,
    manipulationProbability: 0.12,
    verified: false,
    lastAiAnalysisAt: Date.now() - 11 * 24 * 60 * 60 * 1000, // 11 days ago
  },
}

// Generate a hash for an image
export async function generateImageHash(imageUrl: string): Promise<string> {
  // In a real implementation, this would download the image and compute a perceptual hash
  // For now, we'll simulate this process

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // For demo purposes, generate a deterministic hash based on the URL
  // In a real implementation, this would be a perceptual hash of the image content
  return sha256(imageUrl)
}

// Verify an image against its original hash on the blockchain
export async function verifyImageIntegrity(
  imageId: string,
  currentImageUrl: string,
): Promise<{
  verified: boolean
  originalHash: string
  currentHash: string
  manipulationProbability: number
  blockchainRecord?: ImageIntegrityRecord
  aiAnalysis?: DetectionResult
}> {
  // Get the blockchain record for this image
  const record = mockImageIntegrityRecords[imageId]

  if (!record) {
    return {
      verified: false,
      originalHash: "",
      currentHash: "",
      manipulationProbability: 1.0,
    }
  }

  // Generate hash for the current image
  const currentHash = await generateImageHash(currentImageUrl)

  // Compare with the original hash
  const verified = currentHash === record.originalHash

  // In a real implementation, we would use more sophisticated algorithms
  // to determine manipulation probability
  const manipulationProbability = verified ? record.manipulationProbability : 0.85

  // Return the verification result
  return {
    verified,
    originalHash: record.originalHash,
    currentHash,
    manipulationProbability,
    blockchainRecord: record,
    aiAnalysis: record.aiAnalysis,
  }
}

// Register a new image on the blockchain
export async function registerImageOnBlockchain(imageUrl: string): Promise<ImageIntegrityRecord> {
  // In a real implementation, this would create a transaction on the blockchain
  // For now, we'll simulate this process

  // Generate a hash for the image
  const imageHash = await generateImageHash(imageUrl)

  // Run AI analysis on the image
  const aiAnalysis = await analyzeImageWithAI(imageUrl)

  // Create a new record
  const newRecord: ImageIntegrityRecord = {
    imageId: `img${Date.now()}`,
    originalHash: imageHash,
    timestampCreated: Date.now(),
    blockHeight: 123460000 + Math.floor(Math.random() * 1000),
    transactionId: `${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
    verificationCount: 1,
    lastVerifiedAt: Date.now(),
    manipulationProbability: aiAnalysis.manipulationScore,
    verified: true,
    aiAnalysis,
    lastAiAnalysisAt: Date.now(),
  }

  // In a real implementation, we would store this on the blockchain
  // For now, we'll just return the new record
  return newRecord
}

// Get the integrity record for an image
export async function getImageIntegrityRecord(imageId: string): Promise<ImageIntegrityRecord | null> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 300))

  return mockImageIntegrityRecords[imageId] || null
}

// Update the verification count for an image
export async function updateVerificationCount(imageId: string): Promise<ImageIntegrityRecord | null> {
  const record = mockImageIntegrityRecords[imageId]

  if (!record) {
    return null
  }

  // Update the record
  const updatedRecord = {
    ...record,
    verificationCount: record.verificationCount + 1,
    lastVerifiedAt: Date.now(),
  }

  // In a real implementation, this would update the blockchain
  // For now, we'll just update our mock database
  mockImageIntegrityRecords[imageId] = updatedRecord

  return updatedRecord
}

// Run AI analysis on an image and update the record
export async function runAIAnalysisOnImage(
  imageId: string,
  imageUrl: string,
): Promise<{
  record: ImageIntegrityRecord | null
  aiAnalysis: DetectionResult | null
}> {
  const record = mockImageIntegrityRecords[imageId]

  if (!record) {
    return { record: null, aiAnalysis: null }
  }

  try {
    // Run AI analysis on the image
    const aiAnalysis = await analyzeImageWithAI(imageUrl)

    // Update the record with the AI analysis
    const updatedRecord = {
      ...record,
      aiAnalysis,
      lastAiAnalysisAt: Date.now(),
      // Update manipulation probability based on AI analysis
      manipulationProbability: (record.manipulationProbability + aiAnalysis.manipulationScore) / 2,
    }

    // In a real implementation, this would update the blockchain
    // For now, we'll just update our mock database
    mockImageIntegrityRecords[imageId] = updatedRecord

    return { record: updatedRecord, aiAnalysis }
  } catch (error) {
    console.error("Error running AI analysis:", error)
    return { record, aiAnalysis: null }
  }
}
