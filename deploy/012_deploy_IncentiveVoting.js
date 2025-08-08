const deploy = async ({ midl }) => {
    console.log("Starting IncentiveVoting deployment...");

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
        nonce: deployerNonce + 2, // BimaVault will be deployed in 014
    });

    // Get previously deployed contract addresses
    const bimaCoreAddress = await midl.getDeployment("BimaCore");
    const tokenLockerAddress = await midl.getDeployment("TokenLocker");

    await midl.deploy("IncentiveVoting", {
        args: [bimaCoreAddress.address, tokenLockerAddress.address, bimaVaultAddress],
    });

    await midl.execute();
};

deploy.tags = ["main", "IncentiveVoting"];
deploy.dependencies = ["TokenLocker"];

module.exports = deploy;