const deploy = async ({ midl }) => {
  console.log("Starting deployment process...");

  await midl.initialize();
  const config = await midl.getConfig();
  console.log("config", config);
  const owner = midl.getEVMAddress();
  const bitcoinAccount = config.getState()?.accounts?.[0];
  console.log("bitcoinAccount", bitcoinAccount);
  console.log("owner", owner);
  const provider = new hre.ethers.JsonRpcProvider(
    "https://rpc.regtest.midl.xyz"
  );
  const deployerNonce = await provider.getTransactionCount(owner);
  console.log("deployerNonce", deployerNonce);

  await midl.execute();
};

deploy.tags = ["Demo"];

module.exports = deploy;
