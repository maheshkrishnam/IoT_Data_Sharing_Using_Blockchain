// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IDataVerification.sol";
import "./AccessControl.sol";

contract DataVerification is Ownable, IDataVerification {
    IoTDataAccessControl public accessControl;

    struct VerificationResult {
        VerificationStatus status;
        string comments;
        address verifier;
        uint256 timestamp;
    }

    mapping(uint256 => VerificationResult) public verificationResults;

    constructor(address _accessControlAddress) Ownable(msg.sender) {
        accessControl = IoTDataAccessControl(_accessControlAddress);
    }

    function verifyData(
        uint256 tokenId,
        VerificationStatus status,
        string memory comments
    ) external {
        require(
            accessControl.isVerifier(msg.sender),
            "Only verifiers can verify data"
        );

        verificationResults[tokenId] = VerificationResult({
            status: status,
            comments: comments,
            verifier: msg.sender,
            timestamp: block.timestamp
        });

        emit DataVerified(tokenId, status, msg.sender, comments);
    }

    function getVerificationStatus(uint256 tokenId)
        external
        view
        override
        returns (VerificationStatus, string memory, address, uint256)
    {
        VerificationResult memory result = verificationResults[tokenId];
        return (result.status, result.comments, result.verifier, result.timestamp);
    }
}
