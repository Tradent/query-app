import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { PhantomWalletAdapter, SolflareWalletAdapter } from "@solana/wallet-adapter-wallets"
import { clusterApiUrl } from "@solana/web3.js"

// You can choose from mainnet, testnet, or devnet
const network = WalletAdapterNetwork.Devnet
const endpoint = clusterApiUrl(network)

export const getWalletAdapters = () => {
  return [new PhantomWalletAdapter(), new SolflareWalletAdapter()]
}

export const getSolanaNetwork = () => {
  return {
    network,
    endpoint,
  }
}
