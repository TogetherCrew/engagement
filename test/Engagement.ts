import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { formatUnits, getAddress, parseUnits } from "viem";

const hash = "0x0";
const DEFAULT_URI = "https://api.example.com";

describe("Engagement", () => {
	async function deployFixture() {
		const [deployer, otherAccount] = await hre.viem.getWalletClients();

		const contract = await hre.viem.deployContract("Engagement", [DEFAULT_URI]);

		const publicClient = await hre.viem.getPublicClient();

		return {
			contract,
			deployer,
			otherAccount,
			publicClient,
		};
	}

	describe("Deployment", () => {
		it("Shuld have counter equal 0", async () => {
			const { contract } = await loadFixture(deployFixture);

			expect(await contract.read.counter()).to.be.equal(parseUnits("0", 0));
		});

		it("Should have deployer as an Admin", async () => {
			const { contract, deployer } = await loadFixture(deployFixture);

			const adminRole = await contract.read.DEFAULT_ADMIN_ROLE();

			expect(await contract.read.hasRole([adminRole, deployer.account.address]))
				.to.be.true;
		});
	});

	describe("Issue", () => {
		it("Should increment counter by 1", async () => {
			const { contract } = await loadFixture(deployFixture);

			const counter0 = formatUnits(await contract.read.counter(), 0);

			await contract.write.issue([hash]);

			const counter1 = formatUnits(await contract.read.counter(), 0);

			expect(Number(counter1)).to.be.equal(Number(counter0) + 1);
		});
		it("Should have an account balance of 1", async () => {
			const { contract, otherAccount } = await loadFixture(deployFixture);

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

		it("Should emit Issue event", async () => {
			const { contract, deployer } = await loadFixture(deployFixture);

			const tokenId = await contract.read.counter();

			const issueHash = await contract.write.issue([hash]);
			const issueEvents = await contract.getEvents.Issue();

			expect(issueEvents.length).to.be.equal(1);

			const event = issueEvents[0];
			expect(event.eventName).to.be.equal("Issue");
			expect(event.transactionHash).to.be.equal(issueHash);
			expect(event.args.tokenId).to.be.equal(tokenId);
			expect(event.args.account).to.be.equal(
				getAddress(deployer.account.address),
			);
		});
	});

	describe("Uri", () => {
		describe("Success", () => {
			it("Should return formatted Uri", async () => {
				const { contract } = await loadFixture(deployFixture);

				const tokenId = await contract.read.counter();

				await contract.write.issue([hash]);

				expect(await contract.read.uri([tokenId])).to.be.equal(
					`${DEFAULT_URI}${tokenId}.json`,
				);
			});
		});

		describe("Revert", () => {
			it("Should revert with NotFound (token doesn't exist)", async () => {
				const { contract } = await loadFixture(deployFixture);
				const tokenId = parseUnits("999", 0);

				await expect(contract.read.uri([tokenId])).to.be.rejectedWith(
					"NotFound(999)",
				);
			});
		});
	});

	describe("Wrapper", () => {
		const amount = parseUnits("1", 0);
		const data = "0x0";
		let tokenId: any;
		let contract: any;
		let otherAccount: any;
		let date: any;

		beforeEach(async () => {
			const fixture = await loadFixture(deployFixture);
			contract = fixture.contract;
			otherAccount = fixture.otherAccount;

			tokenId = await contract.read.counter();
			date = 1234567890;
			await contract.write.issue([hash]);
		});

		describe("Mint", () => {
			describe("Success", async () => {
				it("Should have an account balance of 1", async () => {
					const balance0 = await contract.read.balanceOf([
						getAddress(otherAccount.account.address),
						tokenId,
					]);

					expect(balance0).to.be.equal(parseUnits("0", 0));

					await contract.write.mint(
						[getAddress(otherAccount.account.address), tokenId, amount, data],
						{ account: otherAccount.account.address },
					);

					const balance1 = await contract.read.balanceOf([
						getAddress(otherAccount.account.address),
						tokenId,
					]);

					expect(balance1).to.be.equal(amount);
				});

				it("Should emit Mint event", async () => {
					const mintHash = await contract.write.mint(
						[getAddress(otherAccount.account.address), tokenId, amount, data],
						{ account: otherAccount.account.address },
					);

					const mintEvents = await contract.getEvents.Mint();

					expect(mintEvents.length).to.be.equal(1);

					const mintEvent = mintEvents[0];
					expect(mintEvent.eventName).to.be.equal("Mint");
					expect(mintEvent.transactionHash).to.be.equal(mintHash);
					expect(mintEvent.args.tokenId).to.be.equal(tokenId);
					expect(mintEvent.args.account).to.be.equal(
						getAddress(otherAccount.account.address),
					);
				});
			});

			describe("Revert", async () => {
				it("Should revert with NotFound (token doesn't exist)", async () => {
					const invalidTokenId = parseUnits("999", 0);

					await expect(
						contract.write.mint(
							[
								getAddress(otherAccount.account.address),
								invalidTokenId,
								amount,
								data,
							],
							{ account: otherAccount.account.address },
						),
					).to.be.rejectedWith("NotFound(999)");
				});

				it("Should revert with MintLimit (token balance > 1)", async () => {
					await contract.write.mint(
						[getAddress(otherAccount.account.address), tokenId, amount, data],
						{ account: otherAccount.account.address },
					);

					await expect(
						contract.write.mint(
							[getAddress(otherAccount.account.address), tokenId, amount, data],
							{ account: otherAccount.account.address },
						),
					).to.be.rejectedWith(
						`MintLimit("${getAddress(otherAccount.account.address)}", ${tokenId})`,
					);
				});
			});
		});

		describe("Burn", () => {
			beforeEach(async () => {
				await contract.write.mint(
					[getAddress(otherAccount.account.address), tokenId, amount, data],
					{ account: otherAccount.account.address },
				);
			});

			describe("Success", async () => {
				it("Should have an account balance of 0", async () => {
					const balance1 = await contract.read.balanceOf([
						getAddress(otherAccount.account.address),
						tokenId,
					]);

					expect(balance1).to.be.equal(amount);

					await contract.write.burn(
						[getAddress(otherAccount.account.address), tokenId, amount],
						{ account: otherAccount.account.address },
					);

					const balance0 = await contract.read.balanceOf([
						getAddress(otherAccount.account.address),
						tokenId,
					]);

					expect(balance0).to.be.equal(parseUnits("0", 0));
				});

				it("Should emit Burn event", async () => {
					const burnHash = await contract.write.burn(
						[getAddress(otherAccount.account.address), tokenId, amount],
						{ account: otherAccount.account.address },
					);

					const burnEvents = await contract.getEvents.Burn();

					expect(burnEvents.length).to.be.equal(1);

					const burnEvent = burnEvents[0];
					expect(burnEvent.eventName).to.be.equal("Burn");
					expect(burnEvent.transactionHash).to.be.equal(burnHash);
					expect(burnEvent.args.tokenId).to.be.equal(tokenId);
					expect(burnEvent.args.account).to.be.equal(
						getAddress(otherAccount.account.address),
					);
				});
			});

			describe("Revert", async () => {
				it("Should revert with NotAllowed (msg.sender != account)", async () => {
					await expect(
						contract.write.burn([
							getAddress(otherAccount.account.address),
							tokenId,
							amount,
						]),
					).to.be.rejectedWith(
						`NotAllowed("${getAddress(otherAccount.account.address)}", ${tokenId})`,
					);
				});

				it("Should revert with NotFound (token doesn't exist)", async () => {
					const invalidTokenId = parseUnits("999", 0);

					await expect(
						contract.write.burn(
							[
								getAddress(otherAccount.account.address),
								invalidTokenId,
								amount,
							],
							{ account: otherAccount.account.address },
						),
					).to.be.rejectedWith("NotFound(999)");
				});
			});
		});

		describe("getScores", () => {
			describe("Success", () => {
				it("Should return the correct scores URL", async () => {
					const { contract, otherAccount } = await loadFixture(deployFixture);

					const date = 1234567890;
					const tokenId = await contract.read.counter();

					await contract.write.issue([hash]);

					const scoresURL = await contract.read.getScores([
						BigInt(date),
						tokenId,
						getAddress(otherAccount.account.address),
					]);

					expect(scoresURL).to.be.equal(
						`${DEFAULT_URI}/${date}/${tokenId}/${getAddress(
							otherAccount.account.address,
						)}.json`,
					);
				});
			});

			describe("Revert", () => {
				it("Should revert with NotFound (token doesn't exist)", async () => {
					const invalidTokenId = parseUnits("999", 0);

					await expect(
						contract.read.getScores([
							date,
							invalidTokenId,
							getAddress(otherAccount.account.address),
						]),
					).to.be.rejectedWith("NotFound(999)");
				});
			});
		});
	});
});
