const deploy = async ({ midl }) => {
  console.log("Starting deployment process...");

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

  const bimaCoreAddress = hre.ethers.getCreateAddress({
    from: owner,
    nonce: deployerNonce + 1,
  });

  await midl.deploy("BimaWrappedCollateralFactory", {
    args: [bimaCoreAddress],
  });

  await midl.execute();
};

deploy.tags = ["main", "BimaWrappedCollateralFactory"];

module.exports = deploy;
