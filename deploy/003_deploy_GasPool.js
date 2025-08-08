const deploy = async ({ midl }) => {
  console.log("Starting GasPool deployment...");

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

  // Deploy GasPool (no constructor arguments needed)
  await midl.deploy("GasPool", {
    args: [],
  });

  await midl.execute();
};

deploy.tags = ["main", "GasPool"];

module.exports = deploy;
