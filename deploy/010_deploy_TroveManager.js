const deploy = async ({ midl }) => {
    console.log("Starting TroveManager deployment...");

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

    // Predict BimaVault address (to be deployed in 014_deploy_BimaVault.js)
    const bimaVaultAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 4, // BimaVault will be deployed in 014
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const gasPoolAddress = await midl.getDeployment("GasPool");
    const debtTokenAddress = await midl.getDeployment("DebtToken");
    const borrowerOperationsAddress = await midl.getDeployment("BorrowerOperations");
    const liquidationManagerAddress = await midl.getDeployment("LiquidationManager");

    await midl.deploy("TroveManager", {
        args: [
            bimaCoreAddress.address,
            gasPoolAddress.address,
            debtTokenAddress.address,
            borrowerOperationsAddress.address,
            bimaVaultAddress,
            liquidationManagerAddress.address,
            GAS_COMPENSATION,
        ],
    });

    await midl.execute();
};

deploy.tags = ["main", "TroveManager"];
deploy.dependencies = ["StabilityPool"];

module.exports = deploy;