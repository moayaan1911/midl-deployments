const deploy = async ({ midl }) => {
    console.log("Starting SortedTroves deployment...");

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Deploy SortedTroves (no constructor arguments needed)
    await midl.deploy("SortedTroves", {
        args: [],
    });

    await midl.execute();
};

deploy.tags = ["main", "SortedTroves"];
deploy.dependencies = ["GasPool"];

module.exports = deploy;