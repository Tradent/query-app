"use client"

import type { ReactNode } from "react"
import { WalletAdapterProvider } from "@/components/wallet-adapter-provider"
import { AuthProvider } from "@/lib/auth/auth-context"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WalletAdapterProvider>
      <AuthProvider>{children}</AuthProvider>
    </WalletAdapterProvider>
  )
}
