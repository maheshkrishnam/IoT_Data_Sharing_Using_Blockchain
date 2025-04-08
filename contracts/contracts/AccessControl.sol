// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IoTDataAccessControl is AccessControl {
    bytes32 public constant DEVICE_ROLE = keccak256("DEVICE_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant DATA_BUYER_ROLE = keccak256("DATA_BUYER_ROLE");

    address[] private devices;
    address[] private verifiers;
    address[] private buyers;

    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantDeviceRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // _grantRole are more gas efficient than grantRole
        _grantRole(DEVICE_ROLE, account);
        devices.push(account);
        emit RoleGranted(DEVICE_ROLE, account);
    }

    function grantVerifierRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VERIFIER_ROLE, account);
        verifiers.push(account);
        emit RoleGranted(VERIFIER_ROLE, account);
    }

    function grantDataBuyerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DATA_BUYER_ROLE, account);
        buyers.push(account);
        emit RoleGranted(DATA_BUYER_ROLE, account);
    }

    function revokeDeviceRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DEVICE_ROLE, account);
        removeAddress(devices, account);
        emit RoleRevoked(DEVICE_ROLE, account);
    }

    function revokeVerifierRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(VERIFIER_ROLE, account);
        removeAddress(verifiers, account);
        emit RoleRevoked(VERIFIER_ROLE, account);
    }

    function revokeBuyerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DATA_BUYER_ROLE, account);
        removeAddress(buyers, account);
        emit RoleRevoked(DATA_BUYER_ROLE, account);
    }

    function getAllDevices() public view returns (address[] memory) {
        return devices;
    }

    function getAllVerifiers() public view returns (address[] memory) {
        return verifiers;
    }

    function getAllBuyers() public view returns (address[] memory) {
        return buyers;
    }

    function isDevice(address account) public view returns (bool) {
        return hasRole(DEVICE_ROLE, account);
    }

    function isVerifier(address account) public view returns (bool) {
        return hasRole(VERIFIER_ROLE, account);
    }

    function isDataBuyer(address account) public view returns (bool) {
        return hasRole(DATA_BUYER_ROLE, account);
    }

    function removeAddress(address[] storage array, address account) private {
        uint256 length = array.length;
        for (uint256 i = 0; i < length; i++) {
            if (array[i] == account) {
                if (i != length - 1) {
                    array[i] = array[length - 1];
                }
                array.pop();
                break;
            }
        }
    }
}
