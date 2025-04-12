import { createConfig, http } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { sepolia } from 'wagmi/chains';

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

export const chains = [localhost, sepolia];

export const wagmiClient = createConfig({
  chains: [localhost, sepolia],
  connectors: [injected()],
  transports: {
    [localhost.id]: http('http://127.0.0.1:8545'),
    [sepolia.id]: http(``),
  },
});
