import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  defaultNetwork: "sepolia",
  networks: {
    arbitrum: {
      url: process.env.ALCHEMY_ARBITRUM_MAINNET_ENDPOINT!,
      accounts: [process.env.PRIVATE_KEY!],
    },
    sepolia: {
      url: process.env.ALCHEMY_SEPOLIA_ENDPOINT!,
      accounts: [process.env.PRIVATE_KEY!],
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY!,
  },
};

export default config;
