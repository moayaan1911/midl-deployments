const deploy = async ({ midl }) => {
  console.log("Starting BimaFaucet deployment...");

  await midl.initialize();
  const owner = midl.getEVMAddress();
  console.log("Owner address:", owner);

  // Get collateral token address from previous deployment
  const collateralAddress = (await midl.getDeployment("StakedBTC")).address;
  console.log("Collateral Token Address:", collateralAddress);

  // Deploy BimaFaucet contract
  console.log("Deploying BimaFaucet contract...");
  await midl.deploy("BimaFaucet", {
    args: [],
  });

  console.log("BimaFaucet deployment queued");

  await midl.execute();
  console.log("BimaFaucet deployed successfully!");

  // Get the deployed faucet address
  const faucetAddress = (await midl.getDeployment("BimaFaucet")).address;
  console.log("BimaFaucet contract address:", faucetAddress);

  console.log("\n________________________________\n");

  // Transfer 10000 tokens to faucet contract
  console.log("Transferring 10000 bmBTC to faucet contract...");
  await midl.callContract("StakedBTC", "transfer", {
    address: collateralAddress,
    args: [faucetAddress, BigInt("10000000000000000000000")],
    gas: BigInt(200000),
  });

  console.log("Transfer call queued");

  await midl.execute();
  console.log("10000 bmBTC transferred to faucet contract successfully!");

  console.log("\n________________________________\n");
  console.log("BimaFaucet deployment and setup completed successfully!");
};

deploy.tags = ["BimaFaucet", "Faucet"];
module.exports = deploy;
