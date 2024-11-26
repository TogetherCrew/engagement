import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import { vars } from "hardhat/config";
import {generatePrivateKey} from "viem/accounts"

const ALCHEMY_SEPOLIA_ENDPOINT = vars.get("ALCHEMY_SEPOLIA_ENDPOINT", "");
const PRIVATE_KEY = vars.has("PRIVATE_KEY")
    ? vars.get("PRIVATE_KEY")
    : generatePrivateKey();

const ETHERSCAN_API_KEY = vars.get("ETHERSCAN_API_KEY", "");

const OPTIMISM_ETHERSCAN_API_KEY = vars.has("OPTIMISM_ETHERSCAN_API_KEY")
	? vars.get("OPTIMISM_ETHERSCAN_API_KEY")
	: "";

const BASESCAN_API_KEY = vars.has("BASESCAN_API_KEY")
    ? vars.get("BASESCAN_API_KEY")
    : "";

const config: HardhatUserConfig = {
	solidity: "0.8.26",
	networks: {
		sepolia: {
			url: ALCHEMY_SEPOLIA_ENDPOINT,
			accounts: [PRIVATE_KEY],
		},
		optimismSepolia: {
			chainId: 11155420,
			accounts: [PRIVATE_KEY],
			url: "https://sepolia.optimism.io",
			gasMultiplier: 1.2,
		},
		baseSepolia: {
			chainId: 84532,
			accounts: [PRIVATE_KEY],
			url: "https://sepolia.base.org/",
			gasMultiplier: 1.3,
		},
	},
	etherscan: {
		apiKey: {
			sepolia: ETHERSCAN_API_KEY,
			optimismSepolia: OPTIMISM_ETHERSCAN_API_KEY,
			baseSepolia: BASESCAN_API_KEY
		},
		customChains: [
			{
				network: "optimismSepolia",
				chainId: 11155420,
				urls: {
					apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
					browserURL: "https://sepolia-optimism.etherscan.io/",
				},
			},
		],
	},
};

export default config;
