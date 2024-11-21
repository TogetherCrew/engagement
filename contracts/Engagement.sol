// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";
import "./IEngagement.sol";

contract Engagement is IEngagement, ERC1155, AccessControl {
    using ERC165Checker for address;

    uint private _counter;
    string private _tokenURI;

    constructor(string memory tokenURI_) ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _tokenURI = tokenURI_;
    }

    function _checkTokenId(uint tokenId) private view {
        if (tokenId >= _counter) {
            revert NotFound(tokenId);
        }
    }

    modifier validTokenId(uint tokenId) {
        _checkTokenId(tokenId);
        _;
    }

    modifier onlyTokenOwner(address account, uint tokenId) {
        if (account != msg.sender) {
            revert NotAllowed(account, tokenId);
        }
        _;
    }

    function counter() external view returns (uint) {
        return _counter;
    }

    function issue(string memory hash_) external {
        uint counterCache = _counter;
        _mint(msg.sender, counterCache, 1, "");
        emit Issue(msg.sender, counterCache);
        _counter = counterCache + 1;
    }

    function mint(
        address account,
        uint tokenId,
        uint amount,
        bytes memory data
    ) external override validTokenId(tokenId) {
        if (balanceOf(account, tokenId) >= 1) {
            revert MintLimit(account, tokenId);
        }
        _mint(account, tokenId, 1, data);
        emit Mint(account, tokenId, 1);
    }

    function burn(
        address account,
        uint tokenId,
        uint amount
    ) external override validTokenId(tokenId) onlyTokenOwner(account, tokenId) {
        _burn(account, tokenId, 1);
        emit Burn(account, tokenId, 1);
    }

   function getScores(
        uint date,
        uint id,
        string memory account
    ) external view override validTokenId(id) returns (string memory) {
        return
            string(
                abi.encodePacked(
                    _tokenURI,
                    "/",
                    Strings.toString(date),
                    "/",
                    Strings.toString(id),
                    "/",
                    account,
                    ".json"
                )
            );
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155) returns (bool) {
        if (address(this).supportsERC165()) {
            return super.supportsInterface(interfaceId);
        }
        return false;
    }

    function uri(
        uint tokenId
    ) public view override validTokenId(tokenId) returns (string memory) {
        return
            string(
                abi.encodePacked(_tokenURI,"/",Strings.toString(tokenId),".json")
            );
    }
}
