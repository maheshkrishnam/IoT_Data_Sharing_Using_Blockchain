// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

interface IDataVerification {
    enum VerificationStatus {
        PENDING,
        APPROVED,
        REJECTED
    }

    function getVerificationStatus(
        uint256 tokenId
    )
        external
        view
        returns (
            VerificationStatus status,
            string memory comments,
            address verifier,
            uint256 timestamp
        );
}


contract IoTDataNFT is ERC721, ERC721URIStorage, Ownable, AccessControl {
    uint256 private _tokenIdCounter;
    address public dataVerificationContract;

    struct IoTData {
        string deviceId;
        uint256 timestamp;
        string dataType;
        string location;
    }

    mapping(uint256 => IoTData) private _iotData;
    mapping(uint256 => bool) public isVerified;
    mapping(string => uint256[]) private _tokensByDevice;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    event DataNFTMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string deviceId,
        uint256 timestamp
    );

    constructor(
        address initialOwner
    ) ERC721("IoTDataNFT", "IOTN") Ownable(initialOwner) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialOwner);
        _grantRole(MINTER_ROLE, initialOwner);
    }

    modifier onlyVerifier() {
        require(hasRole(VERIFIER_ROLE, msg.sender), "Only verifier");
        _;
    }

    function setDataVerificationContract(
        address _verificationContract
    ) external onlyOwner {
        require(_verificationContract != address(0), "Invalid address");
        dataVerificationContract = _verificationContract;
    }

    function safeMint(
        address to,
        string memory uri,
        string memory deviceId,
        string memory dataType,
        string memory location
    ) public onlyRole(MINTER_ROLE) returns (uint256) {
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

        _tokensByDevice[deviceId].push(tokenId);

        emit DataNFTMinted(tokenId, to, deviceId, block.timestamp);
        return tokenId;
    }

    function getVerificationStatus(
        uint256 tokenId
    )
        external
        view
        returns (
            IDataVerification.VerificationStatus status,
            string memory comments,
            address verifier,
            uint256 timestamp
        )
    {
        require(_isValidToken(tokenId), "Invalid tokenId");
        return
            IDataVerification(dataVerificationContract).getVerificationStatus(
                tokenId
            );
    }

    function getTokensByDevice(
        string calldata deviceId
    ) external view returns (uint256[] memory) {
        return _tokensByDevice[deviceId];
    }

    function updateVerificationStatus(uint256 tokenId, bool verified) external onlyVerifier {
        require(msg.sender == dataVerificationContract, "Unauthorized");
        isVerified[tokenId] = verified;
    }

    function getIoTData(
        uint256 tokenId
    )
        public
        view
        returns (
            string memory deviceId,
            uint256 timestamp,
            string memory dataType,
            string memory location
        )
    {
        require(_isValidToken(tokenId), "Token does not exist");
        IoTData memory data = _iotData[tokenId];
        return (data.deviceId, data.timestamp, data.dataType, data.location);
    }

    function _isValidToken(uint256 tokenId) internal view returns (bool) {
        return tokenId < _tokenIdCounter;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function ownerOf(uint256 tokenId) public view override(ERC721, IERC721) returns (address) {
        return super.ownerOf(tokenId);
    }
}
