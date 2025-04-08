const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Deploy IoTDataNFT
  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");
  const iotDataNFT = await IoTDataNFT.deploy(deployer.address);
  await iotDataNFT.waitForDeployment();
  console.log("IoTDataNFT:", iotDataNFT.target);

  // Deploy AccessControl
  const AccessControl = await hre.ethers.getContractFactory("IoTDataAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log("AccessControl:", accessControl.target);

  // Deploy DataVerification
  const DataVerification = await hre.ethers.getContractFactory("DataVerification");
  const dataVerification = await DataVerification.deploy(accessControl.target);
  await dataVerification.waitForDeployment();
  console.log("DataVerification:", dataVerification.target);

  // Link IoTDataNFT with DataVerification
  await (await iotDataNFT.setDataVerificationContract(dataVerification.target)).wait();
  console.log("IoTDataNFT linked to DataVerification");

  // Link DataVerification with IoTDataNFT
  await (await dataVerification.setNFTContract(iotDataNFT.target)).wait();
  console.log("DataVerification linked to IoTDataNFT");

  // Deploy Payment Contract
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(1, deployer.address);
  await payment.waitForDeployment();
  console.log("Payment:", payment.target);

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(payment.target);
  await marketplace.waitForDeployment();
  console.log("Marketplace:", marketplace.target);

  // Deploy IoTDataFactory
  const IoTDataFactory = await hre.ethers.getContractFactory("IoTDataFactory");
  const dataFactory = await IoTDataFactory.deploy(iotDataNFT.target, accessControl.target, dataVerification.target);
  await dataFactory.waitForDeployment();
  console.log("IoTDataFactory:", dataFactory.target);

  // Grant Roles
  const minterRole = await iotDataNFT.MINTER_ROLE();
  await (await iotDataNFT.grantRole(minterRole, dataFactory.target)).wait();
  console.log("MINTER_ROLE granted to IoTDataFactory");

  await (await accessControl.grantVerifierRole(dataVerification.target)).wait();
  console.log("VERIFIER_ROLE granted to DataVerification");

  await (await accessControl.grantDeviceRole(deployer.address)).wait();
  console.log("DEVICE_ROLE granted to deployer");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
