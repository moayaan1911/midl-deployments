const deploy = async ({ midl }) => {
    console.log("Starting BimaToken deployment...");

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
        nonce: deployerNonce + 1, // BimaVault will be deployed in 014
    });

    // Get previously deployed contract addresses
    const tokenLockerAddress = await midl.getDeployment("TokenLocker");

    await midl.deploy("BimaToken", {
        args: [bimaVaultAddress, tokenLockerAddress.address],
    });

    await midl.execute();
};

deploy.tags = ["main", "BimaToken"];
deploy.dependencies = ["IncentiveVoting"];

module.exports = deploy;