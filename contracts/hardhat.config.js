require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  settings: {
    optimizer: {
      enabled: true,
      runs: 200
    },
    viaIR: true,
  },

  networks: {
    hardhat: {
      chainId: 31337,
    },

    amoy: {
      url: process.env.INFURA_AMOY_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 80002,
    },

    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: process.env.POLYGONSCAN_API_KEY,
    customChains: [{
      network: "amoy",
      chainId: 80002,
      urls: {
        apiURL: "https://api-amoy.polygonscan.com/api",
        browserURL: "https://amoy.polygonscan.com"
      }
    }]
  }
};