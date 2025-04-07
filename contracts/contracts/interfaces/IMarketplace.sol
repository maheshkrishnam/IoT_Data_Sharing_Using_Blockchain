// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IMarketplace {
    function listItem(
        address nftAddress,
        uint256 tokenId,
        uint256 price
    ) external;

    function buyItem(address nftAddress, uint256 tokenId) external payable;

    function cancelListing(address nftAddress, uint256 tokenId) external;

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
}
