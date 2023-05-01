//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RandomNumberGeneration {
    function generate() external view returns (uint256) {
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 100 + 1; 
        //"difficulty" was replaced by "prevrandao"
        return randomNumber;
    }
} 