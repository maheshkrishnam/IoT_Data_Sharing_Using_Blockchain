// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IoTDataNFT.sol";
import "./AccessControl.sol";
import "./DataVerification.sol";

contract IoTDataFactory is Ownable {
    IoTDataNFT public nftContract;
    IoTDataAccessControl public accessControl;
    DataVerification public verificationContract;

    struct DataTemplate {
        string dataType;
        string metadataTemplate;
        uint256 basePrice;
    }

    mapping(string => DataTemplate) public dataTemplates;

    event DataTemplateCreated(
        string indexed dataType,
        string metadataTemplate,
        uint256 basePrice
    );

    event DataNFTGenerated(
        uint256 indexed tokenId,
        string indexed dataType,
        address indexed owner
    );

    constructor(
        address _nftAddress,
        address _accessControlAddress,
        address _verificationAddress
    ) Ownable(msg.sender) {
        nftContract = IoTDataNFT(_nftAddress);
        accessControl = IoTDataAccessControl(_accessControlAddress);
        verificationContract = DataVerification(_verificationAddress);
    }

    function createTemplate(
        string memory dataType,
        string memory metadataTemplate,
        uint256 basePrice
    ) external onlyOwner {
        dataTemplates[dataType] = DataTemplate({
            dataType: dataType,
            metadataTemplate: metadataTemplate,
            basePrice: basePrice
        });

        emit DataTemplateCreated(dataType, metadataTemplate, basePrice);
    }

    function generateDataNFT(
        string memory deviceId,
        string memory dataType,
        string memory location,
        string memory additionalMetadata
    ) external returns (uint256) {
        require(accessControl.isDevice(msg.sender), "Only devices can generate data");
        require(bytes(dataTemplates[dataType].dataType).length > 0, "Invalid data type");

        string memory metadata = string(abi.encodePacked(
            dataTemplates[dataType].metadataTemplate,
            additionalMetadata
        ));

        uint256 tokenId = nftContract.safeMint(
            msg.sender,
            metadata,
            deviceId,
            dataType,
            location
        );

        emit DataNFTGenerated(tokenId, dataType, msg.sender);
        return tokenId;
    }
}
