// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {
    uint256 public platformFeePercentage;
    address public platformWallet;

    event PaymentProcessed(
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 fee
    );

    constructor(uint256 _feePercentage, address _platformWallet) Ownable(msg.sender) {
        platformFeePercentage = _feePercentage;
        platformWallet = _platformWallet;
    }


    function processPayment(address seller) external payable nonReentrant {
        require(msg.value > 0, "Payment amount must be greater than 0");

        uint256 feeAmount = (msg.value * platformFeePercentage) / 100;
        uint256 sellerAmount = msg.value - feeAmount;

        (bool feeSuccess, ) = platformWallet.call{value: feeAmount}("");
        (bool sellerSuccess, ) = seller.call{value: sellerAmount}("");

        require(feeSuccess && sellerSuccess, "Payment transfer failed");

        emit PaymentProcessed(seller, msg.sender, msg.value, feeAmount);
    }

    function updateFeePercentage(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 20, "Fee cannot exceed 20%");
        platformFeePercentage = newFeePercentage;
    }

    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet address");
        platformWallet = newWallet;
    }
}