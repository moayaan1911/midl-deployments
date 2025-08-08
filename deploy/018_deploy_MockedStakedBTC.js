const deploy = async ({ midl }) => {
    console.log("Starting Mocked StakedBTC deployment...");

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Deploy Mocked StakedBTC (no constructor arguments needed)
    await midl.deploy("StakedBTC", {
        args: [],
    });

    await midl.execute();
};

deploy.tags = ["main", "StakedBTC"];
deploy.dependencies = ["TroveManagerGetters"];

module.exports = deploy;