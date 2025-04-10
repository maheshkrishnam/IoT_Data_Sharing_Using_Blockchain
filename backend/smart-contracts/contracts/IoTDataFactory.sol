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

<<<<<<< Updated upstream:backend/smart-contracts/contracts/IoTDataFactory.sol
=======
    string[] private templateType; // Array to track all template types
>>>>>>> Stashed changes:contracts/contracts/IoTDataFactory.sol
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
<<<<<<< Updated upstream:backend/smart-contracts/contracts/IoTDataFactory.sol
=======
        require(_nftAddress != address(0), "Invalid NFT address");
        require(_accessControlAddress != address(0), "Invalid access control address");
        require(_verificationAddress != address(0), "Invalid verification address");

>>>>>>> Stashed changes:contracts/contracts/IoTDataFactory.sol
        nftContract = IoTDataNFT(_nftAddress);
        accessControl = IoTDataAccessControl(_accessControlAddress);
        verificationContract = DataVerification(_verificationAddress);
    }

    function createTemplate(
        string memory dataType,
        string memory metadataTemplate,
        uint256 basePrice
    ) external onlyOwner {
<<<<<<< Updated upstream:backend/smart-contracts/contracts/IoTDataFactory.sol
=======
        // Check if dataType is new; if so, add to templateType array
        if (bytes(dataTemplates[dataType].dataType).length == 0) {
            templateType.push(dataType);
        }

>>>>>>> Stashed changes:contracts/contracts/IoTDataFactory.sol
        dataTemplates[dataType] = DataTemplate({
            dataType: dataType,
            metadataTemplate: metadataTemplate,
            basePrice: basePrice
        });

        emit DataTemplateCreated(dataType, metadataTemplate, basePrice);
    }

<<<<<<< Updated upstream:backend/smart-contracts/contracts/IoTDataFactory.sol
=======
    function getTemplate(string memory dataType) external view returns (DataTemplate memory) {
        require(bytes(dataTemplates[dataType].dataType).length > 0, "Template does not exist");
        return dataTemplates[dataType];
    }

    function getAllTemplates() external view returns (DataTemplate[] memory) {
        DataTemplate[] memory templates = new DataTemplate[](templateType.length);
        for (uint256 i = 0; i < templateType.length; i++) {
            templates[i] = dataTemplates[templateType[i]];
        }
        return templates;
    }

    function getTemplateCount() external view returns (uint256) {
        return templateType.length;
    }

>>>>>>> Stashed changes:contracts/contracts/IoTDataFactory.sol
    function generateDataNFT(
        string memory deviceId,
        string memory dataType,
        string memory location,
        string memory additionalMetadata
    ) external returns (uint256) {
        require(accessControl.isDevice(msg.sender), "Only devices can generate data");
        require(bytes(dataTemplates[dataType].dataType).length > 0, "Invalid data type");

        string memory metadata = string(
            abi.encodePacked(dataTemplates[dataType].metadataTemplate, additionalMetadata)
        );

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