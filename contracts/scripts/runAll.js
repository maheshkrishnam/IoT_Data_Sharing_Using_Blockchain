const hre = require("hardhat");

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const [deployer, user1, user2, user3] = await hre.ethers.getSigners();
  console.log("Deployer:", deployer.address);
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);
  console.log("User3:", user3.address);

  console.log("\nDeploying contracts...");
  const { ethers } = hre;

  const IoTDataNFT = await ethers.getContractFactory("IoTDataNFT");
  const iotDataNFT = await IoTDataNFT.deploy(deployer.address);
  await iotDataNFT.waitForDeployment();
  console.log("IoTDataNFT:", iotDataNFT.target);

  const AccessControl = await ethers.getContractFactory("IoTDataAccessControl");
  const accessControl = await AccessControl.deploy();
  await accessControl.waitForDeployment();
  console.log("AccessControl:", accessControl.target);

  const DataVerification = await ethers.getContractFactory("DataVerification");
  const dataVerification = await DataVerification.deploy(accessControl.target);
  await dataVerification.waitForDeployment();
  console.log("DataVerification:", dataVerification.target);
  console.log("DataVerification accessControl:", await dataVerification.accessControl());

  await iotDataNFT.setDataVerificationContract(dataVerification.target);
  await dataVerification.setNFTContract(iotDataNFT.target);
  console.log("Linked IoTDataNFT and DataVerification");

  const Payment = await ethers.getContractFactory("Payment");
  const payment = await Payment.deploy(1, deployer.address);
  await payment.waitForDeployment();
  console.log("Payment:", payment.target);

  const Marketplace = await ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy(payment.target);
  await marketplace.waitForDeployment();
  console.log("Marketplace:", marketplace.target);

  const IoTDataFactory = await ethers.getContractFactory("IoTDataFactory");
  const iotDataFactory = await IoTDataFactory.deploy(
    iotDataNFT.target,
    accessControl.target,
    dataVerification.target
  );
  await iotDataFactory.waitForDeployment();
  console.log("IoTDataFactory:", iotDataFactory.target);

  const minterRole = await iotDataNFT.MINTER_ROLE();
  await iotDataNFT.grantRole(minterRole, iotDataFactory.target);
  console.log("MINTER_ROLE granted to IoTDataFactory");

  console.log("\nGranting roles...");
  const deviceRoleTx = await accessControl.grantDeviceRole(user1.address);
  await deviceRoleTx.wait();
  console.log("DEVICE_ROLE granted to user1:", await accessControl.isDevice(user1.address));

  const verifierRoleTx = await accessControl.grantVerifierRole(user2.address);
  await verifierRoleTx.wait();
  console.log("VERIFIER_ROLE granted to user2:", await accessControl.isVerifier(user2.address));
  console.log("VERIFIER_ROLE hash:", await accessControl.VERIFIER_ROLE());
  console.log("User2 has VERIFIER_ROLE:", await accessControl.hasRole(
    await accessControl.VERIFIER_ROLE(),
    user2.address
  ));

  const buyerRoleTx = await accessControl.grantDataBuyerRole(user3.address);
  await buyerRoleTx.wait();
  console.log("DATABUYER_ROLE granted to user3:", await accessControl.isDataBuyer(user3.address));

  console.log("\nCreating data template...");
  const templateTx = await iotDataFactory.createTemplate("temperature", "{sensor_id}-{location}", 100);
  await templateTx.wait();
  console.log("Template 'temperature' created");

  console.log("\nGenerating IoT Data NFT...");
  const nftTx = await iotDataFactory.connect(user1).generateDataNFT(
    "sensor123",
    "temperature",
    "NYC",
    JSON.stringify({ value: 23.5 })
  );
  const receipt = await nftTx.wait();
  const event = receipt.logs.find((log) => log.fragment && log.fragment.name === "DataNFTGenerated");
  const tokenId = event.args[0];
  console.log("Generated NFT Token ID:", tokenId.toString());

  console.log("\nChecking NFT details...");
  console.log("NFT Owner:", await iotDataNFT.ownerOf(tokenId));
  console.log("NFT URI:", await iotDataNFT.tokenURI(tokenId));

  console.log("\nVerifying NFT...");
  console.log("User2 is verifier before verifyData:", await accessControl.isVerifier(user2.address));
  const acContract = await ethers.getContractAt("IoTDataAccessControl", await dataVerification.accessControl());
  console.log("Calling isVerifier from DataVerification:", await acContract.isVerifier(user2.address));
  await delay(1000); // Add delay to ensure state propagation
  const verifyTx = await dataVerification.connect(user2).verifyData(tokenId, 1, "Verified Successfully");
  await verifyTx.wait();
  console.log("Verification Status:", (await dataVerification.getVerificationStatus(tokenId))[0].toString());

  console.log("\nApproving and listing NFT...");
  const approveTx = await iotDataNFT.connect(user1).approve(marketplace.target, tokenId);
  await approveTx.wait();
  console.log("Approved Address:", await iotDataNFT.getApproved(tokenId));

  const listTx = await marketplace.connect(user1).listItem(
    iotDataNFT.target,
    tokenId,
    ethers.parseEther("0.000001")
  );
  await listTx.wait();
  const listing = await marketplace.listings(iotDataNFT.target, tokenId);
  console.log("Listing:", listing);

  console.log("\nBuying NFT...");
  const buyTx = await marketplace.connect(user3).buyItem(iotDataNFT.target, tokenId, {
    value: ethers.parseEther("0.000001"),
  });
  await buyTx.wait();
  console.log("New NFT Owner:", await iotDataNFT.ownerOf(tokenId));
  console.log("Listing after purchase:", await marketplace.listings(iotDataNFT.target, tokenId));

  console.log("\nProcessing payment...");
  const paymentTx = await payment.connect(user3).processPayment(user1.address, {
    value: ethers.parseEther("0.000001"),
  });
  await paymentTx.wait();
  console.log("Payment processed");

  console.log("\nAll steps completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });