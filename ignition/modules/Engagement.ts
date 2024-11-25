import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EngagementModule = buildModule("EngagementModule", (m) => {
	const uri = m.getParameter("uri");	

	const engagement = m.contract("Engagement", [uri], {});
	
	return { engagement };
});

export default EngagementModule;