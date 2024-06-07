import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EngagementModule = buildModule("EngagementModule", (m) => {
  const engagement = m.contract("Engagement", [], {});

  return { engagement };
});

export default EngagementModule;
