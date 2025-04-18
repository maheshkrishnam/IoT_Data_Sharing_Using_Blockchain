# Hardhat playground functions for localhost

# Steps:
## Make a node on hardhat:
```bash
npx hardhat node
```

## Compile and Deploy smart contracts + run hardhat console:
```bash
npx hardhat clean
npx hardhat run scripts/deploy.js --network localhost
npx hardhat console --network localhost
```

## Get Contract Instances:
```bash
const [admin, user1, user2, user3] = await ethers.getSigners();

const AccessControl = await ethers.getContractAt("IoTDataAccessControl", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

const Marketplace = await ethers.getContractAt("Marketplace", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");

const IoTDataNFT = await ethers.getContractAt("IoTDataNFT", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

const DataVerification = await ethers.getContractAt("DataVerification", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

const Payment = await ethers.getContractAt("Payment", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");

const IoTDataFactory = await ethers.getContractAt("IoTDataFactory", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");
```

## IoT access control:
### Grant device role:
```bash
await AccessControl.grantDeviceRole(DEVICE_ADDRESS);
await AccessControl.isDevice(userAddress);
```
```bash
await AccessControl.grantDeviceRole(user1.address);
await AccessControl.isDevice(user1.address);

await AccessControl.grantDeviceRole(user3.address);
await AccessControl.isDevice(user3.address);
```

### Grant verify role:
```bash
await AccessControl.grantVerifierRole(VERIFIER_ADDRESS);
await AccessControl.isVerifier(userAddress);
```
```bash
await AccessControl.grantVerifierRole(user2.address);
await AccessControl.isVerifier(user2.address);

await AccessControl.grantVerifierRole(user3.address);
await AccessControl.isVerifier(user3.address);
```

### Grant data buyer role:
```bash
await AccessControl.grantDataBuyerRole(VERIFIER_ADDRESS);
await AccessControl.isDataBuyer(userAddress);
```
```bash
await AccessControl.grantDataBuyerRole(user3.address);
await AccessControl.isDataBuyer(user3.address);
```

## Get all devices, verifiers and buyers
```bash
await AccessControl.getAllDevices();
await AccessControl.getAllVerifiers();
await AccessControl.getAllBuyers();
```

## Verify admin status
```bash
await AccessControl.hasRole(AccessControl.DEFAULT_ADMIN_ROLE(), admin.address);
```

## Revoke access for device, verifier and buyer
```bash
await AccessControl.connect(admin).revokeDeviceRole(user1.address);

await AccessControl.connect(admin).revokeVerifierRole(user2.address);

await AccessControl.connect(admin).revokeBuyerRole(user3.address);
```

## Generate template:
```bash
await IoTDataFactory.connect(admin).createTemplate("temperature", "Sensor:{value}C", ethers.parseEther("0.001"));
await IoTDataFactory.connect(admin).createTemplate("humidity", "Humidity:{value}%", ethers.parseEther("0.002"));
```

## Get template detail
```bash
await IoTDataFactory.getAllTemplate();
await IoTDataFactory.getTemplateCount();
await IoTDataFactory.getTemplate("temperature");
```

## Generate an IoT Data NFT (Device only):
```bash
tx = await IoTDataFactory.connect(user1).generateDataNFT("device-001", "temperature", "Dharwad", JSON.stringify({value: 30}) + "C");
receipt = await tx.wait();
event = receipt.logs.find(log => log.fragment && log.fragment.name === "DataNFTGenerated");
tokenId = event.args[0];
```

## Get detail about NFT
```bash
await IoTDataNFT.getNFTDetails(tokenId);
await IoTDataNFT.getAllNFTs();
await IoTDataNFT.getAllVerifiedNFTs();
await IoTDataNFT.getAllUnverifiedNFTs();
await IoTDataNFT.tokenURI(tokenId);
await IoTDataNFT.getOwnedNFTs(user1.address);
```

## Data verification
```bash
# Status codes: 0=PENDING, 1=APPROVED, 2=REJECTED
await DataVerification.connect(user2).verifyData(tokenId, 1, "Data verified");

await DataVerification.getVerificationStatus(tokenId);
```

### Approval from user first
```bash
await IoTDataNFT.connect(user1).approve(Marketplace.target, tokenId);
# OR
await IoTDataNFT.connect(user1).setApprovalForAll(Marketplace.target, true);
```

### Listing and buying data
```bash
await Marketplace.connect(user1).listItem(IoTDataNFT.target, tokenId, ethers.parseEther("0.0001"));

await Marketplace.connect(user3).buyItem(IoTDataNFT.target, tokenId, {value: ethers.parseEther("0.0001")});

await Marketplace.connect(user1).cancelListing(IoTDataNFT.target, tokenId);
```

## View listings
```bash
await Marketplace.getAllListings();
await Marketplace.getActiveListings();
await Marketplace.listings(IoTDataNFT.target, tokenId);
```

## Payment:
### Getters and setters
```bash
await Payment.updateFeePercentage(5);
await Payment.getSalesHistory(user1.address);
await Payment.getSalesValue(user1.address);
await Payment.getTotalSaleValue();
await Payment.getPlatformSales();
await Payment.getPlatformStats();
```
