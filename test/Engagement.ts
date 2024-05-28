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
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await expect(contract.write.mint({ account: otherAccount.account })).to.be
        .rejected;
    });

    it("Should increment token count by 1", async function () {
      const { contract } = await loadFixture(deployFixture);
      expect(await contract.read.tokenCount()).to.equal(parseUnits("0", 0));
      await contract.write.mint();
      expect(await contract.read.tokenCount()).to.equal(parseUnits("1", 0));
    });

    it("Should emit a Mint event", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      const hash = await contract.write.mint();
      const events = await contract.getEvents.Mint();
      expect(events.length).to.equal(1);
      const event = events[0];
      expect(event.eventName).to.equal("Mint");
      expect(event.transactionHash).to.equal(hash);
      expect(event.args.id).to.equal(parseUnits("0", 0));
      expect(event.args.account).to.equal(getAddress(owner.account.address));
    });

    it("Should have a token balance of 1", async function () {
      const { contract, owner } = await loadFixture(deployFixture);
      expect(
        await contract.read.balanceOf([
          owner.account.address,
          parseUnits("0", 0),
        ])
      ).to.equal(parseUnits("0", 0));
      await contract.write.mint();
      expect(
        await contract.read.balanceOf([
          owner.account.address,
          parseUnits("0", 0),
        ])
      ).to.equal(parseUnits("1", 0));
    });
  });

  describe("Claim", function () {
    it("should revert if tokenId is invalid", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await expect(
        contract.write.claim([parseUnits("0", 0)], {
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });

    it("should have a token balance of 1", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await contract.write.mint();

      expect(
        await contract.read.balanceOf([
          otherAccount.account.address,
          parseUnits("0", 0),
        ])
      ).to.equal(parseUnits("0", 0));

      await contract.write.claim([parseUnits("0", 0)], {
        account: otherAccount.account,
      });

      expect(
        await contract.read.balanceOf([
          otherAccount.account.address,
          parseUnits("0", 0),
        ])
      ).to.equal(parseUnits("1", 0));
    });

    it("should emit a Claim event and increment claim count", async function () {
      const { contract, owner, otherAccount } = await loadFixture(
        deployFixture
      );

      await contract.write.mint();

      const hash = await contract.write.claim([parseUnits("0", 0)], {
        account: otherAccount.account,
      });

      const events = await contract.getEvents.Claim();
      expect(events.length).to.equal(1);
      const event = events[0];
      expect(event.eventName).to.equal("Claim");
      expect(event.transactionHash).to.equal(hash);
      expect(event.args.id).to.equal(parseUnits("0", 0));
      expect(event.args.account).to.equal(
        getAddress(otherAccount.account.address)
      );
      expect(event.args.claimCount).to.equal(parseUnits("1", 0));

      const claimCount = await contract.read.getClaimCount([
        parseUnits("0", 0),
      ]);
      expect(claimCount).to.equal(parseUnits("1", 0));
    });

    it("should revert if the user tries to claim the same token twice", async function () {
      const { contract, otherAccount } = await loadFixture(deployFixture);

      await contract.write.mint();

      await contract.write.claim([parseUnits("0", 0)], {
        account: otherAccount.account,
      });

      await expect(
        contract.write.claim([parseUnits("0", 0)], {
          account: otherAccount.account,
        })
      ).to.be.rejected;
    });
  });
});
