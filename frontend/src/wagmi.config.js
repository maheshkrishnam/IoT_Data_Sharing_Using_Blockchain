import { createConfig } from 'wagmi'
import { http } from 'viem'
import { hardhat, polygon } from 'viem/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Recommended',
      wallets: [injectedWallet],
    },
  ],
  {
    appName: 'My App',
    projectId: import.meta.env.VITE_PROJECT_ID
  }
)

export const config = createConfig({
  connectors,
  chains: [hardhat, polygon],
  transports: {
    [hardhat.id]: http("http://127.0.0.1:8545"),
    [polygon.id]: http(),
  },
})