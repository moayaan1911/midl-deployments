const deploy = async ({ midl }) => {
    console.log("Starting LiquidationManager deployment...");

    const GAS_COMPENSATION = hre.ethers.parseUnits("200", 18);
    console.log("GAS_COMPENSATION:", GAS_COMPENSATION.toString());

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Predict BorrowerOperations address (to be deployed in 008_deploy_BorrowerOperations.js)
    const borrowerOperationsAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 2, // BorrowerOperations will be deployed in 008
    });

    // Predict StabilityPool address (to be deployed in 009_deploy_StabilityPool.js)
    const stabilityPoolAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 3, // StabilityPool will be deployed in 009
    });

    // Get previously deployed Factory address
    const factoryAddress = await midl.getDeployment("Factory");

    await midl.deploy("LiquidationManager", {
        args: [stabilityPoolAddress, borrowerOperationsAddress, factoryAddress.address, GAS_COMPENSATION],
    });

    await midl.execute();
};

deploy.tags = ["main", "LiquidationManager"];
deploy.dependencies = ["Factory"];

module.exports = deploy;