"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useRouter } from "next/navigation"
import { verifyWalletSignature } from "./auth-utils"
import { useToast } from "@/hooks/use-toast"

interface AuthContextType {
  isAuthenticated: boolean
  user: {
    publicKey: PublicKey | null
    username?: string
    avatar?: string
    lastLogin?: Date
  } | null
  loading: boolean
  error: string | null
  signIn: () => Promise<boolean>
  signOut: () => void
  clearError: () => void
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
  signIn: async () => false,
  signOut: () => {},
  clearError: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AuthContextType["user"]>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { publicKey, signMessage, connected, disconnect } = useWallet()
  const router = useRouter()
  const { toast } = useToast()

  // Clear error helper
  const clearError = () => setError(null)

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAuth = localStorage.getItem("auth")
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          if (authData.publicKey && authData.signature) {
            // Verify the stored signature
            const isValid = await verifyWalletSignature(new PublicKey(authData.publicKey), authData.signature)

            if (isValid) {
              setIsAuthenticated(true)
              setUser({
                publicKey: new PublicKey(authData.publicKey),
                username: authData.username || undefined,
                avatar: authData.avatar || undefined,
                lastLogin: authData.timestamp ? new Date(authData.timestamp) : undefined,
              })

              // Update last login time
              authData.lastLogin = Date.now()
              localStorage.setItem("auth", JSON.stringify(authData))
            } else {
              // Clear invalid auth data
              localStorage.removeItem("auth")
              setError("Stored authentication is invalid. Please sign in again.")
            }
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        localStorage.removeItem("auth")
        setError("Failed to verify authentication. Please sign in again.")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Update auth state when wallet connection changes
  useEffect(() => {
    if (!connected && isAuthenticated) {
      // If wallet disconnected but user was authenticated, sign them out
      signOut()
      toast({
        title: "Wallet disconnected",
        description: "Your wallet has been disconnected. Please reconnect to continue.",
      })
    }
  }, [connected, isAuthenticated, toast])

  const signIn = async (): Promise<boolean> => {
    if (!publicKey || !signMessage) {
      setError("Wallet not connected or signMessage not available")
      return false
    }

    try {
      setLoading(true)
      clearError()

      // Create a message for the user to sign
      const message = new TextEncoder().encode(`Sign this message to authenticate with Query-SE: ${Date.now()}`)

      // Request signature from the wallet
      const signature = await signMessage(message)

      // Verify the signature
      const isValid = await verifyWalletSignature(publicKey, signature)

      if (isValid) {
        // Store auth data
        const authData = {
          publicKey: publicKey.toString(),
          signature: Array.from(signature),
          timestamp: Date.now(),
        }

        localStorage.setItem("auth", JSON.stringify(authData))

        setIsAuthenticated(true)
        setUser({
          publicKey,
          lastLogin: new Date(),
        })

        return true
      }

      setError("Signature verification failed")
      return false
    } catch (error) {
      console.error("Error during sign in:", error)
      setError(error instanceof Error ? error.message : "Unknown error during sign in")
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = () => {
    localStorage.removeItem("auth")
    setIsAuthenticated(false)
    setUser(null)
    disconnect()
    router.push("/")

    toast({
      title: "Signed out",
      description: "You have been successfully signed out.",
    })
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
