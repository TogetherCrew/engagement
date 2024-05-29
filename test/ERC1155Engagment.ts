import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { getAddress, parseUnits } from "viem";

const BASE_URI = "ipfs://meta.togethercrew.com/"

// Constructor
// Should set the right owner

// Balance
// Should return account balance for token

// Pausable
// Should revert transfer when paused
// Should revert if not owner

// Mint
// Should revert if value greater than 1

describe("ERC1155Engagement", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.viem.getWalletClients();

    const contract = await hre.viem.deployContract("ERC1155Engagement", [BASE_URI]);

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

  describe("Balance", function () {
    it("Should return account balance for token", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(await contract.read.balanceOf([owner.account.address, parseUnits("0",0)])).to.equal(parseUnits("0",0))
    })
  })

  describe("Pausable", function () {
    it("Should revert transfer when paused", async function () {
      const { contract, owner, otherAccount } = await loadFixture(deployFixture);
      await contract.write.pause()
      await expect(contract.write.safeTransferFrom([
        getAddress(owner.account.address),
        getAddress(otherAccount.account.address),
        parseUnits("0", 0),
        parseUnits("1", 0),
        "0x0",
      ])).to.be.rejectedWith("EnforcedPause()")
    })
    // it("Should transfer when not paused", async function () {
    //   const { contract, owner, otherAccount } = await loadFixture(deployFixture);
    //   await contract.write.safeTransferFrom([
    //     getAddress(owner.account.address),
    //     getAddress(otherAccount.account.address),
    //     parseUnits("0", 0),
    //     parseUnits("1", 0),
    //     "0x0",
    //   ])
    // })
  })

  describe("Mint", function () {
    it("Should revert if value greater than 1", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture)
      await contract.write.mint([otherAccount.account.address, parseUnits("0", 0), parseUnits("1", 0), "0x0"])
      await expect(contract.write.mint([otherAccount.account.address, parseUnits("0", 0), parseUnits("1", 0), "0x0"])).to.be.rejectedWith(
        `TokenExist("${getAddress(otherAccount.account.address)}", ${parseUnits("0", 0)})`
      )
    })
  })

  describe("URI", function () {
    it("Should return a URI", async function () {
      const { contract } = await loadFixture(deployFixture)
      expect(await contract.read.uri([parseUnits("0", 0)])).to.equal(`${BASE_URI}0`)
    })
  })
})