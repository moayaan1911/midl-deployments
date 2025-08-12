/**
 * @param {import('hardhat/types').HardhatRuntimeEnvironment} hre
 */
async function main(hre) {
  try {
    await hre.midl.initialize();

    const receiver = "0x02eB26E5bcCe071627dCa12b1C5bA17cE78e031D";
    const amount = hre.ethers.parseEther("200");

    console.log("Queuing transfer deposit...");
    await hre.midl.callContract("StakedBTC", "transfer", {
      args: [receiver, amount],
    });
    console.log("Transfer deposit is queued");

    console.log("Executing transfer...");
    await hre.midl.execute();
    console.log("Transfer executed successfully");
  } catch (error) {
    console.error("Error executing transfer:", error);
    throw error;
  }
}

// Export the function for Hardhat to use
module.exports = main;
module.exports.tags = ["main", "FlowTest Deposit"];
module.exports.dependencies = ["FlowTest"];

// Execute the script if run directly
if (require.main === module) {
  const hre = require("hardhat");
  main(hre)
    .then(() => {
      console.log("Script completed successfully.");
    })
    .catch((error) => {
      console.error("Error executing deployment script:", error);
    })
    .finally(() => {
      process.exit(0);
    });
}
