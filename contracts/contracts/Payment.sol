// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {
    uint256 public platformFeePercentage;
    address public platformWallet;
    uint256 saleCounter;

    event PaymentProcessed(
        uint256 indexed saleId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 fee
    );

    struct Sale{
        address buyer;
        uint256 amount;
        uint256 timestamp;
    }

    struct SaleRecord{
        address buyer;
        address seller;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => Sale[]) public salesHistory;
    mapping(address => uint256) public salesBySeller;
    SaleRecord[] private allSaleOnPlatform;
    uint256 public platformTotalRevenue;

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

        salesHistory[seller].push(Sale(msg.sender, msg.value, block.timestamp));
        allSaleOnPlatform.push(SaleRecord(msg.sender, seller, msg.value, block.timestamp));
        salesBySeller[seller] += msg.value;
        platformTotalRevenue += feeAmount;
        saleCounter++;

        emit PaymentProcessed(saleCounter, seller, msg.sender, msg.value, feeAmount);
    }

    function getSalesHistory() external view returns (Sale[] memory) {
        return salesHistory[msg.sender];
    }

    function getSalesValue() external view returns (uint256) {
        return salesBySeller[msg.sender];
    }

    function getTotalSaleValue() external view onlyOwner returns (uint256) {
        return platformTotalRevenue;
    }

    function getPlatformSales() external view onlyOwner returns (SaleRecord[] memory) {
        return allSaleOnPlatform;
    }

    function getPlatformStats() external view onlyOwner returns (
        uint256 totalRevenue,
        uint256 totalSales,
        uint256 avgSaleValue
    ) {
        totalRevenue = platformTotalRevenue;
        totalSales = allSaleOnPlatform.length;
        avgSaleValue = totalSales > 0 ? platformTotalRevenue / totalSales : 0;
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