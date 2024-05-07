import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

describe("EngagementScoreContract", function () {
  let engagementScoreContract: Contract | any;
  let admin: Signer, communityMember: Signer, anotherMember: Signer;
  let tokenCounter: number;

  before(async function () {
    const [deployer, member1, member2] = await ethers.getSigners();
    admin = deployer;
    communityMember = member1;
    anotherMember = member2;

    const EngagementScoreContractFactory = await ethers.getContractFactory(
      "EngagementScoreContract",
      admin
    );
    engagementScoreContract = await EngagementScoreContractFactory.deploy();
    await engagementScoreContract.deployed();
  });

  describe("Admin Functions - Creating Tokens", function () {
    it("Admin should successfully create a new community token", async function () {
      await engagementScoreContract
        .connect(admin)
        .createCommunityToken("TogetherCrew", "TC");
      const tokenId = 1; // Assuming the tokenId is 1 for the first token
      expect(await engagementScoreContract.tokenURI(tokenId)).to.include(
        "TogetherCrew"
      );
      tokenCounter += 1;
      expect(await engagementScoreContract.totalSupply()).to.equal(
        tokenCounter
      );
    });

    it("Non-admin should not be able to create a new community token", async function () {
      await expect(
        engagementScoreContract
          .connect(communityMember)
          .createCommunityToken("Member Community", "MC")
      ).to.be.revertedWith("Admin role required");
    });
  });

  describe("Community Member Functions - Minting Existing Tokens", function () {
    before(async function () {
      // Admin creates a token for the community
      await engagementScoreContract
        .connect(admin)
        .createCommunityToken("Community Token", "CT");
    });

    it("Community member should be able to mint an existing community token", async function () {
      const tokenId = 2; // Assuming token ID for "Community Token" is 2
      await engagementScoreContract
        .connect(communityMember)
        .mint(communityMember.getAddress(), tokenId, 1, "0x00");
      expect(
        await engagementScoreContract.balanceOf(
          communityMember.getAddress(),
          tokenId
        )
      ).to.equal(1);

      tokenCounter += 1;
      expect(await engagementScoreContract.totalSupply()).to.equal(
        tokenCounter
      );
    });

    it("Community member should not mint more than one NFT of the same type", async function () {
      const tokenId = 2; // Same token ID as before
      await expect(
        engagementScoreContract
          .connect(communityMember)
          .mint(communityMember.getAddress(), tokenId, 1, "0x00")
      ).to.be.revertedWith("Each address may only mint one NFT per type");

      tokenCounter += 1;
      expect(await engagementScoreContract.totalSupply()).to.equal(
        tokenCounter
      );
    });

    it("Community member should not be able to mint a non-existing token", async function () {
      const nonExistingTokenId = 999; // Assumed to be a non-existing token ID
      await expect(
        engagementScoreContract
          .connect(communityMember)
          .mint(communityMember.getAddress(), nonExistingTokenId, 1, "0x00")
      ).to.be.revertedWith("Token does not exist");
    });
  });
});
