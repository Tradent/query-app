"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, XCircle, HelpCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

export function SignInClient() {
  const { connected, connecting: walletConnecting, publicKey, wallet } = useWallet()
  const { signIn, loading: authLoading } = useAuth()
  const [signingIn, setSigningIn] = useState(false)
  const [signInStatus, setSignInStatus] = useState<"idle" | "success" | "error">("idle")
  const [step, setStep] = useState<1 | 2>(1)
  const [progress, setProgress] = useState(0)
  const router = useRouter()
  const { toast } = useToast()
  const [showWalletInfo, setShowWalletInfo] = useState(false)

  // Update progress based on steps
  useEffect(() => {
    if (!connected) {
      setProgress(0)
    } else if (connected && step === 1) {
      setProgress(50)
    } else if (connected && step === 2) {
      if (signInStatus === "success") {
        setProgress(100)
      } else {
        setProgress(75)
      }
    }
  }, [connected, step, signInStatus])

  // Auto-advance to step 2 when wallet is connected
  useEffect(() => {
    if (connected && step === 1) {
      setStep(2)
    }
  }, [connected, step])

  // Handle wallet connection errors
  useEffect(() => {
    const handleWalletError = (error: Error) => {
      toast({
        title: "Wallet Connection Error",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    }

    // This is a simplified example - in a real app, you'd listen to wallet adapter events
    window.addEventListener("walletError", handleWalletError as any)
    return () => window.removeEventListener("walletError", handleWalletError as any)
  }, [toast])

  const handleSignIn = async () => {
    try {
      setSigningIn(true)
      setSignInStatus("idle")

      const success = await signIn()

      if (success) {
        setSignInStatus("success")
        toast({
          title: "Authentication successful",
          description: "You've been successfully signed in.",
        })
        // Redirect after successful sign-in
        setTimeout(() => {
          router.push("/dashboard")
        }, 1500)
      } else {
        setSignInStatus("error")
        toast({
          title: "Authentication failed",
          description: "Failed to authenticate. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error signing in:", error)
      setSignInStatus("error")
      toast({
        title: "Authentication error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      })
    } finally {
      setSigningIn(false)
    }
  }

  const getWalletStatusText = () => {
    if (walletConnecting) return "Connecting..."
    if (connected) return "Connected"
    return "Not connected"
  }

  const getWalletIcon = () => {
    if (wallet?.adapter.name === "Phantom") return "/phantom-wallet-logo.png"
    if (wallet?.adapter.name === "Solflare") return "/solflare-wallet-logo.png"
    if (wallet?.adapter.name?.includes("Backpack")) return "/backpack-wallet-logo.png"
    return "/images/metamask.png" // Default fallback
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-earth-200 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-sun-500 to-sun-600 text-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">Wallet Authentication</CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowWalletInfo(!showWalletInfo)}
                >
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Learn about blockchain wallets</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <CardDescription className="text-white/80">Secure, decentralized authentication</CardDescription>
        <Progress value={progress} className="h-1 mt-2 bg-white/20" />
      </CardHeader>

      {showWalletInfo ? (
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="font-medium text-lg">What is a Blockchain Wallet?</h3>
            <p className="text-sm text-muted-foreground">
              A blockchain wallet is a digital tool that allows you to securely store and manage your digital assets and
              identity. It's like a combination of a digital bank account and a password manager.
            </p>
            <h4 className="font-medium">Why use a wallet to sign in?</h4>
            <ul className="text-sm text-muted-foreground space-y-2 list-disc pl-5">
              <li>Enhanced security - no passwords to remember or be stolen</li>
              <li>Full control of your digital identity</li>
              <li>Seamless access to blockchain features</li>
              <li>Privacy-preserving authentication</li>
            </ul>
            <Button variant="outline" className="w-full mt-2" onClick={() => setShowWalletInfo(false)}>
              Back to Sign In
            </Button>
          </div>
        </CardContent>
      ) : (
        <>
          <CardContent className="pt-6">
            <Tabs defaultValue={step === 1 ? "connect" : "authenticate"} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="connect" disabled={step !== 1} className={step === 1 ? "text-sun-600" : ""}>
                  1. Connect Wallet
                </TabsTrigger>
                <TabsTrigger value="authenticate" disabled={step !== 2} className={step === 2 ? "text-sun-600" : ""}>
                  2. Authenticate
                </TabsTrigger>
              </TabsList>

              <TabsContent value="connect" className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-sm text-muted-foreground mb-4">Connect your blockchain wallet to continue</p>
                </div>

                <div className="flex justify-center">
                  <WalletMultiButton className="wallet-adapter-button wallet-adapter-button-trigger w-full !bg-sun-500 hover:!bg-sun-600 !rounded-md !h-10 !text-sm !font-medium" />
                </div>
              </TabsContent>

              <TabsContent value="authenticate" className="space-y-4">
                {connected && (
                  <>
                    <div className="flex items-center justify-between p-3 bg-earth-50 rounded-lg border border-earth-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-earth-200">
                          <img
                            src={getWalletIcon() || "/placeholder.svg"}
                            alt={wallet?.adapter.name || "Wallet"}
                            className="w-6 h-6"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{wallet?.adapter.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {publicKey?.toString().slice(0, 6)}...{publicKey?.toString().slice(-4)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                        {getWalletStatusText()}
                      </span>
                    </div>

                    <div className="text-center my-2">
                      <p className="text-sm text-muted-foreground">Sign a message to verify your identity</p>
                    </div>

                    <Button
                      onClick={handleSignIn}
                      disabled={signingIn || authLoading}
                      className="w-full bg-sun-500 hover:bg-sun-600"
                    >
                      {signingIn ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing...
                        </>
                      ) : (
                        <>
                          Sign Message
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    {signInStatus === "success" && (
                      <div className="flex items-center justify-center text-green-600 mt-2">
                        <CheckCircle className="mr-2 h-5 w-5" />
                        <span>Authentication successful!</span>
                      </div>
                    )}

                    {signInStatus === "error" && (
                      <div className="flex items-center justify-center text-red-600 mt-2">
                        <XCircle className="mr-2 h-5 w-5" />
                        <span>Authentication failed. Please try again.</span>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="bg-earth-50 border-t border-earth-100 flex flex-col">
            <h3 className="text-sm font-medium mb-3 w-full">Supported wallets:</h3>
            <div className="flex flex-wrap gap-4 justify-center w-full">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-earth-200 shadow-sm">
                  <img src="/phantom-wallet-logo.png" alt="Phantom" className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1">Phantom</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-earth-200 shadow-sm">
                  <img src="/solflare-wallet-logo.png" alt="Solflare" className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1">Solflare</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-earth-200 shadow-sm">
                  <img src="/backpack-wallet-logo.png" alt="Backpack" className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1">Backpack</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-earth-200 shadow-sm">
                  <img src="/images/metamask.png" alt="Metamask" className="w-6 h-6" />
                </div>
                <span className="text-xs mt-1">Metamask</span>
              </div>
            </div>
          </CardFooter>
        </>
      )}
    </Card>
  )
}
