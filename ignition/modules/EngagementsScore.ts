import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("EngagementsScore", (m) => {
  const engagements = m.contract("EngagementsScore", []);

  return {
    engagements,
  };
});
