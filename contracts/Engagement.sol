// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Engagement {
  address private _owner;
  uint private _tokenCount;

  mapping (uint id => mapping(address account => uint amount)) _balances;
  mapping (uint id => uint) _claimCount; 

  error OwnableUnauthorizedAccount(address account);
  error InvalidTokenId(uint id);
  error AlreadyClaimed(uint id, address account);

  event Mint(uint id, address account);
  event Claim(uint id, address account, uint claimCount);

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

  function tokenCount() public view virtual returns (uint) {
    return _tokenCount;
  }

  function mint() public onlyOwner {
    _balances[_tokenCount][msg.sender] = 1;
    emit Mint(_tokenCount, msg.sender);
    _tokenCount = _tokenCount + 1;
  }

  function balanceOf(address account, uint id) public view virtual returns (uint) {
    return _balances[id][account];
  }

  function getClaimCount(uint id) public view returns (uint) {
    return _claimCount[id];
  }

  function claim(uint id) public {
    if(id >= _tokenCount) {
      revert InvalidTokenId(id);
    }
    if (_balances[id][msg.sender] > 0) {
      revert AlreadyClaimed(id, msg.sender);
    }
    _balances[id][msg.sender] = 1;
    _claimCount[id] += 1;
    emit Claim(id, msg.sender, _claimCount[id]); 
  }
}