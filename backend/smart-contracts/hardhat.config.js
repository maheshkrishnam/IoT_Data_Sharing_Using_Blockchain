// backend/smart-contracts/hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {}, // Local Hardhat network
    localhost: {
      url: "http://127.0.0.1:8545", // Local node URL
    },
    // goerli: { // Goerli testnet
    //   url: `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`,
    //   accounts: [process.env.PRIVATE_KEY],
    // },
  },
};