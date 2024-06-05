import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import {
  getAddress,
  keccak256,
  parseEther,
  parseUnits,
  toBytes,
  toHex,
} from "viem";

describe("Engage", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [deployer, provider, otherAccount] =
      await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("EngagementContract");

    const publicClient = await hre.viem.getPublicClient();

    return {
      contract,
      deployer,
      provider,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should have deployer as an Admin", async function () {
      const { contract, deployer } = await loadFixture(deployFixture);

      const adminRole = await contract.read.DEFAULT_ADMIN_ROLE();

      expect(await contract.read.hasRole([adminRole, deployer.account.address]))
        .to.be.true;
    });

    it("Should have a PROVIDER_ROLE", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.read.PROVIDER_ROLE()).to.be.exist;
    });
  });
});
