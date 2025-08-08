const deploy = async ({ midl }) => {
    console.log("Starting BorrowerOperations deployment...");

    const GAS_COMPENSATION = hre.ethers.parseUnits("200", 18);
    const MIN_NET_DEBT = hre.ethers.parseUnits("10", 18);
    console.log("GAS_COMPENSATION:", GAS_COMPENSATION.toString());
    console.log("MIN_NET_DEBT:", MIN_NET_DEBT.toString());

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Get previously deployed contract addresses (no future addresses needed in args)
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const debtTokenAddress = await midl.getDeployment("DebtToken");
    const factoryAddress = await midl.getDeployment("Factory");

    await midl.deploy("BorrowerOperations", {
        args: [
            bimaCoreAddress.address,
            debtTokenAddress.address,
            factoryAddress.address,
            MIN_NET_DEBT,
            GAS_COMPENSATION,
        ],
    });

    await midl.execute();
};

deploy.tags = ["main", "BorrowerOperations"];
deploy.dependencies = ["DebtToken"];

module.exports = deploy;