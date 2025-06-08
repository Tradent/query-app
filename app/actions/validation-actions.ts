"use server"

import { revalidatePath } from "next/cache"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"
import { submitValidationToBlockchain, joinValidatorNetwork } from "@/lib/solana/validation-service"

// Mock wallet for server actions (in a real app, this would be handled differently)
const mockWallet = {
  publicKey: new PublicKey("Va1idationWa11etPubKey111111111111111111111"),
  signTransaction: async (tx: any) => tx,
}

// Submit a validation for a search result
export async function validateSearchResult(
  resultId: string,
  validatorPublicKey: string,
  isValid: boolean,
  confidence = 0.9,
): Promise<{ success: boolean; message: string }> {
  try {
    // Create connection
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

    // Convert validator public key string to PublicKey
    const publicKey = new PublicKey(validatorPublicKey)

    // Submit validation to blockchain
    const success = await submitValidationToBlockchain(
      connection,
      { ...mockWallet, publicKey },
      resultId,
      isValid,
      confidence,
    )

    if (!success) {
      return {
        success: false,
        message: "Failed to submit validation to blockchain",
      }
    }

    // Revalidate the search results page to reflect the new validation
    revalidatePath("/search")
    revalidatePath("/validation-network")

    return {
      success: true,
      message: "Validation submitted successfully to the blockchain",
    }
  } catch (error) {
    console.error("Error submitting validation:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

// Join the validator network
export async function joinNetwork(publicKeyString: string): Promise<{
  success: boolean
  validator?: any
  message?: string
}> {
  try {
    // Create connection
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

    // Convert public key string to PublicKey
    const publicKey = new PublicKey(publicKeyString)

    // Join the network on blockchain
    const success = await joinValidatorNetwork(connection, { ...mockWallet, publicKey })

    if (!success) {
      return {
        success: false,
        message: "Failed to join validator network on blockchain",
      }
    }

    // Revalidate the validation network page
    revalidatePath("/validation-network")

    return {
      success: true,
      validator: {
        id: publicKey.toString(),
        publicKey: publicKeyString,
        reputation: 80,
        validationsCount: 0,
        joinedAt: new Date(),
      },
    }
  } catch (error) {
    console.error("Error joining validator network:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
