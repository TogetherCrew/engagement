import hre from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  const EngagementFactory = await hre.ethers.getContractFactory(
    "EngagementContract"
  );

  const EngagementContract = await EngagementFactory.deploy();

  await EngagementContract.waitForDeployment();

  const contractAddress = await EngagementContract.getAddress();

  if (hre.network.name !== "localhost" && hre.network.name !== "hardhat") {
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("Contract verified");
    } catch (error) {
      console.error("Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
