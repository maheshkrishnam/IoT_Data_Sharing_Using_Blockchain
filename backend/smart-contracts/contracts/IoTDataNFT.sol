// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract IoTDataNFT is ERC721URIStorage {
    uint256 private _tokenIds;

    constructor() ERC721("IoTDataNFT", "IDN") {}

    function mintDataset(address recipient, string memory tokenURI) public returns (uint256) {
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        _mint(recipient, newTokenId); // Mint the NFT to the recipient
        _setTokenURI(newTokenId, tokenURI); // Set the token URI (metadata)
        return newTokenId;
    }
}