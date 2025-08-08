const deploy = async ({ midl }) => {
    console.log("Starting MultiCollateralHintHelpers deployment...");

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

    // Get previously deployed contract addresses (no future addresses needed in args)
    const borrowerOperationsAddress = await midl.getDeployment("BorrowerOperations");

    await midl.deploy("MultiCollateralHintHelpers", {
        args: [borrowerOperationsAddress.address, GAS_COMPENSATION],
    });

    await midl.execute();
};

deploy.tags = ["main", "MultiCollateralHintHelpers"];
deploy.dependencies = ["BimaVault"];

module.exports = deploy;