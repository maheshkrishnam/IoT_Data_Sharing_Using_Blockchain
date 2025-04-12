// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IoTDataAccessControl.sol";
import "./IoTDataNFT.sol";

contract DataVerification is Ownable, ReentrancyGuard {
    IoTDataAccessControl public immutable accessControl;

    IoTDataNFT public nftContract;

    enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    struct VerificationResult {
        VerificationStatus status;
        string comments;
        address verifier;
        uint256 timestamp;
    }

    mapping(uint256 => VerificationResult) public verificationResults;

    event DataVerified(
        uint256 indexed tokenId,
        VerificationStatus status,
        address indexed verifier,
        string comments
    );
    event NFTContractUpdated(address indexed newContract);

    constructor(address _accessControlAddress) Ownable(msg.sender) {
        require(
            _accessControlAddress != address(0),
            "Invalid AccessControl address"
        );
        accessControl = IoTDataAccessControl(_accessControlAddress);
    }

    function setNFTContract(address _nftContract) external onlyOwner {
        require(_nftContract != address(0), "Invalid address");
        require(
            IERC165(_nftContract).supportsInterface(type(IERC721).interfaceId),
            "Not ERC721"
        );

        nftContract = IoTDataNFT(_nftContract);
        emit NFTContractUpdated(_nftContract);
    }

    function verifyData(
        uint256 tokenId,
        VerificationStatus status,
        string memory comments
    ) external nonReentrant {
        require(address(nftContract) != address(0), "NFT contract not set");
        require(
            accessControl.hasRole(accessControl.VERIFIER_ROLE(), msg.sender),
            "Caller is not a verifier"
        );
        require(nftContract.ownerOf(tokenId) != address(0), "Invalid token ID");
        if (status == VerificationStatus.REJECTED) {
            require(
                bytes(comments).length >= 20,
                "Minimum 20 chars for rejection"
            );
        }

        verificationResults[tokenId] = VerificationResult({
            status: status,
            comments: comments,
            verifier: msg.sender,
            timestamp: block.timestamp
        });

        nftContract.updateVerificationStatus(
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

    receive() external payable {
        revert("Direct payments not allowed");
    }
}
