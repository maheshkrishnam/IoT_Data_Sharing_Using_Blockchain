// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// const { INFURA_API_KEY, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;

// module.exports = {
//   solidity: "0.8.20",
//   settings: {
//     optimizer: {
//       enabled: true,
//       runs: 200
//     },
//     viaIR: true,
//   },

//   networks: {
//     hardhat: {
//       chainId: 31337,
//     },

//     localhost: {
//       url: "http://127.0.0.1:8545",
//       chainId: 31337,
//     },

//     sepolia: {
//       url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
//       accounts: [PRIVATE_KEY],
//       chainId: 11155111,
//     },

//     // amoy: {
//     //   url: process.env.INFURA_AMOY_RPC_URL,
//     //   accounts: [process.env.PRIVATE_KEY],
//     //   chainId: 80002,
//     // },
//   },

//   etherscan: {
//     apiKey: {
//       sepolia: ETHERSCAN_API_KEY,
//       // amoy: process.env.POLYGONSCAN_API_KEY,
//     },
//     customChains: [
//       // {
//       //   network: "amoy",
//       //   chainId: 80002,
//       //   urls: {
//       //     apiURL: "https://api-amoy.polygonscan.com/api",
//       //     browserURL: "https://amoy.polygonscan.com"
//       //   }
//       // }
//     ]
//   }
// };











require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};