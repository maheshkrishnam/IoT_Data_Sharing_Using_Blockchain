// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDataVerification {
    enum VerificationStatus { PENDING, APPROVED, REJECTED }

    function verifyData(
        uint256 tokenId,
        VerificationStatus status,
        string calldata comments
    ) external;

    function getVerificationStatus(uint256 tokenId)
        external
        view
        returns (
            VerificationStatus status,
            string memory comments,
            address verifier,
            uint256 timestamp
        );

    event DataVerified(
        uint256 indexed tokenId,
        VerificationStatus status,
        address indexed verifier,
        string comments
    );
}
