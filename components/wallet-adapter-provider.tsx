"use client"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { type ReactNode, useMemo } from "react"
import { getWalletAdapters, getSolanaNetwork } from "@/lib/solana/wallet-adapter-config"

// Import the styles
import "@solana/wallet-adapter-react-ui/styles.css"

export function WalletAdapterProvider({ children }: { children: ReactNode }) {
  const { network, endpoint } = getSolanaNetwork()

  // Set up wallet adapters
  const wallets = useMemo(() => getWalletAdapters(), [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
