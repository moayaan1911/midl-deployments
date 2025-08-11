const deploy = async ({ midl }) => {
  console.log("Starting New TroveManager deployment...");

  const ORACLE_HEARBEAT = BigInt("315576000");
  const SHARE_PRICE_SIGNATURE = "0x00000000";
  const SHARE_PRICE_DECIMALS = BigInt("18");
  const IS_BASE_CURRENCY_ETH_INDEXED = false;
  const CUSTOM_TROVE_MANAGER_IMPL_ADDRESS = hre.ethers.ZeroAddress;
  const CUSTOM_SORTED_TROVES_IMPL_ADDRESS = hre.ethers.ZeroAddress;
  const MINUTE_DECAY_FACTOR = BigInt("999037758833783000");
  const REDEMPTION_FEE_FLOOR = hre.ethers.parseEther("0.005");
  const MAX_REDEMPTION_FEE = hre.ethers.parseEther("1");
  const BORROWING_FEE_FLOOR = hre.ethers.parseEther("0.01");
  const MAX_BORROWING_FEE = hre.ethers.parseEther("0.03");
  const INTEREST_RATE_IN_BPS = BigInt("0");
  const MAX_DEBT = hre.ethers.parseEther("100000000000");
  const MCR = hre.ethers.parseUnits("1.5", 18);
  const REGISTERED_RECEIVER_COUNT = BigInt("2");

  console.log("ORACLE_HEARBEAT:", ORACLE_HEARBEAT.toString());
  console.log("SHARE_PRICE_SIGNATURE:", SHARE_PRICE_SIGNATURE);
  console.log("SHARE_PRICE_DECIMALS:", SHARE_PRICE_DECIMALS.toString());
  console.log("IS_BASE_CURRENCY_ETH_INDEXED:", IS_BASE_CURRENCY_ETH_INDEXED);
  console.log("MINUTE_DECAY_FACTOR:", MINUTE_DECAY_FACTOR.toString());
  console.log("REDEMPTION_FEE_FLOOR:", REDEMPTION_FEE_FLOOR.toString());
  console.log("MAX_REDEMPTION_FEE:", MAX_REDEMPTION_FEE.toString());
  console.log("BORROWING_FEE_FLOOR:", BORROWING_FEE_FLOOR.toString());
  console.log("MAX_BORROWING_FEE:", MAX_BORROWING_FEE.toString());
  console.log("INTEREST_RATE_IN_BPS:", INTEREST_RATE_IN_BPS.toString());
  console.log("MAX_DEBT:", MAX_DEBT.toString());
  console.log("MCR:", MCR.toString());
  console.log(
    "REGISTERED_RECEIVER_COUNT:",
    REGISTERED_RECEIVER_COUNT.toString()
  );

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

  // Get previously deployed contract addresses (complex setup with contract calls)
  const collateralAddress = (await midl.getDeployment("StakedBTC")).address;
  const factoryAddress = (await midl.getDeployment("Factory")).address;
  const priceFeedAddress = (await midl.getDeployment("PriceFeed")).address;
  const bimaVaultAddress = (await midl.getDeployment("BimaVault")).address;
  const oracleAddress = (await midl.getDeployment("MockOracle")).address;

  console.log("Collateral Address:", collateralAddress);

  const signer = await hre.ethers.getSigner(owner);
  const factory = await hre.ethers.getContractAt(
    "Factory",
    factoryAddress,
    signer
  );

  console.log("\n________\n");

  const initialTroveManagerCount = await factory.troveManagerCount();
  console.log("troveManagerCount before:", initialTroveManagerCount.toString());

  // Step 1: Set Oracle on PriceFeed contract
  console.log("Setting Oracle on PriceFeed contract...");
  await midl.callContract("PriceFeed", "setOracle", {
    address: priceFeedAddress,
    args: [
      collateralAddress,
      oracleAddress,
      ORACLE_HEARBEAT,
      SHARE_PRICE_SIGNATURE,
      SHARE_PRICE_DECIMALS,
      IS_BASE_CURRENCY_ETH_INDEXED,
    ],
    gas: BigInt(1000000),
  });
  console.log("setOracle call queued");

  await midl.execute({ skipEstimateGasMulti: true });
  console.log("Oracle is set on PriceFeed contract!");

  console.log("\n________________________________\n");

  // Step 2: Wait for 10 seconds to avoid transaction reversion
  console.log("Waiting for 10 seconds before the next transaction...");
  await new Promise((res) => setTimeout(res, 10000));

  // Step 3: Deploy new TroveManager instance via Factory
  console.log("Deploying new TroveManager via Factory contract...");
  await midl.callContract("Factory", "deployNewInstance", {
    address: factoryAddress,
    args: [
      collateralAddress,
      priceFeedAddress,
      CUSTOM_TROVE_MANAGER_IMPL_ADDRESS,
      CUSTOM_SORTED_TROVES_IMPL_ADDRESS,
      {
        minuteDecayFactor: MINUTE_DECAY_FACTOR,
        redemptionFeeFloor: REDEMPTION_FEE_FLOOR,
        maxRedemptionFee: MAX_REDEMPTION_FEE,
        borrowingFeeFloor: BORROWING_FEE_FLOOR,
        maxBorrowingFee: MAX_BORROWING_FEE,
        interestRateInBps: INTEREST_RATE_IN_BPS,
        maxDebt: MAX_DEBT,
        MCR: MCR,
      },
    ],
    gas: BigInt(1000000),
  });
  console.log("deployNewInstance call queued");

  await midl.execute({ skipEstimateGasMulti: true });
  console.log("New TroveManager is deployed from Factory contract!");

  // Step 4: Log updated troveManagerCount and fetch TroveManager address
  const troveManagerCount = await factory.troveManagerCount();
  console.log("troveManagerCount after:", troveManagerCount.toString());
  const troveManagerAddress = await factory.troveManagers(
    BigInt(String(Number(troveManagerCount) - 1))
  );
  console.log("New TroveManager Address:", troveManagerAddress);

  console.log("\n________________________________\n");

  // Step 5: Register receiver in BimaVault
  console.log("Registering TroveManager as receiver in BimaVault...");
  await midl.callContract("BimaVault", "registerReceiver", {
    address: bimaVaultAddress,
    args: [troveManagerAddress, REGISTERED_RECEIVER_COUNT],
    gas: BigInt(1000000),
  });
  console.log("registerReceiver call queued");

  await midl.execute({ skipEstimateGasMulti: true });
  console.log("Receiver has been registered!");

  console.log("\n________________________________\n");

  // Step 6: Log successful completion
  console.log("Deployment and configuration completed successfully!");
};

deploy.tags = ["main", "NewTroveManager"];

module.exports = deploy;
