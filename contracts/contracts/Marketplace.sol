// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
// import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "./Payment.sol";

contract Marketplace is ReentrancyGuard {
    struct Listing {
        address nftAddress;
        uint256 tokenId;
        uint256 price;
        address seller;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
    Listing[] public allListings;
    Payment public immutable paymentContract;

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

    constructor(address _paymentAddress) {
        require(_paymentAddress != address(0), "Invalid payment address");
        paymentContract = Payment(payable(_paymentAddress));
    }

    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be > 0");
        require(isERC721(nftAddress), "Invalid NFT contract");

        IERC721 nft = IERC721(nftAddress);
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        require(nft.getApproved(tokenId) == address(this), "Not approved");

        listings[nftAddress][tokenId] = Listing(
            nftAddress,
            tokenId,
            price,
            msg.sender,
            true
        );
        allListings.push(listings[nftAddress][tokenId]);

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(
        address nftAddress,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.isActive, "Item not available");
        require(msg.value == listing.price, "Incorrect payment");

        IERC721 nft = IERC721(nftAddress);
        require(nft.getApproved(tokenId) == address(this), "Approval revoked");

        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);
        paymentContract.processPayment{value: msg.value}(listing.seller);

        listing.isActive = false;
        emit ItemSold(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(
        address nftAddress,
        uint256 tokenId
    ) external nonReentrant {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Not seller");
        require(listing.isActive, "Already inactive");

        listing.isActive = false;
        emit ListingCanceled(msg.sender, nftAddress, tokenId);
    }

    function getAllListings() external view returns (Listing[] memory) {
        return allListings;
    }

    function getActiveListings() external view returns (Listing[] memory) {
        uint256 activeCount;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].isActive) activeCount++;
        }

        Listing[] memory activeListings = new Listing[](activeCount);
        uint256 index;
        for (uint256 i = 0; i < allListings.length; i++) {
            if (allListings[i].isActive) {
                activeListings[index] = allListings[i];
                index++;
            }
        }
        return activeListings;
    }

    function isERC721(address account) private view returns (bool) {
        return IERC165(account).supportsInterface(type(IERC721).interfaceId);
    }

    receive() external payable {
        revert("Direct payments not allowed");
    }
}
