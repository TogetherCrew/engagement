import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { vars } from "hardhat/config";

const ALCHEMY_SEPOLIA_ENDPOINT = vars.get("ALCHEMY_SEPOLIA_ENDPOINT", "");
const PRIVATE_KEYS = vars.has("PRIVATE_KEYS")
  ? vars.get("PRIVATE_KEYS").split(", ")
  : [];
const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY", "");

const config: HardhatUserConfig = {
  solidity: "0.8.26",
  networks: {
    sepolia: {
      url: ALCHEMY_SEPOLIA_ENDPOINT,
      accounts: PRIVATE_KEYS,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};

export default config;
