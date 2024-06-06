import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import {
  formatUnits,
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

    const hash = "SOME_RANDOM_HASH";

    const contract = await hre.viem.deployContract("EngagementContract");

    const publicClient = await hre.viem.getPublicClient();

    return {
      contract,
      hash,
      deployer,
      provider,
      otherAccount,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should have counter equal 0", async function () {
      const { contract } = await loadFixture(deployFixture);

      expect(await contract.read.counter()).to.be.equal(parseUnits("0", 0));
    });
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

  describe("Issue", function () {
    it("Should increment counter by 1", async function () {
      const { contract, hash } = await loadFixture(deployFixture);

      const counter0 = formatUnits(await contract.read.counter(), 0);

      await contract.write.issue([hash]);

      const counter1 = formatUnits(await contract.read.counter(), 0);

      expect(Number(counter1)).to.be.equal(Number(counter0) + 1);
    });

    it("Should have an account balance of 1", async function () {
      const { contract, otherAccount, hash } = await loadFixture(deployFixture);

      const counter = await contract.read.counter();
      const balance0 = await contract.read.balanceOf([
        getAddress(otherAccount.account.address),
        counter,
      ]);

      expect(balance0).to.be.equal(parseUnits("0", 0));

      await contract.write.issue([hash], {
        account: otherAccount.account.address,
      });

      const balance1 = await contract.read.balanceOf([
        getAddress(otherAccount.account.address),
        counter,
      ]);

      expect(balance1).to.be.equal(parseUnits("1", 0));
    });

    it("Should emit Issue event", async function () {
      const { contract, deployer, hash } = await loadFixture(deployFixture);

      const tokenId = await contract.read.counter();

      const issueHash = await contract.write.issue([hash]);
      const issueEvents = await contract.getEvents.Issue();

      expect(issueEvents.length).to.be.equal(1);

      const event = issueEvents[0];
      expect(event.eventName).to.be.equal("Issue");
      expect(event.transactionHash).to.be.equal(issueHash);
      expect(event.args.tokenId).to.be.equal(tokenId);
      expect(event.args.account).to.be.equal(
        getAddress(deployer.account.address)
      );
    });
  });

  describe("Uri", function () {
    it("Should return formatted Uri", async function () {
      const { contract, hash } = await loadFixture(deployFixture);

      const tokenId = await contract.read.counter();

      await contract.write.issue([hash]);

      expect(await contract.read.uri([tokenId])).to.be.equal(
        `ipfs://${hash}.json`
      );
    });
  });

  describe("Mint", function () {
    describe("Success", async function () {
      it("Should have an account balance of 1", async function () {
        const { contract, otherAccount, hash } = await loadFixture(
          deployFixture
        );

        const tokenId = await contract.read.counter();
        const amount = parseUnits("1", 0);
        const data = "0x0";

        await contract.write.issue([hash]);

        const balance0 = await contract.read.balanceOf([
          getAddress(otherAccount.account.address),
          tokenId,
        ]);

        expect(balance0).to.be.equal(parseUnits("0", 0));

        await contract.write.mint(
          [getAddress(otherAccount.account.address), tokenId, amount, data],
          {
            account: otherAccount.account.address,
          }
        );

        const balance1 = await contract.read.balanceOf([
          getAddress(otherAccount.account.address),
          tokenId,
        ]);

        expect(balance1).to.be.equal(amount);
      });
    });
  });
});
