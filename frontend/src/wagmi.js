import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';

const localhost = {
  id: 31337,
  name: 'Localhost',
  network: 'localhost',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://127.0.0.1:8545'],
    },
    public: {
      http: ['http://127.0.0.1:8545'],
    },
  },
};

export const wagmiClient = createConfig({
  chains: [localhost],
  connectors: [injected()],
  transports: {
    [localhost.id]: http(import.meta.env.VITE_LOCALHOST_RPC_URL),
  },
});

export const chains = [localhost];