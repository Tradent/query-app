import { type Connection, type PublicKey, Transaction } from "@solana/web3.js"
import {
  createJoinNetworkInstruction,
  createSubmitValidationInstruction,
  fetchValidator,
  fetchValidationResult,
  fetchValidationsForResult,
} from "./program"
import { ValidationStatus } from "./types"

// Join the validator network
export async function joinValidatorNetwork(
  connection: Connection,
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
): Promise<boolean> {
  try {
    // Create the instruction
    const instruction = await createJoinNetworkInstruction(wallet.publicKey)

    // Create and sign the transaction
    const transaction = new Transaction().add(instruction)
    transaction.feePayer = wallet.publicKey
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash

    const signedTransaction = await wallet.signTransaction(transaction)

    // In a real implementation, we would send the transaction
    // For now, we'll simulate success
    console.log("Joining validator network with transaction:", signedTransaction)

    return true
  } catch (error) {
    console.error("Error joining validator network:", error)
    return false
  }
}

// Submit a validation to the blockchain
export async function submitValidationToBlockchain(
  connection: Connection,
  wallet: { publicKey: PublicKey; signTransaction: (tx: Transaction) => Promise<Transaction> },
  resultId: string,
  isValid: boolean,
  confidence: number,
): Promise<boolean> {
  try {
    // Create the instruction
    const instruction = await createSubmitValidationInstruction(wallet.publicKey, resultId, isValid, confidence)

    // Create and sign the transaction
    const transaction = new Transaction().add(instruction)
    transaction.feePayer = wallet.publicKey
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash

    const signedTransaction = await wallet.signTransaction(transaction)

    // In a real implementation, we would send the transaction
    // For now, we'll simulate success
    console.log("Submitting validation with transaction:", signedTransaction)

    return true
  } catch (error) {
    console.error("Error submitting validation:", error)
    return false
  }
}

// Get the validation status for a search result
export async function getValidationStatus(
  connection: Connection,
  resultId: string,
): Promise<{ status: ValidationStatus; confidence: number } | null> {
  try {
    const result = await fetchValidationResult(connection, resultId)

    if (!result) {
      return { status: ValidationStatus.PENDING, confidence: 0 }
    }

    return {
      status: result.status,
      confidence: result.confidence,
    }
  } catch (error) {
    console.error("Error getting validation status:", error)
    return null
  }
}

// Check if a user is a validator
export async function isValidator(connection: Connection, publicKey: PublicKey): Promise<boolean> {
  try {
    const validator = await fetchValidator(connection, publicKey)
    return validator !== null
  } catch (error) {
    console.error("Error checking if user is validator:", error)
    return false
  }
}

// Get validator details
export async function getValidatorDetails(connection: Connection, publicKey: PublicKey) {
  try {
    return await fetchValidator(connection, publicKey)
  } catch (error) {
    console.error("Error getting validator details:", error)
    return null
  }
}

// Get all validations for a result
export async function getValidationsForResult(connection: Connection, resultId: string) {
  try {
    return await fetchValidationsForResult(connection, resultId)
  } catch (error) {
    console.error("Error getting validations for result:", error)
    return []
  }
}
