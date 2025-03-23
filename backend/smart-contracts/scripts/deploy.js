const hre = require("hardhat");

async function main() {
  // Get Contract Factory
  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");

  console.log("Deploying IoTDataNFT...");

  // Deploy Contract
  const iotDataNFT = await IoTDataNFT.deploy();

  // Wait for Deployment
  await iotDataNFT.waitForDeployment();

  console.log("IoTDataNFT deployed to:", await iotDataNFT.getAddress());
  console.log("Transaction hash:", iotDataNFT.deploymentTransaction()?.hash);
}

// Run deployment and handle errors
main().catch((error) => {
  console.error("Error in deployment:", error);
  process.exit(1);
});
