// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Engagement {
  address private _owner;

  constructor() {
    _owner = msg.sender;
  }

  function owner() public view virtual returns (address) {
    return _owner;
  }

}