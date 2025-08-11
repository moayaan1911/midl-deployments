const deploy = async ({ midl }) => {
  console.log("Starting MockOracle deployment...");

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

  // Deploy MockOracle (no constructor arguments needed)
  await midl.deploy("MockOracle", {
    args: [],
  });

  await midl.execute();
};

deploy.tags = ["main", "MockOracle"];

module.exports = deploy;
