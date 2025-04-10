const hre = require("hardhat");

async function main() {
  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);

  // Helper function to wait for transaction confirmation
  const waitForTx = async (txPromise, description) => {
    console.log(`Waiting for ${description}...`);
    // If it's a deployment, txPromise is the contract instance; otherwise, it's a transaction
    const result = await txPromise;
    if (typeof result.wait === "function") {
      const receipt = await result.wait();
      if (receipt.status !== 1) {
        throw new Error(`${description} failed`);
      }
    }
    console.log(`${description} confirmed`);
    return result; // Return the contract instance or transaction receipt
  };

  // Deploy IoTDataNFT
  const IoTDataNFT = await hre.ethers.getContractFactory("IoTDataNFT");
  const iotDataNFT = await waitForTx(
    IoTDataNFT.deploy(deployer.address), // Assuming IoTDataNFT takes an owner arg
    "IoTDataNFT deployment"
  );
  console.log("IoTDataNFT:", iotDataNFT.target);

  // Deploy IoTDataAccessControl
  const AccessControl = await hre.ethers.getContractFactory("IoTDataAccessControl");
  const accessControl = await waitForTx(
    AccessControl.deploy(),
    "AccessControl deployment"
  );
  console.log("AccessControl:", accessControl.target);

  // Deploy DataVerification
  const DataVerification = await hre.ethers.getContractFactory("DataVerification");
  const dataVerification = await waitForTx(
    DataVerification.deploy(accessControl.target),
    "DataVerification deployment"
  );
  console.log("DataVerification:", dataVerification.target);

  // Link IoTDataNFT with DataVerification
  await waitForTx(
    iotDataNFT.setDataVerificationContract(dataVerification.target),
    "IoTDataNFT linking to DataVerification"
  );
  console.log("IoTDataNFT linked to DataVerification");

  // Link DataVerification with IoTDataNFT
  await waitForTx(
    dataVerification.setNFTContract(iotDataNFT.target),
    "DataVerification linking to IoTDataNFT"
  );
  console.log("DataVerification linked to IoTDataNFT");

  // Deploy Payment Contract
  const Payment = await hre.ethers.getContractFactory("Payment");
  const payment = await waitForTx(
    Payment.deploy(1, deployer.address), // Assuming 1 is feePercentage
    "Payment deployment"
  );
  console.log("Payment:", payment.target);

  // Deploy Marketplace
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await waitForTx(
    Marketplace.deploy(payment.target),
    "Marketplace deployment"
  );
  console.log("Marketplace:", marketplace.target);

  // Deploy IoTDataFactory (updated version)
  const IoTDataFactory = await hre.ethers.getContractFactory("IoTDataFactory");
  const dataFactory = await waitForTx(
    IoTDataFactory.deploy(iotDataNFT.target, accessControl.target, dataVerification.target),
    "IoTDataFactory deployment"
  );
  console.log("IoTDataFactory:", dataFactory.target);

  // Grant Roles
  const minterRole = await iotDataNFT.MINTER_ROLE();
  await waitForTx(
    iotDataNFT.grantRole(minterRole, dataFactory.target),
    "Granting MINTER_ROLE to IoTDataFactory"
  );
  console.log("MINTER_ROLE granted to IoTDataFactory");

  const verifierRole = await accessControl.VERIFIER_ROLE();
  await waitForTx(
    accessControl.grantRole(verifierRole, dataVerification.target),
    "Granting VERIFIER_ROLE to DataVerification"
  );
  console.log("VERIFIER_ROLE granted to DataVerification");

  const deviceRole = await accessControl.DEVICE_ROLE();
  await waitForTx(
    accessControl.grantRole(deviceRole, deployer.address),
    "Granting DEVICE_ROLE to deployer"
  );
  console.log("DEVICE_ROLE granted to deployer");

  console.log("Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });