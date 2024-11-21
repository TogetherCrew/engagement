import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EngagementModule = buildModule("EngagementModule", (m) => {
	const tokenURI = "https://api.example.com";

	const engagement = m.contract("Engagement", [tokenURI], {});

	return { engagement };
});

export default EngagementModule;