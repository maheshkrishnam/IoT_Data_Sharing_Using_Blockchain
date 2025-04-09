const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const IoTDataAccessControl = await hre.ethers.getContractFactory("IoTDataAccessControl");
  const accessControl = await IoTDataAccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log("\nAccessControl deployed at:", await accessControl.getAddress());

  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(deployer.address);
  await marketplace.waitForDeployment();
  console.log("\nMarketplace deployed at:", await marketplace.getAddress());

  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");
  const nft = await IoTDataNFT.deploy(
    await marketplace.getAddress(),
    await accessControl.getAddress()
  );
  await nft.waitForDeployment();
  console.log("\nIoTDataNFT deployed at:", await nft.getAddress());

  const DataVerification = await hre.ethers.getContractFactory("DataVerification");
  const verification = await DataVerification.deploy(await accessControl.getAddress());
  await verification.waitForDeployment();
  console.log("\nDataVerification deployed at:", await verification.getAddress());

  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(1, await accessControl.getAddress());
  await payment.waitForDeployment();
  console.log("\nPayment deployed at:", await payment.getAddress());

  const IoTDataFactory = await hre.ethers.getContractFactory("IoTDataFactory");
  const factory = await IoTDataFactory.deploy(
    await nft.getAddress(),
    await accessControl.getAddress(),
    await verification.getAddress()
  );
  await factory.waitForDeployment();
  console.log("\nIoTDataFactory deployed at:", await factory.getAddress());

  console.log("\nSetting up roles...");
  await accessControl.grantRole(await accessControl.DEFAULT_ADMIN_ROLE(), deployer.address);
  await accessControl.grantRole(await accessControl.MINTER_ROLE(), await nft.getAddress());
  await accessControl.grantRole(await accessControl.MINTER_ROLE(), await factory.getAddress());
  await accessControl.grantRole(await accessControl.VERIFIER_ROLE(), await verification.getAddress());
  await accessControl.grantRole(await accessControl.DEFAULT_ADMIN_ROLE(), await factory.getAddress());

  await verification.connect(deployer).setNFTContract(await nft.getAddress());

  await accessControl.grantVerifierRole(await verification.getAddress());

  await nft.setDataVerificationContract(verification.getAddress());

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
