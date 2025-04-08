// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./AccessControl.sol";

interface IIoTDataNFT {
    function ownerOf(uint256 tokenId) external view returns (address);
    function updateVerificationStatus(uint256 tokenId, bool verified) external;
}

contract DataVerification is Ownable {
    IoTDataAccessControl public immutable accessControl;
    address public nftContract;

    enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    event DataVerified(
        uint256 indexed tokenId,
        VerificationStatus status,
        address indexed verifier,
        string comments
    );

    struct VerificationResult {
        VerificationStatus status;
        string comments;
        address verifier;
        uint256 timestamp;
    }

    mapping(uint256 => VerificationResult) public verificationResults;

    constructor(address _accessControlAddress) Ownable(msg.sender) {
        require(
            _accessControlAddress != address(0),
            "Invalid AccessControl address"
        );
        accessControl = IoTDataAccessControl(_accessControlAddress);
    }

    function setNFTContract(address _nftContract) external onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        nftContract = _nftContract;
    }

    function verifyData(
        uint256 tokenId,
        VerificationStatus status,
        string memory comments
    ) external {
        require(nftContract != address(0), "NFT contract not set");
        require(accessControl.isVerifier(msg.sender), "Only verifiers");
        require(
            IIoTDataNFT(nftContract).ownerOf(tokenId) != address(0),
            "Invalid token ID"
        );

        if (status == VerificationStatus.REJECTED) {
            require(bytes(comments).length > 0, "Rejection requires comments");
        }

        verificationResults[tokenId] = VerificationResult({
            status: status,
            comments: comments,
            verifier: msg.sender,
            timestamp: block.timestamp
        });

        IIoTDataNFT(nftContract).updateVerificationStatus(
            tokenId,
            status == VerificationStatus.APPROVED
        );

        emit DataVerified(tokenId, status, msg.sender, comments);
    }

    function getVerificationStatus(
        uint256 tokenId
    )
        external
        view
        returns (VerificationStatus, string memory, address, uint256)
    {
        VerificationResult memory result = verificationResults[tokenId];
        return (
            result.status,
            result.comments,
            result.verifier,
            result.timestamp
        );
    }
}
