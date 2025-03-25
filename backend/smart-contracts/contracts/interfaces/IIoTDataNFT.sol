// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IIoTDataNFT {
    function safeMint(
        address to,
        string memory uri,
        string memory deviceId,
        string memory dataType,
        string memory location
    ) external returns (uint256 tokenId);

    function getIoTData(uint256 tokenId) external view returns (
        string memory deviceId,
        uint256 timestamp,
        string memory dataType,
        string memory location
    );

    event IoTDataMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string dataType,
        string location
    );
}
