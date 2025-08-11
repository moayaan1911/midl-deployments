const hre = require("hardhat");

async function main() {
  const { midl, ethers } = hre;

  console.log("Starting Open Trove (standalone)...");

  const amountInWei = 2n * 10n ** 18n;
  const percentage = 200;
  const lstPrice = 95000;
  const normalizedPrice = Number(lstPrice);
  const percentageAmount =
    (BigInt(Number(amountInWei)) * BigInt(normalizedPrice) * 100n) /
      BigInt(percentage) -
    200n * 10n ** 18n;

  console.log("amountInWei:", amountInWei.toString());
  console.log("percentage:", percentage);
  console.log("lstPrice:", lstPrice);
  console.log("normalizedPrice:", normalizedPrice);
  console.log("percentageAmount:", percentageAmount.toString());

  await midl.initialize();

  const owner = midl.getEVMAddress();
  console.log("owner", owner);

  const network = await ethers.provider.getNetwork();
  console.log("chainId", Number(network.chainId));

  // Get required deployments
  const borrowerOperationsAddress = (
    await midl.getDeployment("BorrowerOperations")
  ).address;
  const bmBTCAddress = (await midl.getDeployment("StakedBTC")).address;
  const factoryAddress = (await midl.getDeployment("Factory")).address;

  // Resolve latest TroveManager via Factory
  const signer = await ethers.getSigner(owner);
  const factory = await ethers.getContractAt("Factory", factoryAddress, signer);
  const troveManagerCount = await factory.troveManagerCount();
  const troveManagerAddress = await factory.troveManagers(
    BigInt(String(Number(troveManagerCount) - 1))
  );

  // Step 1: Approve bmBTC for BorrowerOperations
  console.log("Approving bmBTC...");
  await midl.callContract("StakedBTC", "approve", {
    args: [borrowerOperationsAddress, amountInWei],
    to: bmBTCAddress,
    gas: 10_000_000n,
  });
  console.log("bmBTC Approved");

  // Step 2: Open Trove
  console.log("Queuing open trove position...");
  await midl.callContract("BorrowerOperations", "openTrove", {
    args: [
      troveManagerAddress,
      owner,
      1n * 10n ** 18n, // maxFeePercentage
      amountInWei, // Collateral amount
      percentageAmount, // Debt amount
      "0x0000000000000000000000000000000000000000", // upperHint
      "0x0000000000000000000000000000000000000000", // lowerHint
    ],
    to: borrowerOperationsAddress,
    gas: 10_000_000n,
  });
  console.log("Open Position Queued");

  console.log("Executing transaction...");
  await midl.execute({ skipEstimateGasMulti: true });
  console.log("Transaction executed successfully");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
