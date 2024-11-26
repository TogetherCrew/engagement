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
        requireNonEmptyURI(tokenURI_);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _tokenURI = tokenURI_;
    }

    function _checkTokenId(uint tokenId) private view {
        if (tokenId >= _counter) {
            revert NotFound(tokenId);
        }
    }

    function requireNonEmptyURI(string memory newUri) internal pure {
        if (bytes(newUri).length == 0) {
            revert URIEmpty("URI cannot be empty");
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

    modifier nonEmptyAccount(string memory account) {
        if (bytes(account).length == 0) {
            revert EmptyAccountNotAllowed("Account cannot be empty");
        }
        _;
    }

    function counter() external view returns (uint) {
        return _counter;
    }

    function issue() external {
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

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155) returns (bool) {
        if (address(this).supportsERC165()) {
            return super.supportsInterface(interfaceId);
        }
        return false;
    }

    function updateBaseURI(string memory newURI) external onlyRole(DEFAULT_ADMIN_ROLE) {
        requireNonEmptyURI(newURI);
        emit BaseURIUpdated(_tokenURI, newURI);
        _tokenURI = newURI;
    }

    function uri(
        uint tokenId,
        string memory account
    ) public view validTokenId(tokenId) nonEmptyAccount(account) returns (string memory) {
        return
            string(
                abi.encodePacked(_tokenURI,"/api/v1/nft/",Strings.toString(tokenId),"/",account,"/reputation-score")
            );
    }
}
