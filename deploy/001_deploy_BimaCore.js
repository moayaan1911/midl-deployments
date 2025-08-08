const deploy = async ({ midl }) => {
  console.log("Starting BimaCore deployment...");

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

  // Predict PriceFeed address (to be deployed in the next script: 002_deploy_PriceFeed.js)
  const priceFeedAddress = hre.ethers.getCreateAddress({
    from: owner,
    nonce: deployerNonce + 1, // PriceFeed will be deployed in 002
  });

  await midl.deploy("BimaCore", {
    args: [owner, owner, priceFeedAddress, owner],
  });

  await midl.execute();
};

deploy.tags = ["main", "BimaCore"];
deploy.dependencies = ["BimaWrappedCollateralFactory"];

module.exports = deploy;
