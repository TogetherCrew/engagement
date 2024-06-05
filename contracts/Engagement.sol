// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IEngagement.sol";

contract EngagementContract is IEngagement, ERC1155, AccessControl {
    uint private _counter = 0;
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function counter() external view returns (uint) {
        return _counter;
    }

    function issue() external {
        _mint(msg.sender, _counter, 1, "");
        emit Issue(_counter, msg.sender);
        _counter++;
    }

    function mint(
        address account,
        uint tokenId,
        uint amount,
        bytes memory data
    ) external override {}

    function burn(
        address account,
        uint tokenId,
        uint amount
    ) external override {}

    function getScores(
        uint date,
        uint id,
        string memory account
    ) external view override returns (string memory) {}

    function updateScores(uint date, string memory cid) external override {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155) returns (bool) {}
}
