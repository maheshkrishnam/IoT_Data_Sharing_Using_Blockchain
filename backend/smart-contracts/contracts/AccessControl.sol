// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract IoTDataAccessControl is AccessControl {
    bytes32 public constant DEVICE_ROLE = keccak256("DEVICE_ROLE");
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");
    bytes32 public constant DATA_BUYER_ROLE = keccak256("DATA_BUYER_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function grantDeviceRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DEVICE_ROLE, account);
    }

    function grantVerifierRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VERIFIER_ROLE, account);
    }

    function grantDataBuyerRole(address account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(DATA_BUYER_ROLE, account);
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
}
