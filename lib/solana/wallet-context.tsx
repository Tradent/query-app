"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js"

// Define the context type
interface SolanaWalletContextType {
  connected: boolean
  publicKey: PublicKey | null
  connecting: boolean
  connection: Connection | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

// Create the context with default values
const SolanaWalletContext = createContext<SolanaWalletContextType>({
  connected: false,
  publicKey: null,
  connecting: false,
  connection: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
})

// Hook to use the wallet context
export const useSolanaWallet = () => useContext(SolanaWalletContext)

// Provider component
export function SolanaWalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null)
  const [connecting, setConnecting] = useState(false)
  const [connection, setConnection] = useState<Connection | null>(null)

  // Initialize connection on mount
  useEffect(() => {
    const conn = new Connection(clusterApiUrl("devnet"), "confirmed")
    setConnection(conn)

    // Check if wallet was previously connected
    const checkWalletConnection = async () => {
      try {
        // In a real app, we would check if a wallet adapter is connected
        // For now, we'll just simulate no previous connection
        setConnected(false)
        setPublicKey(null)
      } catch (error) {
        console.error("Error checking wallet connection:", error)
      }
    }

    checkWalletConnection()
  }, [])

  // Connect wallet function
  const connectWallet = async () => {
    try {
      setConnecting(true)

      // In a real app, we would use a wallet adapter to connect
      // For now, we'll simulate a successful connection with a mock public key
      await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate connection delay

      const mockPublicKey = new PublicKey("Va1idationWa11etPubKey111111111111111111111")
      setPublicKey(mockPublicKey)
      setConnected(true)

      // Store connection in local storage
      localStorage.setItem("walletConnected", "true")
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setConnecting(false)
    }
  }

  // Disconnect wallet function
  const disconnectWallet = () => {
    // In a real app, we would use a wallet adapter to disconnect
    setPublicKey(null)
    setConnected(false)

    // Remove connection from local storage
    localStorage.removeItem("walletConnected")
  }

  return (
    <SolanaWalletContext.Provider
      value={{
        connected,
        publicKey,
        connecting,
        connection,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  )
}
