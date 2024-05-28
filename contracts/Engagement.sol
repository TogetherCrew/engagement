// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Engagement {
  address private _owner;

  error OwnableUnauthorizedAccount(address account);

  constructor() {
    _owner = msg.sender;
  }

  modifier onlyOwner() {
    _checkOwner();
    _;
  }

  function _checkOwner() internal view virtual {
    if (owner() != msg.sender) {
      revert OwnableUnauthorizedAccount(msg.sender);
    }
  }

  function owner() public view virtual returns (address) {
    return _owner;
  }

  function mint() public onlyOwner {

  }

}