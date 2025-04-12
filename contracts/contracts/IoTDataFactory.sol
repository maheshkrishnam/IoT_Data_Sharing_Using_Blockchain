// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./IoTDataNFT.sol";
import "./IoTDataAccessControl.sol";

contract IoTDataFactory is Ownable {
    IoTDataNFT public immutable nftContract;
    IoTDataAccessControl public immutable accessControl;

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
        require(
            nftAddress != address(0) &&
                accessControlAddress != address(0) &&
                verificationAddress != address(0),
            "Invalid address"
        );

        nftContract = IoTDataNFT(nftAddress);
        accessControl = IoTDataAccessControl(accessControlAddress);
    }

    function createTemplate(
        string calldata dataType,
        string calldata metadataTemplate,
        uint256 basePrice
    ) external onlyOwner {
        require(bytes(dataType).length > 0, "Empty data type");
        require(
            bytes(dataTemplates[dataType].dataType).length == 0,
            "Template exists"
        );
        require(bytes(metadataTemplate).length > 0, "Empty template");

        templateType.push(dataType);
        dataTemplates[dataType] = DataTemplate(
            dataType,
            metadataTemplate,
            basePrice
        );
        emit DataTemplateCreated(dataType, metadataTemplate, basePrice);
    }

    function generateDataNFT(
        string calldata deviceId,
        string calldata dataType,
        string calldata location,
        string calldata additionalMetadata
    ) external returns (uint256) {
        require(accessControl.isDevice(msg.sender), "Unauthorized");
        require(bytes(deviceId).length > 0, "Invalid device ID");
        require(bytes(location).length > 0, "Invalid location");
        require(
            bytes(dataTemplates[dataType].dataType).length > 0,
            "Invalid data type"
        );

        DataTemplate memory template = dataTemplates[dataType];
        string memory metadata = string.concat(
            template.metadataTemplate,
            "|",
            additionalMetadata,
            "|",
            location,
            "|",
            deviceId
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

    function getAllTemplate() external view returns (DataTemplate[] memory) {
        DataTemplate[] memory templates = new DataTemplate[](
            templateType.length
        );
        for (uint i = 0; i < templateType.length; i++) {
            templates[i] = dataTemplates[templateType[i]];
        }
        return templates;
    }

    function getTemplateCount() external view returns (uint256) {
        return templateType.length;
    }

    function getTemplate(
        string memory dataType
    ) external view returns (DataTemplate memory) {
        return dataTemplates[dataType];
    }
}
