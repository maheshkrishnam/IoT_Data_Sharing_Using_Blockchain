const hre = require("hardhat");

async function main() {
  console.log("📡 Simulating IoT Data...");

  const [owner] = await hre.ethers.getSigners();
  const factoryAddress = "0xYourFactoryAddress"; // Replace with actual deployed IoTDataFactory address

  console.log(`🔍 Using IoTDataFactory at: ${factoryAddress}`);

  const iotDataFactory = await hre.ethers.getContractAt("IoTDataFactory", factoryAddress);

  try {
    const dataTypes = await iotDataFactory.getAvailableDataTypes();
    console.log(`📋 Available Data Types: ${dataTypes.join(", ")}`);

    for (const dataType of dataTypes) {
      const metadataURL = `https://api.example.com/metadata/${Date.now()}`;

      const tx = await iotDataFactory.generateRandomData(dataType, owner.address, metadataURL);
      await tx.wait();
      console.log(`✅ Generated IoT Data NFT for type: ${dataType}`);
    }
  } catch (error) {
    console.error("❌ Error generating IoT data:", error);
  }
}

main().catch((error) => {
  console.error("❌ Simulation failed:", error);
  process.exitCode = 1;
});
