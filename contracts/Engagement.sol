// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./IEngagement.sol";

contract EngagementContract is IEngagement, ERC1155, AccessControl {
    uint private _counter = 0;
    bytes32 public constant PROVIDER_ROLE = keccak256("PROVIDER_ROLE");

    mapping(uint => string) private _tokenMetadata;

    constructor() ERC1155("") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
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
    ) external override {
        if (tokenId >= _counter) {
            revert NotFound(tokenId);
        }
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
    ) external override {
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
    ) external view override returns (string memory) {}

    function updateScores(uint date, string memory cid) external override {}

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(AccessControl, ERC1155) returns (bool) {}

    function uri(uint tokenId) public view override returns (string memory) {
        return
            string(
                abi.encodePacked("ipfs://", _tokenMetadata[tokenId], ".json")
            );
    }
}
