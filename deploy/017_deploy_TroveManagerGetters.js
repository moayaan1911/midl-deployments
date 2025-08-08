const deploy = async ({ midl }) => {
  console.log("Starting TroveManagerGetters deployment...");

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
  const factoryAddress = await midl.getDeployment("Factory");

  await midl.deploy("TroveManagerGetters", {
    args: [factoryAddress.address],
  });

  await midl.execute();
};

deploy.tags = ["main", "TroveManagerGetters"];

module.exports = deploy;
