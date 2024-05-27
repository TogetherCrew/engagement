// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "hardhat/console.sol";

contract EngagementContract is ERC1155 {
    uint256 private tokenCounter;

    constructor() ERC1155("") {
        console.log("Deploying an ERC1155 contract");
        tokenCounter = 0;
    }
}
