import type { PublicKey } from "@solana/web3.js"

// Validation status enum (matches our client-side enum)
export enum ValidationStatus {
  PENDING = 0,
  VALIDATED = 1,
  DISPUTED = 2,
  REJECTED = 3,
}

// Represents a validator on the blockchain
export interface OnChainValidator {
  publicKey: PublicKey
  reputation: number
  validationsCount: number
  joinedAt: number // Unix timestamp
  active: boolean
}

// Represents a validation result on the blockchain
export interface OnChainValidationResult {
  id: string
  resultId: string
  status: ValidationStatus
  confidence: number
  timestamp: number // Unix timestamp
  consensus: number // Percentage of agreement
  validatorCount: number
}

// Represents a single validation from a validator
export interface OnChainValidation {
  validator: PublicKey
  resultId: string
  isValid: boolean
  confidence: number
  timestamp: number // Unix timestamp
}

// Program account data structures
export interface ValidatorAccount {
  publicKey: PublicKey
  reputation: number
  validationsCount: number
  joinedAt: number
  active: boolean
}

export interface ValidationResultAccount {
  resultId: string
  status: ValidationStatus
  confidence: number
  timestamp: number
  consensus: number
  validatorCount: number
  validations: PublicKey[] // Array of validation account public keys
}

export interface ValidationAccount {
  validator: PublicKey
  resultId: string
  isValid: boolean
  confidence: number
  timestamp: number
}

// Program instruction types
export enum ValidationInstruction {
  JOIN_NETWORK = 0,
  SUBMIT_VALIDATION = 1,
  UPDATE_VALIDATOR_STATUS = 2,
  UPDATE_RESULT_STATUS = 3,
}
