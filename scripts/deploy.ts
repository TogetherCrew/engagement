import hre from "hardhat";
import EngagementModule from "../ignition/modules/Engagement";

async function getUri() {
	return process.env.TOKEN_URI || "http://127.0.0.1:8545/";
}

async function main() {
	const uri = await getUri();

	if (!uri) {
		throw new Error("TOKEN_URI env variable is required");
	}

	const { engagement } = await hre.ignition.deploy(EngagementModule, {
		parameters: {
			EngagementModule: { uri },
		},
	});

	await hre.run("verify:verify", {
		address: engagement.address,
    constructorArguments: [uri],
	});
  
	console.log("Engagement deployed to:", engagement.address);
}

main().catch((error) => {
	console.error("Error during deployment:", error);
	process.exitCode = 1;
});
