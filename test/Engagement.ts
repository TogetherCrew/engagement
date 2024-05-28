import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseEther, parseUnits } from "viem";

describe("Engage", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("Engagement");

    const publicClient = await hre.viem.getPublicClient();

    return {
      contract,
      owner,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { contract, owner } = await loadFixture(deployFixture);

      expect(await contract.read.owner()).to.equal(
        getAddress(owner.account.address)
      );
    });
  });

  describe("Mint", function () {
    it("Should revert if not owner", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture)

      await expect(contract.write.mint({ account: otherAccount.account })).to.be.rejected
    })

    it("Should increment token count by 1", async function () {
      const { contract } = await loadFixture(deployFixture)
      expect(await contract.read.tokenCount()).to.equal(parseUnits("0", 0));
      await contract.write.mint()
      expect(await contract.read.tokenCount()).to.equal(parseUnits("1", 0));
    })
  })

});
