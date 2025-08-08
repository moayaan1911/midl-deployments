const deploy = async ({ midl }) => {
    console.log("Starting StabilityPool deployment...");

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Predict BimaVault address (to be deployed in 014_deploy_BimaVault.js)
    const bimaVaultAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 5, // BimaVault will be deployed in 014
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const debtTokenAddress = await midl.getDeployment("DebtToken");
    const factoryAddress = await midl.getDeployment("Factory");
    const liquidationManagerAddress = await midl.getDeployment("LiquidationManager");

    await midl.deploy("StabilityPool", {
        args: [
            bimaCoreAddress.address,
            debtTokenAddress.address,
            bimaVaultAddress,
            factoryAddress.address,
            liquidationManagerAddress.address,
        ],
    });

    await midl.execute();
};

deploy.tags = ["main", "StabilityPool"];
deploy.dependencies = ["BorrowerOperations"];

module.exports = deploy;