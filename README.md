# **Engagement Contract**

## **Overview**
The **Engagement Contract** is a blockchain-based solution for communities to manage reputation and engagement through token issuance and scoring mechanisms. It allows communities to:
- **Issue unique tokens** for their ecosystem.
- **Mint tokens** for individual users based on their activities.
- **Calculate and retrieve reputation scores** for community members using the **OCI (On-Chain Identity) platform**.
- **Manage token metadata** dynamically with customizable URIs.

This project is built with Solidity, Hardhat, and OpenZeppelin libraries, ensuring secure and efficient smart contract development.

## **Contract Addresses**

| Address                                                                                         | Network                  |
|-------------------------------------------------------------------------------------------------|--------------------------|
| https://sepolia.etherscan.io/address/0x8Ff1dd3967A87C1Eb46bd60B2BBF9D7eAA987c1B                 | Sepolia                  |
| https://sepolia-optimism.etherscan.io/address/0xd826769f1844CC83A16923D2AEF8a479E62Da732#code   | Optimisim Sepolia        |

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
   git clone https://github.com/your-username/engagement-contract.git
   cd engagement-contract
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
To deploy the contracts on a local Hardhat network:
1. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```
2. Deploy the contracts:
   ```bash
   npm run deploy:localhost
   ```

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
