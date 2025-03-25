const hre = require("hardhat");

async function main() {
  console.log("🛠 Interacting with contracts...");

  const [user] = await hre.ethers.getSigners();
  const marketplaceAddress = "0xYourMarketplaceAddress"; // Replace with deployed Marketplace address
  const nftAddress = "0xYourNFTContractAddress"; // Replace with deployed IoTDataNFT address

  console.log(`🔗 Using Marketplace at: ${marketplaceAddress}`);
  console.log(`🔗 Using IoTDataNFT at: ${nftAddress}`);

  const marketplace = await hre.ethers.getContractAt("Marketplace", marketplaceAddress);
  const nftContract = await hre.ethers.getContractAt("IoTDataNFT", nftAddress);

  try {
    // Mint NFT (Replace with actual function if different)
    const mintTx = await nftContract.mint(user.address, "https://api.example.com/nft-metadata");
    await mintTx.wait();
    console.log("✅ IoT Data NFT Minted!");

    // Approve marketplace for NFT
    const tokenId = 1; // Replace with actual token ID
    const approveTx = await nftContract.approve(marketplaceAddress, tokenId);
    await approveTx.wait();
    console.log(`✅ Approved Marketplace to sell NFT ${tokenId}`);

    // List NFT for sale
    const price = hre.ethers.utils.parseEther("0.1"); // 0.1 ETH
    const listTx = await marketplace.listItem(nftAddress, tokenId, price);
    await listTx.wait();
    console.log(`✅ NFT ${tokenId} listed for sale at 0.1 ETH`);
  } catch (error) {
    console.error("❌ Error interacting with contract:", error);
  }
}

main().catch((error) => {
  console.error("❌ Interaction failed:", error);
  process.exitCode = 1;
});
