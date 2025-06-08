"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { validateSearchResult } from "@/app/actions/validation-actions"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle } from "lucide-react"
import { useSolanaWallet } from "@/lib/solana/wallet-context"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ValidateResultButton({ resultId }: { resultId: string }) {
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [confidence, setConfidence] = useState([75])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()
  const { connected, publicKey, connectWallet } = useSolanaWallet()

  const handleSubmit = async () => {
    if (isValid === null || !publicKey) return

    setIsSubmitting(true)

    try {
      const result = await validateSearchResult(resultId, publicKey.toString(), isValid, confidence[0] / 100)

      if (result.success) {
        toast({
          title: "Validation submitted to blockchain",
          description: "Your validation has been recorded on the Solana blockchain!",
        })
        setIsOpen(false)
      } else {
        toast({
          title: "Validation failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (open && !connected) {
      // If dialog is opening and wallet is not connected, connect wallet first
      connectWallet()
    }
    setIsOpen(open)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="link" className="text-blue-800 p-0 h-auto font-normal">
          Validate
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Validate Search Result</DialogTitle>
          <DialogDescription>
            Contribute to the P2P validation network by verifying this search result. Your validation will be stored on
            the Solana blockchain.
          </DialogDescription>
        </DialogHeader>

        {!connected ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Wallet not connected</AlertTitle>
            <AlertDescription>
              Please connect your Solana wallet to submit validations to the blockchain.
            </AlertDescription>
            <Button onClick={connectWallet} className="mt-2 w-full">
              Connect Wallet
            </Button>
          </Alert>
        ) : (
          <div className="py-4 space-y-6">
            <RadioGroup
              value={isValid === null ? undefined : isValid ? "valid" : "invalid"}
              onValueChange={(value) => setIsValid(value === "valid")}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="valid" id="valid" />
                <Label htmlFor="valid">This result is accurate and relevant</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="invalid" id="invalid" />
                <Label htmlFor="invalid">This result is inaccurate or irrelevant</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label>Confidence ({confidence}%)</Label>
              <Slider value={confidence} onValueChange={setConfidence} min={50} max={100} step={1} />
              <p className="text-sm text-gray-500">How confident are you in your assessment?</p>
            </div>

            <Alert>
              <AlertTitle>On-Chain Transaction</AlertTitle>
              <AlertDescription>
                Your validation will be permanently recorded on the Solana blockchain. This requires a small transaction
                fee.
              </AlertDescription>
            </Alert>
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isValid === null || isSubmitting || !connected}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? "Submitting to Blockchain..." : "Submit Validation"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
