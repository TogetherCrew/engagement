# **Engagement Contract**

## **Overview**

The **Engagement Contract** is a blockchain-based solution for communities to manage reputation and engagement through token issuance and scoring mechanisms. It allows communities to:

- **Issue unique tokens** for their ecosystem.
- **Mint tokens** for individual users based on their activities.
- **Calculate and retrieve reputation scores** for community members using the **OCI (On-Chain Identity) platform**.
- **Manage token metadata** dynamically with customizable URIs.

This project is built with Solidity, Hardhat, and OpenZeppelin libraries, ensuring secure and efficient smart contract development.

## **Contract Addresses**

| Address                                                                                  | Network           |
| ---------------------------------------------------------------------------------------- | ----------------- |
| N/A                                                                                      | Sepolia           |
| https://sepolia-optimism.etherscan.io/address/0xd826769f1844cc83a16923d2aef8a479e62da732 | Optimisim Sepolia |

---

## **Features**

- **Token Management**:
  - Issue new tokens unique to the community.
  - Mint tokens for users with checks to prevent duplicate mints.
  - Burn tokens for revocation or updates.
- **Reputation Scoring**:
  - Calculate and retrieve scores for users based on token data and identifiers.
  - Attest reputation scores to users' wallets for on-chain verification.
- **Dynamic Metadata**:
  - Supports customizable token URIs for dynamic metadata management.
- **Admin Controls**:
  - Update base URIs.
  - Manage token issuance securely with access control.

---

## **Tech Stack**

- **Smart Contracts**:
  - **Solidity**: Core language for smart contract development.
  - **OpenZeppelin**: Secure and reusable contract components.
- **Development Framework**:
  - **Hardhat**: Ethereum development environment.
  - **Hardhat Ignition**: Advanced deployment and parameter management.
- **Testing and Analysis**:
  - **Chai**: For contract testing.
  - **Solidity Coverage**: Analyze code coverage for Solidity tests.
- **Linting and Formatting**:
  - **Biome**: Code quality and formatting tools.

---

## **Installation**

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/your-username/engagement.git
   cd engagement
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   Create a `.env` file in the root directory and set the following:
   ```plaintext
   TOKEN_URI=http://127.0.0.1:8545/
   ```

---

## **Usage**

### **Compile Contracts**

Run the following command to compile the contracts:

```bash
npm run compile
```

### **Run Tests**

Execute the test suite to ensure everything is working as expected:

```bash
npm run test
```

### **Deploy Contracts**

Before deploying, ensure that previous deployment files are removed to prevent conflicts:

- **Remove the directory**: `ignition/deployments/chain-{chainId}` (replace `{chainId}` with the ID of the chain you're deploying to).

### Deploying to Localhost

1.  **Start the Hardhat local node**:

- `npx hardhat node`

- **Deploy contracts to localhost**:

1.  `npx hardhat run ./scripts/deploys/deploy.ts --network localhost`

### Deploying to a Network

1.  **Set up environment variables**:

    - **Private Key**: Set your wallet's private key as `PRIVATE_KEY`.
    - **Block Explorer API Key**: Set your block explorer API key (e.g., Etherscan API key) for contract verification.

    Use Hardhat's `vars` command to set and get environment variables:

- `npx hardhat vars set PRIVATE_KEY
npx hardhat vars get PRIVATE_KEY`
- **Update Hardhat configuration**:

  - In your `hardhat.config.js` or `hardhat.config.ts` file:
    - **Add network configuration** under `networks` with the appropriate settings (e.g., RPC URL, accounts).
    - **Configure Etherscan** for contract verification by adding your API key under `etherscan`.

- **Create a deployment script**:

  - Place your deployment script in the `scripts/deploys/` directory.

- **Deploy contracts to the network**:

`npx hardhat run ./scripts/deploys/{scriptname}.ts --network {networkname}`

- Replace `{scriptname}` with your deployment script name.
- Replace `{networkname}` with the network name as defined in your `hardhat.config`.

### **Check Coverage**

Analyze the test coverage for your contracts:

```bash
npm run coverage
```

### **Lint and Format Code**

Lint the project for issues:

```bash
npm run lint
```

Format the project files:

```bash
npm run format
```

---

## **Folder Structure**

```plaintext
.
├── contracts/               # Solidity contracts
│   ├── Engagement.sol       # Core engagement contract
│   ├── IEngagement.sol      # Interface for engagement contract
├── ignition/
│   └── modules/             # Deployment modules for Hardhat Ignition
│       └── Engagement.ts    # Engagement contract deployment module
├── scripts/                 # Deployment scripts
│   └── deploy.ts            # Hardhat deployment script
├── test/                    # Test files for the contracts
├── hardhat.config.ts        # Hardhat configuration file
├── package.json             # Project metadata and scripts
├── .env                     # Environment variables
└── README.md                # Project documentation
```

---

## **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m "Add feature-name"`).
4. Push to your branch (`git push origin feature-name`).
5. Submit a pull request.

---

## **Acknowledgments**

- **OpenZeppelin**: For providing secure and reusable smart contract components.
- **Hardhat Team**: For building a robust Ethereum development environment.
- **OCI Platform**: For enabling seamless identity and reputation management.
- **TogetherCrew**: For driving innovation in community engagement and blockchain-based solutions.
