import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { SolanaWalletProvider } from "@/lib/solana/wallet-context"
import { Providers } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Query-SE | Blockchain-Powered Search Engine",
  description: "Search the ENTIRE web in 2025 with blockchain-powered intelligence",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SolanaWalletProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow">
              <Providers>{children}</Providers>
            </div>
            <Footer />
          </div>
        </SolanaWalletProvider>
      </body>
    </html>
  )
}
