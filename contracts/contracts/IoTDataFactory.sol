// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IoTDataNFT.sol";
import "./AccessControl.sol";
import "./DataVerification.sol";

contract IoTDataFactory is Ownable {
    IoTDataNFT public immutable nftContract;
    IoTDataAccessControl public immutable accessControl;
    DataVerification public immutable verificationContract;

    struct DataTemplate {
        string dataType;
        string metadataTemplate;
        uint256 basePrice;
    }

    string[] private templateType;
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
        address nftAddress,
        address accessControlAddress,
        address verificationAddress
    ) Ownable(msg.sender) {
        nftContract = IoTDataNFT(nftAddress);
        accessControl = IoTDataAccessControl(accessControlAddress);
        verificationContract = DataVerification(verificationAddress);
    }

    function createTemplate(
        string calldata dataType,
        string calldata metadataTemplate,
        uint256 basePrice
    ) external onlyOwner {
        require(bytes(dataTemplates[dataType].dataType).length == 0, "Template already exists");
        templateType.push(dataType);
        dataTemplates[dataType] = DataTemplate({
            dataType: dataType,
            metadataTemplate: metadataTemplate,
            basePrice: basePrice
        });

        emit DataTemplateCreated(dataType, metadataTemplate, basePrice);
    }

    function getTemplate(string memory dataType) external view returns (DataTemplate memory) {
        return dataTemplates[dataType];
    }

    function getAllTemplate() external view returns (DataTemplate[] memory) {
        DataTemplate[] memory templates = new DataTemplate[](templateType.length);
        for(uint i = 0; i < templateType.length; i++) {
            templates[i] = dataTemplates[templateType[i]];
        }
        return templates;
    }

    function getTemplateCount() external view returns (uint256) {
        return templateType.length;
    }

    function generateDataNFT(
        string calldata deviceId,
        string calldata dataType,
        string calldata location,
        string calldata additionalMetadata
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
