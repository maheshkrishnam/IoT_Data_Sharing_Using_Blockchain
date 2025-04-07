
Conversation opened. 1 unread message.

Skip to content
Using IIT Dharwad Mail with screen readers
Enable desktop notifications for IIT Dharwad Mail.   OK  No thanks
1 of 6,758
(no subject)
Inbox
Mahesh Krishnam
	
Attachments12:31 AM (0 minutes ago)
	
to me

 One attachment  •  Scanned by Gmail
	

# Steps:
## Make a node on hardhat:
```bash
npx hardhat node
```

## Compile and Deploy smart contracts + run hardhat console:
```bash
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.js --network localhost
npx hardhat console --network localhost
```

## Get Contract Instances:
```bash
const [deployer, user1, user2] = await ethers.getSigners();

const Payment = await ethers.getContractAt("Payment", "deployedContractAddress");
const IoTDataNFT = await ethers.getContractAt("IoTDataNFT", "deployedContractAddress");
const Marketplace = await ethers.getContractAt("Marketplace", "deployedContractAddress");
const AccessControl = await ethers.getContractAt("IoTDataAccessControl", "deployedContractAddress");
const DataVerification = await ethers.getContractAt("DataVerification", "deployedContractAddress");
const IoTDataFactory = await ethers.getContractAt("IoTDataFactory", "deployedContractAddress");
```
```bash
const [deployer, user1, user2, user3] = await ethers.getSigners();

const Payment = await ethers.getContractAt("Payment", "0x5FbDB2315678afecb367f032d93F642f64180aa3");
const IoTDataNFT = await ethers.getContractAt("IoTDataNFT", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
const Marketplace = await ethers.getContractAt("Marketplace", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
const AccessControl = await ethers.getContractAt("IoTDataAccessControl", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");
const DataVerification = await ethers.getContractAt("DataVerification", "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9");
const IoTDataFactory = await ethers.getContractAt("IoTDataFactory", "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707");
```

## To print each value:
```bash
console.log("deployer: ", deployer);
console.log("user1: ", user1);
console.log("user2: ", user2);
console.log("user3: ", user3);
console.log("Payment: ", Payment);
console.log("IoTDataNFT: ", IoTDataNFT);
console.log("Marketplace: ", Marketplace);
console.log("AccessControl: ", AccessControl);
console.log("DataVerification: ", DataVerification);
console.log("IoTDataFactory: ", IoTDataFactory);
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
```

### Grant verify role:
```bash
await AccessControl.grantVerifierRole(VERIFIER_ADDRESS);
await AccessControl.isVerifier(userAddress);
```
```bash
await AccessControl.grantVerifierRole(user2.address);
await AccessControl.isVerifier(user2.address);
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

## Create a data template (Admin only):
```bash
await IoTDataFactory.createTemplate("TEMPLATE_NAME", "DATA_FORMAT", COST);
```
```bash
await IoTDataFactory.createTemplate("temperature", "{sensor_id}-{location}", 100);
```

## Generate an IoT Data NFT (Device only):
```bash
const tx = await IoTDataFactory.connect(user1).generateDataNFT("DEVICE_ID", "DATA_TYPE", "LOCATION", "METADATA");
const receipt = await tx.wait();
const tokenId = receipt.logs[0].args.tokenId;
console.log(receipt);
console.log("Generated NFT Token ID:", tokenId);
```
```bash
const tx = await IoTDataFactory.connect(user1).generateDataNFT("sensor123", "temperature", "NYC", "{value: 23.5}");
const receipt = await tx.wait();
const tokenId = receipt.logs[0].args.tokenId;
console.log(receipt);
console.log("Generated NFT Token ID:", tokenId);
```

## IoTDataNFT:
### Check NFT owner:
```bash
await IoTDataNFT.ownerOf(TOKEN_ID);
```
```bash
await IoTDataNFT.ownerOf(1);
```

### Get data of NFT:
```bash
await IoTDataNFT.tokenURI(TOKEN_ID);
await IoTDataNFT.accessData(TOKEN_ID);
```
```bash
await IoTDataNFT.tokenURI(1);
await IoTDataNFT.accessData(1);
```

## DataVerification:
### Verify a data NFT (only verifiers can call this):
```bash
await DataVerification.connect(user2).verifyData(TOKEN_ID, SCORE, "COMMENT");
```
```bash
await DataVerification.connect(user2).verifyData(1, 10, "Verified Successfully");
```

### Verication status of token:
```bash
await DataVerification.getVerificationStatus(TOKEN_ID);
```
```bash
await DataVerification.getVerificationStatus(1);
```

## Marketplace:
### List an NFT for sale:
```bash
await Marketplace.connect(user1).listItem("0xNFT_CONTRACT_ADDRESS", TOKEN_ID, ethers.parseEther("PRICE_IN_ETH"));
```
```bash
await Marketplace.connect(user1).listItem("0xNFT_CONTRACT_ADDRESS", TOKEN_ID, ethers.parseEther("0.001"));
```

### Approve an NFT
```bash
await IoTDataNFT.connect(user1).approve(Marketplace.target, TOKEN_ID);
```

### Buy an NFT:
```bash
await Marketplace.connect(user2).buyItem("0xNFT_CONTRACT_ADDRESS", TOKEN_ID, { value: ethers.parseEther("PRICE_IN_ETH") });
```


### Check NFT is still listed:
```bash
const listing = await Marketplace.getNFTListing("0xNFT_CONTRACT_ADDRESS", TOKEN_ID);
console.log(listing);
```

### Cancel a listing:
```bash
await Marketplace.cancelListing("0xNFT_CONTRACT_ADDRESS", TOKEN_ID);
```

### Relisting:
```bash
const tx = await marketplaceContract.resellItem(0xNFT_CONTRACT_ADDRESS, TOKEN_ID, { value: ethers.parseEther("AMOUNT_IN_ETH") });
await tx.wait();
console.log("NFT relisted successfully!");
```

### Rate user:
```bash
const rateUser = await marketplaceContract.rateUser(userAddress, rate);
await rateUser.wait();
console.log("User rated successfully!");
```

### Get user rating:
```bash
const rating = await marketplaceContract.getUserRating(userAddress);
console.log(`User rating: ${rating}`);
```

## Payment:
### Send payment to the seller:
```bash
await Payment.connect(user2).processPayment(SELLER_ADDRESS, { value: ethers.parseEther("AMOUNT_IN_ETH") });
```

steps.md
Displaying steps.md.