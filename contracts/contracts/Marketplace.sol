// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./interfaces/IMarketplace.sol";
import "./Payment.sol";

contract Marketplace is ReentrancyGuard, IMarketplace {
    struct Listing {
        uint256 price;
        address seller;
        bool isActive;
    }

    mapping(address => mapping(uint256 => Listing)) public listings;
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
        require(nft.getApproved(tokenId) == address(this), "Marketplace not approved");

        listings[nftAddress][tokenId] = Listing({
            price: price,
            seller: msg.sender,
            isActive: true
        });

        emit ItemListed(msg.sender, nftAddress, tokenId, price);
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[nftAddress][tokenId];
        require(listing.isActive, "Item not for sale");
        require(msg.value == listing.price, "Incorrect payment amount");

        IERC721 nft = IERC721(nftAddress);
        address seller = listing.seller;

        delete listings[nftAddress][tokenId];

        paymentContract.processPayment{value: msg.value}(seller);
        nft.safeTransferFrom(seller, msg.sender, tokenId);

        emit ItemSold(msg.sender, nftAddress, tokenId, listing.price);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external {
        Listing storage listing = listings[nftAddress][tokenId];
        require(listing.seller == msg.sender, "Not the seller");
        require(listing.isActive, "Listing already inactive");

        delete listings[nftAddress][tokenId];

        emit ListingCanceled(msg.sender, nftAddress, tokenId);
    }
}
