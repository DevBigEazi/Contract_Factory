import hre from "hardhat";

async function main() {
  const DEPLOYED_FACTORY_CONTRACT =
    "0xdA4641D00607843802AA27EcC6888AA92C73Df02";

  const owner = "0xa748409456180ccb70FA34e8ee276297B9A2a1cC";

  const signer = await hre.ethers.getSigner(owner);

  const factoryContractInstance = await hre.ethers.getContractAt(
    "ClaimFaucetFactory",
    DEPLOYED_FACTORY_CONTRACT
  );

  // Starting scripting
  console.log("######### Deploying Claim Faucet #########");
  const deployedClaimFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("Delthereum", "DTH");

  deployedClaimFaucetTx1.wait();

  console.log({ "Claim faucet 1 deployed to": deployedClaimFaucetTx1 });

  const deployedClaimFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .deployClaimFaucet("StockNot", "STCT");

  deployedClaimFaucetTx2.wait();

  console.log({ "Claim faucet 2 deployed to": deployedClaimFaucetTx2 });

  console.log(
    "###### Getting the length & data of deployed claim Faucet #####"
  );
  const getLengthOfDeployedContract =
    await factoryContractInstance.getLengthOfDeployedContracts();

  console.log({
    "Length of Claim faucets": getLengthOfDeployedContract.toString(),
  });

  const getUserContracts = await factoryContractInstance
    .connect(signer)
    .getUserDeployedContracts();

  console.table(getUserContracts);

  console.log("######### Getting User Deployed Claim Faucet By Index #######");
  const { deployer_: deployerA, deployedContract_: deployedContractA } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(0);

  const { deployer_: deployerB, deployedContract_: deployedContractB } =
    await factoryContractInstance
      .connect(signer)
      .getUserDeployedContractByIndex(1);

  console.log([
    { Deployer: deployerA, "Deployed Contract Address": deployedContractA },
    { Deployer: deployerB, "Deployed Contract Address": deployedContractB },
  ]);

  console.log("######### Getting Deployed Contract Info #######");
  const contractInfo1 = await factoryContractInstance.getInfoFromContract(
    deployedContractA
  );

  console.table(contractInfo1);

  console.log("######### Getting Deployed Contract Info #######");
  const contractInfo2 = await factoryContractInstance.getInfoFromContract(
    deployedContractB
  );

  console.table(contractInfo2);

  console.log(
    "######### Claiming token and getting user balance on the token #######"
  );
  const claimTokenFaucetTx1 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromContract(deployedContractA);

  claimTokenFaucetTx1.wait();

  const claimTokenFaucetTx2 = await factoryContractInstance
    .connect(signer)
    .claimFaucetFromContract(deployedContractB);

  claimTokenFaucetTx2.wait();

  const checkUserBalForToken1 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractA);

  const checkUserBalForToken2 = await factoryContractInstance
    .connect(signer)
    .getBalanceFromDeployedContract(deployedContractB);

  console.log({
    "Fuacet 1 Balance": hre.ethers.formatUnits(checkUserBalForToken1, 18),
    "Fuacet 2 Balance": hre.ethers.formatUnits(checkUserBalForToken2, 18),
  });
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
