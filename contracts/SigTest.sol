// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SigTest {

    using ECDSA for bytes32;

    address private systemAddress;

    constructor (address _systemAddress) {
        systemAddress = _systemAddress;
    }

    function isValidSignature(bytes32 hash, bytes memory signature) internal view returns (bool isValid) {
        bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
        return signedHash.recover(signature) == systemAddress;
    }

    function isDataValid(uint256 timestamp, bytes memory signature) public view returns (bool) {
        // Build the hash and check the sig
        // We only accept sigs from the system
        bytes32 msgHash = keccak256(abi.encodePacked(msg.sender, timestamp));
        require(
            isValidSignature(msgHash, signature),          
            "Invalid signature"
        );
        return true;
    }
}