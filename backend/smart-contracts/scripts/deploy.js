const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`👷 Deploying contracts with account: ${deployer.address}`);

  // Deploy Payment contract first
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(1, deployer.address);
  await payment.waitForDeployment();
  console.log(`✅ Payment contract deployed at: ${await payment.getAddress()}`);

  // Deploy IoTDataNFT (assuming it needs an admin address)
  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");
  const iotDataNFT = await IoTDataNFT.deploy(deployer.address);
  await iotDataNFT.waitForDeployment();
  console.log(`✅ IoTDataNFT deployed at: ${await iotDataNFT.getAddress()}`);

  // Deploy Marketplace (✅ FIXED: Uses only payment contract address)
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(await payment.getAddress());
  await marketplace.waitForDeployment();
  console.log(`✅ Marketplace deployed at: ${await marketplace.getAddress()}`);

  // Deploy AccessControl first (needed for DataVerification)
  const AccessControl = await hre.ethers.getContractFactory("IoTDataAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log(`✅ AccessControl deployed at: ${await accessControl.getAddress()}`);

  // Deploy DataVerification contract
  const DataVerification = await hre.ethers.getContractFactory("DataVerification");
  const dataVerification = await DataVerification.deploy(await accessControl.getAddress());
  await dataVerification.waitForDeployment();
  console.log(`✅ DataVerification deployed at: ${await dataVerification.getAddress()}`);

  // Deploy IoTDataFactory (assuming it needs NFT contract & marketplace addresses)
  const IoTDataFactory = await hre.ethers.getContractFactory("IoTDataFactory");
  const dataFactory = await IoTDataFactory.deploy(
      await iotDataNFT.getAddress(),
      await accessControl.getAddress(),
      await dataVerification.getAddress()
  );
  await dataFactory.waitForDeployment();
  console.log(`✅ IoTDataFactory deployed at: ${await dataFactory.getAddress()}`);

  // Grant VERIFIER_ROLE to DataVerification contract
  try {
    const verifierRole = await iotDataNFT.VERIFIER_ROLE();
    const tx = await iotDataNFT.grantRole(verifierRole, await dataVerification.getAddress());
    await tx.wait();
    console.log(`🔑 Granted VERIFIER_ROLE to DataVerification contract: ${await dataVerification.getAddress()}`);
  } catch (error) {
    console.error("❌ Error granting VERIFIER_ROLE:", error);
  }

  console.log("🎉 Deployment successful!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
