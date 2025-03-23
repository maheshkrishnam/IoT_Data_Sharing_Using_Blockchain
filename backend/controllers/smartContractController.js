// backend/controllers/smartContractController.js
import { ethers } from 'ethers';
import IoTDataNFT from '../smart-contracts/artifacts/contracts/IoTDataNFT.sol/IoTDataNFT.json';

const provider = new ethers.providers.JsonRpcProvider('http://localhost:8545'); // Local Hardhat node
const signer = provider.getSigner();
const contract = new ethers.Contract(
  '0xYourContractAddress', // Replace with deployed contract address
  IoTDataNFT.abi,
  signer
);

// Example function to mint an NFT
async function mintNFT(recipient, tokenURI) {
  const tx = await contract.mintDataset(recipient, tokenURI);
  await tx.wait();
  console.log('NFT minted successfully!');
}

export { mintNFT };