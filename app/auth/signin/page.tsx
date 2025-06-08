import { SignInClient } from "@/components/auth/sign-in-client"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Sign In - Query-SE",
  description: "Sign in to Query-SE using your Solana wallet",
}

export default function SignInPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in with your blockchain wallet to access Query-SE</p>
        </div>

        <SignInClient />

        <p className="text-center text-sm text-muted-foreground mt-8">
          Don't have a wallet yet?{" "}
          <Link href="https://phantom.app/" className="text-sun-600 hover:underline" target="_blank" rel="noopener">
            Get started with Phantom
          </Link>
        </p>
      </div>
    </div>
  )
}
