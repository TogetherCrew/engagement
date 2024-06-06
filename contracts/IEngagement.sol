interface IEngagement {
    event Issue(address indexed account, uint indexed tokenId);
    event Mint(address indexed account, uint indexed tokenId, uint amount);
    event Burn(address indexed account, uint indexed tokenId, uint amount);

    error NotFound(uint tokenId);
    error MintLimit(address account, uint tokenId);

    function counter() external view returns (uint);

    function issue(string memory hash) external;

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

    function updateScores(uint date, string memory cid) external;
}
