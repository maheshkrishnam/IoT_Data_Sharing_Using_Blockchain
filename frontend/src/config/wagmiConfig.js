import { createConfig, http } from "wagmi";
import { hardhat } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const localhostChain = {
  ...hardhat,
  id: 31337,
  name: "Localhost",
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
    public: { http: ["http://127.0.0.1:8545"] },
  },
};

export const wagmiConfig = createConfig(
  {
    appName: "IoT Data NFT App",
    chains: [localhostChain],
    projectId: import.meta.env.VITE_PROJECT_ID,
    transports: {
      [localhostChain.id]: http(),
    },
    connectors: [injected()],
  }
);

export { localhostChain };
