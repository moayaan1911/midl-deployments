const deploy = async ({ midl }) => {
  console.log("Starting BimaVault deployment...");

  await midl.initialize();
  const bitcoinAccount = midl.getConfig().getState()?.accounts?.[0];
  console.log("bitcoinAccount", bitcoinAccount);
  const owner = midl.getEVMAddress();
  const provider = new hre.ethers.JsonRpcProvider(
    "https://rpc.regtest.midl.xyz"
  );
  const deployerNonce = await provider.getTransactionCount(owner);

  console.log("owner", owner);
  console.log("deployerNonce", deployerNonce);

  // Get previously deployed contract addresses (no future addresses needed in args)
  const bimaCoreAddress = await midl.getDeployment("BimaCore");
  const bimaTokenAddress = await midl.getDeployment("BimaToken");
  const tokenLockerAddress = await midl.getDeployment("TokenLocker");
  const incentiveVotingAddress = await midl.getDeployment("IncentiveVoting");
  const stabilityPoolAddress = await midl.getDeployment("StabilityPool");

  await midl.deploy("BimaVault", {
    args: [
      bimaCoreAddress.address,
      bimaTokenAddress.address,
      tokenLockerAddress.address,
      incentiveVotingAddress.address,
      stabilityPoolAddress.address,
      owner,
    ],
  });

  await midl.execute();
};

deploy.tags = ["main", "BimaVault"];

module.exports = deploy;
