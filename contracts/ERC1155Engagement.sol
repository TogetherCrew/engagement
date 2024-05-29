// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC1155Engagement is Ownable, ERC1155, Pausable {
  uint private counter;

  constructor(string memory uri_) Ownable(msg.sender) ERC1155(uri_) {}

  error TokenExist(address account, uint id);

  function pause() public onlyOwner {
    _pause();
  }

  function safeTransferFrom(address from, address to, uint256 id, uint256 value, bytes memory data) public virtual override whenNotPaused {
    ERC1155.safeTransferFrom(from, to, id, value, data);
  }

  function mint(address to, uint256 id, uint256 value, bytes memory data) public {
    // Should revert if id >= counter
    if (balanceOf(to, id) > 0) {
      revert TokenExist(to, id);
    }

    _mint(to, id, value, data);
  }

  function uri(uint256 id) public view virtual override returns (string memory) {
    return string(abi.encodePacked(
      ERC1155.uri(id),
      Strings.toString(id)));
  }

  function issue() public {
    // _mint(msg.sender, counter, 1, "0x0");
    // emit Issued(msg.sender, counter);
    // counter++;
  }

}