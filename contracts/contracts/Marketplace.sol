// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Payment.sol";

contract Marketplace is ReentrancyGuard {
    event ItemListed(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ItemSold(
        address indexed buyer,
        address indexed nftAddress,
        uint256 indexed tokenId,
        uint256 price
    );

    event ListingCanceled(
        address indexed seller,
        address indexed nftAddress,
        uint256 indexed tokenId
    );

    struct Listing {
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        address seller;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => mapping(uint256 => uint256)) public listingIndexes;

    Listing[] public allListings;
    uint256 public totalSales;

    Payment public immutable paymentContract;

    constructor(address _paymentAddress) {
        require(_paymentAddress != address(0), "Invalid payment contract");
        paymentContract = Payment(_paymentAddress);
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external {
        require(price > 0, "Price must be greater than zero");
        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the token owner");
        require(
            nft.getApproved(tokenId) == address(this),
            "Marketplace not approved"
        );

        Listing memory newListing = Listing({
            nftAddress: nftAddress,
            tokenId: tokenId,
            price: price,
            seller: msg.sender,
            isActive: true
        });

        listings[nftAddress][tokenId] = newListing;
        listingIndexes[nftAddress][tokenId] = allListings.length;
        allListings.push(newListing);

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function isListed(
        address nftAddress,
        uint256 tokenId
    ) external view returns (bool) {
        return listings[nftAddress][tokenId].isActive;
    }

    function getListingDetail(
        address nftAddress,
        uint256 tokenId
    ) external view returns (Listing memory) {
        require(listings[nftAddress][tokenId].isActive, "Item not listed");
        return listings[nftAddress][tokenId];
    }

    function getAllListings() external view returns (Listing[] memory) {
        return allListings;
    }

    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount = 0;
        for (uint i = 0; i < allListings.length; i++) {
            if (allListings[i].isActive) activeCount++;
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index = 0;
        for (uint i = 0; i < allListings.length; i++) {
            if (allListings[i].isActive) {
                activeListings[index] = allListings[i];
                index++;
            }
        }
        return activeListings;
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.isActive, "Item not for sale");
        require(msg.value == listing.price, "Incorrect payment amount");

        listing.isActive = false;

        uint256 index = listingIndexes[nftAddress][tokenId];
        allListings[index].isActive = false;

        paymentContract.processPayment{value: msg.value}(listing.seller);
        IERC721(nftAddress).safeTransferFrom(
            listing.seller,
            msg.sender,
            tokenId
        );

        totalSales++;
        emit ItemSold(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing already inactive");

        listing.isActive = false;
        allListings[listingIndexes[nftAddress][tokenId]].isActive = false;

        emit ListingCanceled(msg.sender, nftAddress, tokenId);
    }
}
