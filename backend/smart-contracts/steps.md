# Hardhat Deployment and Testing Guide

This guide will walk you through the process of deploying and testing your smart contract using Hardhat. Follow the steps below to compile, deploy, interact with your contract, and run tests.

---

## Step 1: **Compile the Smart Contract**
Before deploying your contract, you need to compile it to ensure that it's ready for deployment.
```bash
npx hardhat compile
```

---

## Step 2: **Start a Local Hardhat Node**
Start a local Ethereum node using Hardhat. This node will simulate the Ethereum blockchain, allowing you to deploy and interact with your contract in a local environment.
```bash
npx hardhat node
```

---

## Step 3: **Deploy the Contract**
Once your local network is running, deploy your smart contract using the deployment script provided in your project.
```bash
npx hardhat run scripts/deploy.js --network localhost
```

---

## Step 4: **Interact with the Deployed Contract via Hardhat Console**
Now that your contract is deployed, open the Hardhat console to interact with it directly on the local network. This will allow you to execute functions and interact with your contract in real-time.
```bash
npx hardhat console --network localhost
```

---

## Step 5: **Attach to Your Deployed Contract**
In the console, attach to the deployed contract by specifying its address and contract name. This gives you access to the contract's functions and variables.
```bash
const IoTDataNFT = await hre.ethers.getContractFactory("ContractName");
const iotDataNFT = await IoTDataNFT.attach("YourContractAddress");
```

---

## Step 6: **Mint a New Dataset**
With your contract attached, use its `mintDataset` function (or any other available function) to mint a new dataset. Provide the required parameters, such as the recipient address and metadata URL.
```bash
await iotDataNFT.mintDataset("RecipientAddress", "https://example.com/metadata.json");
```

---

## Step 7: **Run Tests**
To ensure everything is functioning as expected, run your test suite. This will check that your contract performs the desired actions correctly.
```bash
npx hardhat test
```

---

### Notes:
- Be sure to replace the placeholders such as `ContractName`, `YourContractAddress`, `RecipientAddress`, and metadata URL with actual values during execution.
- Test your contract thoroughly before moving to production.

---
