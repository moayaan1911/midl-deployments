const deploy = async ({ midl }) => {
    console.log("Starting PriceFeed deployment...");

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Get previously deployed BimaCore address (no future addresses needed in args)
    const bimaCoreAddress = await midl.getDeployment("BimaCore");

    await midl.deploy("PriceFeed", {
        args: [bimaCoreAddress.address],
    });

    await midl.execute();
};

deploy.tags = ["main", "PriceFeed"];

module.exports = deploy;