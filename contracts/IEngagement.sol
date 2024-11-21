// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.26;

interface IEngagement {
    event Issue(address indexed account, uint indexed tokenId);
    event Mint(address indexed account, uint indexed tokenId, uint amount);
    event Burn(address indexed account, uint indexed tokenId, uint amount);
    event BaseURIUpdated(string oldURI, string newURI);

    error NotFound(uint tokenId);
    error MintLimit(address account, uint tokenId);
    error NotAllowed(address account, uint tokenId);
    error URIEmpty(string message);

    function counter() external view returns (uint);

    function issue() external;

    function mint(
        address account,
        uint tokenId,
        uint amount,
        bytes memory data
    ) external;

    function burn(address account, uint tokenId, uint amount) external;

    function getScores(
        uint date,
        uint id,
        string memory account
    ) external view returns (string memory);

    function updateBaseURI(string memory newURI) external;
}
