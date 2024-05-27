import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("EngagementContract", () => {
  let EngagementContractFactory: any;
  let engagementContract: any;
  let owner: SignerWithAddress;

  beforeEach(async () => {
    EngagementContractFactory = await ethers.getContractFactory(
      "EngagementContract"
    );
    [owner] = await ethers.getSigners();

    engagementContract = await EngagementContractFactory.deploy();
    await engagementContract.waitForDeployment();
  });

  it("Should deploy successfully", async () => {
    expect(engagementContract.address).to.properAddress;
  });
});
