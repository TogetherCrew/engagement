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

const hash = "SOME_RANDOM_HASH";

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

    await contract.write.grantRole([
      await contract.read.PROVIDER_ROLE(),
      provider.account.address,
    ]);

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

  describe("Wrapper", function () {
    let amount = parseUnits("1", 0);
    const data = "0x0";
    let tokenId: any;
    let contract: any;
    let otherAccount: any;
    const date = parseUnits("1", 0);
    const cid = "SOME_RANDOM_CID";
    let provider: any;

    beforeEach(async function () {
      const fixture = await loadFixture(deployFixture);
      contract = fixture.contract;
      otherAccount = fixture.otherAccount;
      provider = fixture.provider;

      tokenId = await contract.read.counter();
      await contract.write.issue([hash]);
    });

    describe("Mint", function () {
      describe("Success", async function () {
        it("Should have an account balance of 1", async function () {
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
        it("Should emit Mint event", async function () {
          const mintHash = await contract.write.mint(
            [getAddress(otherAccount.account.address), tokenId, amount, data],
            {
              account: otherAccount.account.address,
            }
          );

          const mintEvents = await contract.getEvents.Mint();

          expect(mintEvents.length).to.be.equal(1);

          const mintEvent = mintEvents[0];
          expect(mintEvent.eventName).to.be.equal("Mint");
          expect(mintEvent.transactionHash).to.be.equal(mintHash);
          expect(mintEvent.args.tokenId).to.be.equal(tokenId);
          expect(mintEvent.args.account).to.be.equal(
            getAddress(otherAccount.account.address)
          );
        });
      });
      describe("Revert", async function () {
        it("Should revert with NotFound (token doesn't exist)", async function () {
          const tokenId = parseUnits("999", 0);

          await expect(
            contract.write.mint(
              [getAddress(otherAccount.account.address), tokenId, amount, data],
              {
                account: otherAccount.account.address,
              }
            )
          ).to.be.rejectedWith("NotFound(999)");
        });
        it("Should revert with MintLimit (token balance > 1)", async function () {
          await contract.write.mint(
            [getAddress(otherAccount.account.address), tokenId, amount, data],
            {
              account: otherAccount.account.address,
            }
          );

          await expect(
            contract.write.mint(
              [getAddress(otherAccount.account.address), tokenId, amount, data],
              {
                account: otherAccount.account.address,
              }
            )
          ).to.be.rejectedWith(
            `MintLimit("${getAddress(
              otherAccount.account.address
            )}", ${tokenId})`
          );
        });
      });
    });
    describe("Burn", function () {
      beforeEach(async function () {
        await contract.write.mint(
          [getAddress(otherAccount.account.address), tokenId, amount, data],
          {
            account: otherAccount.account.address,
          }
        );
      });
      describe("Success", async function () {
        it("Should have an account balance of 0", async function () {
          const balance1 = await contract.read.balanceOf([
            getAddress(otherAccount.account.address),
            tokenId,
          ]);

          expect(balance1).to.be.equal(amount);

          await contract.write.burn(
            [getAddress(otherAccount.account.address), tokenId, amount],
            {
              account: otherAccount.account.address,
            }
          );

          const balance0 = await contract.read.balanceOf([
            getAddress(otherAccount.account.address),
            tokenId,
          ]);

          expect(balance0).to.be.equal(parseUnits("0", 0));
        });
        it("Should emit Burn event", async function () {
          const burnHash = await contract.write.burn(
            [getAddress(otherAccount.account.address), tokenId, amount],
            {
              account: otherAccount.account.address,
            }
          );

          const burnEvents = await contract.getEvents.Burn();

          expect(burnEvents.length).to.be.equal(1);

          const burnEvent = burnEvents[0];
          expect(burnEvent.eventName).to.be.equal("Burn");
          expect(burnEvent.transactionHash).to.be.equal(burnHash);
          expect(burnEvent.args.tokenId).to.be.equal(tokenId);
          expect(burnEvent.args.account).to.be.equal(
            getAddress(otherAccount.account.address)
          );
        });
      });
      describe("Revert", async function () {
        it("Should revert with NotAllowed (msg.sender != account)", async function () {
          await expect(
            contract.write.burn([
              getAddress(otherAccount.account.address),
              tokenId,
              amount,
            ])
          ).to.be.rejectedWith(
            `NotAllowed("${getAddress(
              otherAccount.account.address
            )}", ${tokenId})`
          );
        });
        it("Should revert with NotFound (token doesn't exist)", async function () {
          tokenId = parseUnits("999", 0);

          await expect(
            contract.write.burn(
              [getAddress(otherAccount.account.address), tokenId, amount],
              {
                account: otherAccount.account.address,
              }
            )
          ).to.be.rejectedWith("NotFound(999)");
        });
      });
    });
    describe("Get score", function () {
      describe("Revert", async function () {
        it("Should revert with NotFound (token doesn't exist)", async function () {
          const { contract, otherAccount } = await loadFixture(deployFixture);
          const date = BigInt(new Date().getTime());
          const tokenId = parseUnits("999", 0);

          await expect(
            contract.read.getScores(
              [date, tokenId, getAddress(otherAccount.account.address)],
              {
                account: otherAccount.account.address,
              }
            )
          ).to.be.rejectedWith("NotFound(999)");
        });
      });
    });
    describe("Update Scores", function () {
      describe("Success", async function () {
        it("Should update scores mapping", async function () {
          await contract.write.updateScores([date, cid], {
            account: provider.account.address,
          });

          const scores = await contract.read.getScores(
            [date, tokenId, getAddress(provider.account.address)],
            {
              account: provider.account.address,
            }
          );

          expect(scores).to.be.equal(
            `ipfs://${cid}/${tokenId}/${getAddress(
              provider.account.address
            )}.json`
          );
        });
        it("Should emit UpdateScores event", async function () {
          const updateScoresHash = await contract.write.updateScores(
            [date, cid],
            {
              account: provider.account.address,
            }
          );

          const updateScoresEvents = await contract.getEvents.UpdateScores();

          expect(updateScoresEvents.length).to.be.equal(1);

          const updateScoresEvent = updateScoresEvents[0];
          expect(updateScoresEvent.eventName).to.be.equal("UpdateScores");
          expect(updateScoresEvent.transactionHash).to.be.equal(
            updateScoresHash
          );
          expect(updateScoresEvent.args.account).to.be.equal(
            getAddress(provider.account.address)
          );
          expect(updateScoresEvent.args.date).to.be.equal(date);
          expect(updateScoresEvent.args.cid).to.be.equal(cid);
        });
      });
      describe("Revert", async function () {
        it("Should revert with AccessControlUnauthorizedAccount (msg.sender doesn't have PROVIDER_ROLE)", async function () {
          const { contract, otherAccount } = await loadFixture(deployFixture);
          const PROVIDER_ROLE = await contract.read.PROVIDER_ROLE();

          await expect(
            contract.write.updateScores([date, cid], {
              account: otherAccount.account.address,
            })
          ).to.be.rejectedWith(
            `AccessControlUnauthorizedAccount("${getAddress(
              otherAccount.account.address
            )}", "${PROVIDER_ROLE}")`
          );
        });
      });
    });
  });
});
