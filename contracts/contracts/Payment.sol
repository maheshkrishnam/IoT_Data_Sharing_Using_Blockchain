// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Payment is Ownable, ReentrancyGuard {
    uint256 public platformFeePercentage;
    address public platformWallet;
    uint256 public platformTotalRevenue;
    uint256 private saleCounter;

    event PaymentProcessed(
        uint256 indexed saleId,
        address indexed seller,
        address indexed buyer,
        uint256 amount,
        uint256 fee
    );
    event FeeUpdated(uint256 newFee);
    event WalletUpdated(address newWallet);

    struct SaleRecord {
        address buyer;
        address seller;
        uint256 amount;
        uint256 fee;
        uint256 timestamp;
    }

    mapping(address => SaleRecord[]) public salesHistory;
    mapping(address => uint256) public salesBySeller;
    SaleRecord[] private allSaleOnPlatform;

    constructor(
        uint256 _feePercentage,
        address _platformWallet
    ) Ownable(msg.sender) {
        require(_feePercentage <= 20, "Fee exceeds 20%");
        require(_platformWallet != address(0), "Invalid wallet");
        platformFeePercentage = _feePercentage;
        platformWallet = _platformWallet;
    }

    function processPayment(address seller) external payable nonReentrant {
        require(msg.value > 0, "No payment");
        require(seller != address(0), "Invalid seller");

        uint256 fee = (msg.value * platformFeePercentage) / 100;
        uint256 sellerAmount = msg.value - fee;

        (bool success1, ) = platformWallet.call{value: fee}("");
        (bool success2, ) = seller.call{value: sellerAmount}("");
        require(success1 && success2, "Transfer failed");

        SaleRecord memory record = SaleRecord(
            msg.sender,
            seller,
            msg.value,
            fee,
            block.timestamp
        );

        salesHistory[seller].push(record);
        allSaleOnPlatform.push(record);
        salesBySeller[seller] += msg.value;
        platformTotalRevenue += fee;
        saleCounter++;

        emit PaymentProcessed(saleCounter, seller, msg.sender, msg.value, fee);
    }

    function updateFeePercentage(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 20, "Fee exceeds 20%");
        platformFeePercentage = newFeePercentage;
        emit FeeUpdated(newFeePercentage);
    }

    function updatePlatformWallet(address newWallet) external onlyOwner {
        require(newWallet != address(0), "Invalid wallet");
        platformWallet = newWallet;
        emit WalletUpdated(newWallet);
    }

    function getSalesHistory(
        address seller
    ) external view returns (SaleRecord[] memory) {
        return salesHistory[seller];
    }

    function getSalesValue(address seller) external view returns (uint256) {
        return salesBySeller[seller];
    }

    function getTotalSaleValue() external view onlyOwner returns (uint256) {
        return platformTotalRevenue;
    }

    function getPlatformSales()
        external
        view
        onlyOwner
        returns (SaleRecord[] memory)
    {
        return allSaleOnPlatform;
    }

    function getPlatformStats()
        external
        view
        onlyOwner
        returns (
            uint256 totalRevenue,
            uint256 totalSales,
            uint256 avgFeePerSale
        )
    {
        totalRevenue = platformTotalRevenue;
        totalSales = allSaleOnPlatform.length;
        avgFeePerSale = totalSales > 0 ? platformTotalRevenue / totalSales : 0;
    }

    receive() external payable {
        revert("Direct payments disabled");
    }
}
