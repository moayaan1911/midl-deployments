const deploy = async ({ midl }) => {
    console.log("Starting Factory deployment...");

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Predict LiquidationManager address (to be deployed in 006_deploy_LiquidationManager.js)
    const liquidationManagerAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 1, // LiquidationManager will be deployed in 006
    });

    // Predict DebtToken address (to be deployed in 007_deploy_DebtToken.js)
    const debtTokenAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 2, // DebtToken will be deployed in 007
    });

    // Predict BorrowerOperations address (to be deployed in 008_deploy_BorrowerOperations.js)
    const borrowerOperationsAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 3, // BorrowerOperations will be deployed in 008
    });

    // Predict StabilityPool address (to be deployed in 009_deploy_StabilityPool.js)
    const stabilityPoolAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 4, // StabilityPool will be deployed in 009
    });

    // Predict TroveManager address (to be deployed in 010_deploy_TroveManager.js)
    const troveManagerAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 5, // TroveManager will be deployed in 010
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const sortedTrovesAddress = await midl.getDeployment("SortedTroves");

    await midl.deploy("Factory", {
        args: [
            bimaCoreAddress.address,
            debtTokenAddress,
            stabilityPoolAddress,
            borrowerOperationsAddress,
            sortedTrovesAddress.address,
            troveManagerAddress,
            liquidationManagerAddress,
        ],
    });

    await midl.execute();
};

deploy.tags = ["main", "Factory"];
deploy.dependencies = ["SortedTroves"];

module.exports = deploy;