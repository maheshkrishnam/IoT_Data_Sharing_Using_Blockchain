const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("IoTDataNFT", function () {
  let IoTDataNFT, iotDataNFT, owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    IoTDataNFT = await ethers.getContractFactory("IoTDataNFT");
    iotDataNFT = await IoTDataNFT.deploy();  // Deploy
    await iotDataNFT.waitForDeployment();    // Ensure it's deployed
  });

  it("Should mint an NFT", async function () {
    await iotDataNFT.mintDataset(addr1.address, "https://example.com/metadata.json");
    expect(await iotDataNFT.ownerOf(1)).to.equal(addr1.address);
  });
});
