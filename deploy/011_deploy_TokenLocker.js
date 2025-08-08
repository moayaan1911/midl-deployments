const deploy = async ({ midl }) => {
    console.log("Starting TokenLocker deployment...");

    const LOCK_TO_TOKEN_RATIO = hre.ethers.parseUnits("1", 18);
    console.log("LOCK_TO_TOKEN_RATIO:", LOCK_TO_TOKEN_RATIO.toString());

    await midl.initialize();
    const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
    console.log("bitcoinAccount", bitcoinAccount);
    const owner = midl.getEVMAddress();
    const provider = new hre.ethers.JsonRpcProvider("https://rpc.regtest.midl.xyz");
    const deployerNonce = await provider.getTransactionCount(owner);

    console.log("owner", owner);
    console.log("deployerNonce", deployerNonce);

    // Predict IncentiveVoting address (to be deployed in 012_deploy_IncentiveVoting.js)
    const incentiveVotingAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 1, // IncentiveVoting will be deployed in 012
    });

    // Predict BimaToken address (to be deployed in 013_deploy_BimaToken.js)
    const bimaTokenAddress = hre.ethers.getCreateAddress({
        from: owner,
        nonce: deployerNonce + 2, // BimaToken will be deployed in 013
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");

    await midl.deploy("TokenLocker", {
        args: [bimaCoreAddress.address, bimaTokenAddress, incentiveVotingAddress, owner, LOCK_TO_TOKEN_RATIO],
    });

    await midl.execute();
};

deploy.tags = ["main", "TokenLocker"];
deploy.dependencies = ["TroveManager"];

module.exports = deploy;