const deploy = async ({ midl }) => {
    console.log("Starting DebtToken deployment...");

    const DEBT_TOKEN_NAME = "US Bitcoin Dollar";
    const DEBT_TOKEN_SYMBOL = "USBD";
    const GAS_COMPENSATION = hre.ethers.parseUnits("200", 18);
    console.log("DEBT_TOKEN_NAME:", DEBT_TOKEN_NAME);
    console.log("DEBT_TOKEN_SYMBOL:", DEBT_TOKEN_SYMBOL);
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
        nonce: deployerNonce + 1, // BorrowerOperations will be deployed in 008
    });

    // Predict StabilityPool address (to be deployed in 009_deploy_StabilityPool.js)
    const stabilityPoolAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 2, // StabilityPool will be deployed in 009
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const factoryAddress = await midl.getDeployment("Factory");
    const gasPoolAddress = await midl.getDeployment("GasPool");

    await midl.deploy("DebtToken", {
        args: [
            DEBT_TOKEN_NAME,
            DEBT_TOKEN_SYMBOL,
            stabilityPoolAddress,
            borrowerOperationsAddress,
            bimaCoreAddress.address,
            factoryAddress.address,
            gasPoolAddress.address,
            GAS_COMPENSATION,
        ],
    });

    await midl.execute();
};

deploy.tags = ["main", "DebtToken"];
deploy.dependencies = ["LiquidationManager"];

module.exports = deploy;