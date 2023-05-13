// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./RandomNumberGeneration.sol";

contract RollerGame is Ownable {

    using ECDSA for bytes32;
    IERC20 public token;
    RandomNumberGeneration public random;
    uint256 private winningRate;
    uint256 private overbids;
    uint256 private underbids;
    mapping(bytes32 => bool) public couponCodeUsed;
    mapping(address => uint256) public rollOverBids;
    mapping (address => uint256) public rollUnderBids;

    function initialize(address _token, address _random) public onlyOwner {
        token = IERC20(_token);
        random = RandomNumberGeneration(_random);
        winningRate = 2;
    }

    modifier isCallerValid(bytes32 _code, bytes calldata sig) {
        require(!couponCodeUsed[_code], "coupon not valid");
        bytes32 hash = _code.toEthSignedMessageHash();
        require((address(hash.recover(sig)) == owner()), "coupon not valid");
        couponCodeUsed[_code] = true;
        _;
    }

    function rollOver(uint256 _tokenamount, bytes32 _code, bytes calldata signature) public isCallerValid(_code, signature) {
        require(_tokenamount > 0,"token should be greater than Zero.");
        require(token.balanceOf(msg.sender) > 0,"Insufficient Token Balance to play.");
        token.transferFrom(msg.sender, address(this),_tokenamount);
        uint256 num = random.generate();
        require(num > 50 || num <= 100,"Try Again");
        token.transferFrom(address(this), msg.sender, _tokenamount*winningRate);
        rollOverBids[msg.sender] = overbids++;
    }

    function rollUnder(uint256 _tokenamount, bytes32 _code, bytes calldata signature) public isCallerValid(_code, signature) {
        require(_tokenamount > 0,"token should be greater than Zero.");
        require(token.balanceOf(msg.sender) > 0,"Insufficient Token Balance to play.");
        token.transferFrom(msg.sender, address(this),_tokenamount);
        uint256 num = random.generate();
        require(num < 50 || num >= 1,"Try Again");
        token.transferFrom(address(this), msg.sender, _tokenamount*winningRate);
        rollUnderBids[msg.sender] = underbids++;
    }

    function setWinningRatee(uint256 _winningRate) external onlyOwner {
        require(_winningRate > 0, "input must be greater than 0 and whole number!");
        winningRate = _winningRate;
    }

    function getWinningRate() external returns (uint256) {
        return winningRate;
    }

    //internal function
    // function isValidSignature(bytes32 hash, bytes calldata signature) internal view returns (bool isValid) {
    //     bytes32 signedHash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    //     return signedHash.recover(signature) == owner();
    // }
}