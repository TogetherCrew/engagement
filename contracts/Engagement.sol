// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IEngagement.sol";

contract Engagement is IEngagement, ERC1155, AccessControl {
    uint private _counter = 0;
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

    mapping(uint => string) private _tokenMetadata;
    mapping(uint => string) private _scores;

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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

    function counter() external view returns (uint) {
        return _counter;
    }

    function issue(string memory hash_) external {
        _tokenMetadata[_counter] = hash_;
        _mint(msg.sender, _counter, 1, "");
        emit Issue(msg.sender, _counter);
        _counter++;
    }

    function mint(
        address account,
        uint tokenId,
        uint amount,
        bytes memory data
    ) external override validTokenId(tokenId) {
        if (balanceOf(account, tokenId) > 0) {
            revert MintLimit(account, tokenId);
        }
        _mint(account, tokenId, 1, data);
        emit Mint(account, tokenId, 1);
    }

    function burn(
        address account,
        uint tokenId,
        uint amount
    ) external override validTokenId(tokenId) {
        if (account != msg.sender) {
            revert NotAllowed(account, tokenId);
        }
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
                    "ipfs://",
                    _scores[date],
                    "/",
                    Strings.toString(id),
                    "/",
                    account,
                    ".json"
                )
            );
    }

    function updateScores(
        uint date,
        string memory cid
    ) external override onlyRole(PROVIDER_ROLE) {
        _scores[date] = cid;
        emit UpdateScores(msg.sender, date, cid);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155) returns (bool) {}

    function uri(
        uint tokenId
    ) public view override validTokenId(tokenId) returns (string memory) {
        return
            string(
                abi.encodePacked("ipfs://", _tokenMetadata[tokenId], ".json")
            );
    }
}
