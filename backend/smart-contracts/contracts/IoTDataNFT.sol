// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";  // Import AccessControl

contract IoTDataNFT is ERC721, ERC721URIStorage, Ownable, AccessControl {
    uint256 private _tokenIdCounter;

    struct IoTData {
        string deviceId;
        uint256 timestamp;
        string dataType;
        string location;
    }

    mapping(uint256 => IoTData) private _iotData;

    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");  // ✅ Define the role

    event DataNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string deviceId,
        uint256 timestamp
    );

    constructor(address initialOwner) ERC721("IoTDataNFT", "IOTN") Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);  // ✅ Grant admin role to deployer
    }

    function safeMint(
        address to,
        string memory uri,
        string memory deviceId,
        string memory dataType,
        string memory location
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        _iotData[tokenId] = IoTData({
            deviceId: deviceId,
            timestamp: block.timestamp,
            dataType: dataType,
            location: location
        });

        emit DataNFTMinted(tokenId, to, deviceId, block.timestamp);
        return tokenId;
    }

    function grantVerifierRole(address verifier) public onlyOwner {
        grantRole(VERIFIER_ROLE, verifier);  // ✅ Grant VERIFIER_ROLE
    }

    function getIoTData(uint256 tokenId) public view returns (IoTData memory) {
        require(_isValidToken(tokenId), "Token does not exist");
        return _iotData[tokenId];
    }

    function _isValidToken(uint256 tokenId) internal view returns (bool) {
        return tokenId < _tokenIdCounter;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
