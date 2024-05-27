import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("EngagementsScore", () => {
  async function deployContractFixtures() {
    const [owner] = await hre.ethers.getSigners();

    const EngagementsScore = await hre.ethers.getContractFactory(
      "EngagementsScore"
    );
    const engagementsScore = await EngagementsScore.deploy();
    await engagementsScore.waitForDeployment();

    return {
      engagementsScore,
      owner,
    };
  }

  it("Should deploy the contract", async () => {
    const { engagementsScore } = await loadFixture(deployContractFixtures);
    expect(await engagementsScore.getAddress()).to.properAddress;
  });

  it("tokenCounter should be 0", async () => {
    const { engagementsScore } = await loadFixture(deployContractFixtures);
    expect(await engagementsScore.tokenCounter()).to.equal(0);
  });
});
