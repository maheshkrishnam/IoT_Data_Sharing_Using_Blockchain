const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  const [deployer] = await hre.ethers.getSigners();
  console.log(`👷 Deployer account: ${deployer.address}`);

  // Deploy Payment Contract
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(1, deployer.address);
  await payment.waitForDeployment();
  console.log(`✅ Payment deployed to: ${payment.target}`);

  // Deploy IoTDataNFT
  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");
  const iotDataNFT = await IoTDataNFT.deploy(deployer.address);
  await iotDataNFT.waitForDeployment();
  console.log(`✅ IoTDataNFT deployed to: ${iotDataNFT.target}`);

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(payment.target);
  await marketplace.waitForDeployment();
  console.log(`✅ Marketplace deployed to: ${marketplace.target}`);

  // Deploy AccessControl
  const AccessControl = await hre.ethers.getContractFactory(
    "IoTDataAccessControl"
  );
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log(`✅ AccessControl deployed to: ${accessControl.target}`);

  // Deploy DataVerification
  const DataVerification = await hre.ethers.getContractFactory(
    "DataVerification"
  );
  const dataVerification = await DataVerification.deploy(accessControl.target);
  await dataVerification.waitForDeployment();
  console.log(`✅ DataVerification deployed to: ${dataVerification.target}`);

  // Deploy IoTDataFactory
  const IoTDataFactory = await hre.ethers.getContractFactory("IoTDataFactory");
  const dataFactory = await IoTDataFactory.deploy(
    iotDataNFT.target,
    accessControl.target,
    dataVerification.target
  );
  await dataFactory.waitForDeployment();
  console.log(`✅ IoTDataFactory deployed to: ${dataFactory.target}`);

  // Grant Roles
  console.log("🔐 Setting up roles...");

  // 1. Grant MINTER_ROLE to IoTDataFactory
  const minterRole = await iotDataNFT.MINTER_ROLE();
  const grantMinterTx = await iotDataNFT.grantRole(
    minterRole,
    dataFactory.target
  );
  await grantMinterTx.wait();
  console.log("   ✅ MINTER_ROLE granted to IoTDataFactory");

  // 2. Grant VERIFIER_ROLE via AccessControl
  const grantVerifierTx = await accessControl.grantVerifierRole(
    dataVerification.target
  );
  await grantVerifierTx.wait();
  console.log("   ✅ VERIFIER_ROLE granted to DataVerification");

  // 3. Grant DEVICE_ROLE to deployer for testing
  const grantDeviceTx = await accessControl.grantDeviceRole(deployer.address);
  await grantDeviceTx.wait();
  console.log("   ✅ DEVICE_ROLE granted to deployer");

  console.log("🎉 All contracts deployed successfully!");
  console.log("\n📜 Contract Addresses:");
  console.log(`   Payment: ${payment.target}`);
  console.log(`   IoTDataNFT: ${iotDataNFT.target}`);
  console.log(`   Marketplace: ${marketplace.target}`);
  console.log(`   AccessControl: ${accessControl.target}`);
  console.log(`   DataVerification: ${dataVerification.target}`);
  console.log(`   IoTDataFactory: ${dataFactory.target}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
