// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./IoTDataAccessControl.sol";

contract IoTDataNFT is ERC721, ERC721URIStorage {
    uint256 private _tokenIdCounter;
    address public dataVerificationContract;
    address public immutable marketplaceAddress;
    IoTDataAccessControl public accessControlContract;

    struct IoTData {
        string deviceId;
        uint256 timestamp;
        string dataType;
        string location;
    }

    struct TokenInfo {
        uint256 tokenId;
        address owner;
        string uri;
        string deviceId;
        uint256 timestamp;
        string dataType;
        string location;
    }

    mapping(uint256 => IoTData) private _iotData;
    mapping(uint256 => bool) public isVerified;
    mapping(string => uint256[]) private _tokensByDevice;
    uint256[] private _allTokens;

    event DataNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string deviceId,
        uint256 timestamp
    );
    event VerificationUpdated(uint256 indexed tokenId, bool verified);

    modifier onlyMinter() {
        require(
            accessControlContract.hasRole(
                accessControlContract.MINTER_ROLE(),
                msg.sender
            ),
            "Unauthorized role"
        );
        _;
    }

    modifier onlyAdmin() {
        require(
            accessControlContract.hasRole(
                accessControlContract.DEFAULT_ADMIN_ROLE(),
                msg.sender
            ),
            "Unauthorized role"
        );
        _;
    }

    constructor(
        address _marketplace,
        address _accessControl
    ) ERC721("IoTDataNFT", "IOTN") {
        marketplaceAddress = _marketplace;
        accessControlContract = IoTDataAccessControl(_accessControl);
    }

    function setDataVerificationContract(
        address _verificationContract
    ) external {
        require(_verificationContract != address(0), "Invalid address");
        require(_verificationContract.code.length > 0, "Not a contract");
        dataVerificationContract = _verificationContract;
    }

    function safeMint(
        address to,
        string memory uri,
        string memory deviceId,
        string memory dataType,
        string memory location
    ) public onlyMinter returns (uint256) {
        uint256 tokenId = _tokenIdCounter++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        _iotData[tokenId] = IoTData(
            deviceId,
            block.timestamp,
            dataType,
            location
        );
        _tokensByDevice[deviceId].push(tokenId);
        _allTokens.push(tokenId);
        emit DataNFTMinted(tokenId, to, deviceId, block.timestamp);
        return tokenId;
    }

    function updateVerificationStatus(uint256 tokenId, bool verified) external {
        require(
            accessControlContract.isVerifier(msg.sender),
            "Unauthorized role"
        );
        require(
            msg.sender == dataVerificationContract,
            "Unauthorized contract"
        );
        require(_isValidToken(tokenId), "Invalid token ID");
        isVerified[tokenId] = verified;
        emit VerificationUpdated(tokenId, verified);
    }

    function _buildInfo(
        uint256 tokenId
    ) internal view returns (TokenInfo memory) {
        IoTData storage device = _iotData[tokenId];
        return
            TokenInfo(
                tokenId,
                ownerOf(tokenId),
                tokenURI(tokenId),
                device.deviceId,
                device.timestamp,
                device.dataType,
                device.location
            );
    }

    function getAllVerifiedNFTs() external view returns (TokenInfo[] memory) {
        uint256 cnt;
        for (uint i; i < _allTokens.length; i++)
            if (isVerified[_allTokens[i]]) cnt++;
        TokenInfo[] memory out = new TokenInfo[](cnt);
        uint256 idx;
        for (uint i; i < _allTokens.length; i++) {
            uint256 tid = _allTokens[i];
            if (isVerified[tid]) {
                out[idx++] = _buildInfo(tid);
            }
        }
        return out;
    }

    function getAllUnverifiedNFTs() external view returns (TokenInfo[] memory) {
        uint256 cnt;
        for (uint i; i < _allTokens.length; i++)
            if (!isVerified[_allTokens[i]]) cnt++;
        TokenInfo[] memory out = new TokenInfo[](cnt);
        uint256 idx;
        for (uint i; i < _allTokens.length; i++) {
            uint256 tid = _allTokens[i];
            if (!isVerified[tid]) {
                out[idx++] = _buildInfo(tid);
            }
        }
        return out;
    }

    function _isValidToken(uint256 tokenId) internal view returns (bool) {
        return _ownerOf(tokenId) != address(0);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
