// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IoTDataAccessControl is AccessControl {
    bytes32 public constant DEVICE_ROLE = keccak256("DEVICE_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant DATA_BUYER_ROLE = keccak256("DATA_BUYER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    struct RoleMembers {
        address[] members;
        mapping(address => bool) isMember;
    }

    RoleMembers private _devices;
    RoleMembers private _verifiers;
    RoleMembers private _buyers;

    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantDeviceRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEVICE_ROLE, account);
        _addMember(_devices, account);
        emit RoleGranted(DEVICE_ROLE, account);
    }

    function revokeDeviceRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DEVICE_ROLE, account);
        _removeMember(_devices, account);
        emit RoleRevoked(DEVICE_ROLE, account);
    }

    function grantVerifierRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(VERIFIER_ROLE, account);
        _addMember(_verifiers, account);
        emit RoleGranted(VERIFIER_ROLE, account);
    }

    function revokeVerifierRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(VERIFIER_ROLE, account);
        _removeMember(_verifiers, account);
        emit RoleRevoked(VERIFIER_ROLE, account);
    }

    function grantDataBuyerRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DATA_BUYER_ROLE, account);
        _addMember(_buyers, account);
        emit RoleGranted(DATA_BUYER_ROLE, account);
    }

    function revokeBuyerRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(DATA_BUYER_ROLE, account);
        _removeMember(_buyers, account);
        emit RoleRevoked(DATA_BUYER_ROLE, account);
    }

    function grantMinterRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(MINTER_ROLE, account);
        emit RoleGranted(MINTER_ROLE, account);
    }

    function revokeMinterRole(
        address account
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _revokeRole(MINTER_ROLE, account);
        emit RoleRevoked(MINTER_ROLE, account);
    }

    function getAllDevices() public view returns (address[] memory) {
        return _devices.members;
    }

    function getAllVerifiers() public view returns (address[] memory) {
        return _verifiers.members;
    }

    function getAllBuyers() public view returns (address[] memory) {
        return _buyers.members;
    }

    function isDevice(address account) public view returns (bool) {
        return _devices.isMember[account];
    }

    function isVerifier(address account) public view returns (bool) {
        return _verifiers.isMember[account];
    }

    function isDataBuyer(address account) public view returns (bool) {
        return _buyers.isMember[account];
    }

    function _addMember(RoleMembers storage role, address account) private {
        if (!role.isMember[account]) {
            role.members.push(account);
            role.isMember[account] = true;
        }
    }

    function _removeMember(RoleMembers storage role, address account) private {
        if (role.isMember[account]) {
            for (uint256 i = 0; i < role.members.length; i++) {
                if (role.members[i] == account) {
                    role.members[i] = role.members[role.members.length - 1];
                    role.members.pop();
                    role.isMember[account] = false;
                    break;
                }
            }
        }
    }
}
