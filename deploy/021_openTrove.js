const deploy = async ({ midl }) => {
    console.log("Starting Open Trove operation...");

    const amountInWei = BigInt(Math.floor(2 * 1e18));
    const percentage = 200;
    const lstPrice = 95000;
    const normalizedPrice = Number(lstPrice);
    const percentageAmount =
        BigInt(Number(amountInWei) * normalizedPrice * 100) / BigInt(percentage) - BigInt(Math.floor(200 * 1e18));

    console.log("amountInWei:", amountInWei.toString());
    console.log("percentage:", percentage);
    console.log("lstPrice:", lstPrice);
    console.log("normalizedPrice:", normalizedPrice);
    console.log("percentageAmount:", percentageAmount.toString());

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Get previously deployed contract addresses (bmBtc is same as StakedBTC)
    const borrowerOperationsAddress = (await midl.getDeployment("BorrowerOperations")).address;
    const bmBTCAddress = (await midl.getDeployment("StakedBTC")).address; // bmBTC is same as StakedBTC
    const borrowerAddress = owner;

    // Get TroveManager address from Factory
    const factoryAddress = (await midl.getDeployment("Factory")).address;
    const signer = await hre.ethers.getSigner(owner);
    const factory = await hre.ethers.getContractAt("Factory", factoryAddress, signer);
    const troveManagerCount = await factory.troveManagerCount();
    const troveManagerAddress = await factory.troveManagers(BigInt(String(Number(troveManagerCount) - 1)));

    // Step 1: Approve bmBTC for BorrowerOperations
    console.log("Approving bmBTC...");
    await midl.callContract("StakedBTC", "approve", {
        args: [borrowerOperationsAddress, amountInWei],
        to: bmBTCAddress,
        gas: 10000000n,
    });
    console.log("bmBTC Approved");

    // Step 2: Open Trove
    console.log("Queuing open trove position...");
    await midl.callContract("BorrowerOperations", "openTrove", {
        args: [
            troveManagerAddress,
            borrowerAddress,
            BigInt(Math.floor(1 * 1e18)), // maxFeePercentage
            amountInWei, // Collateral amount
            percentageAmount, // Debt amount
            "0x0000000000000000000000000000000000000000", // upperHint
            "0x0000000000000000000000000000000000000000", // lowerHint
        ],
        to: borrowerOperationsAddress,
        gas: 10000000n,
    });
    console.log("Open Position Queued");

    console.log("Executing transaction...");
    await midl.execute({ skipEstimateGasMulti: true });
    console.log("Transaction executed successfully");
};

deploy.tags = ["main", "openTrove"];
deploy.dependencies = ["NewTroveManager"];

module.exports = deploy;