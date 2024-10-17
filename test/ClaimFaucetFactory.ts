import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("ClaimFaucetFactory", function () {
  async function deployClaimFaucetFactoryFixture() {
    const [owner, otherAccount, deployedContract] =
      await hre.ethers.getSigners();

    const deployContractInfo = {
      deployer: owner,
      DeployedContract: deployedContract,
    };

    const ClaimFaucetFactory = await hre.ethers.getContractFactory(
      "ClaimFaucetFactory"
    );

    const claimFaucetFactory = await ClaimFaucetFactory.deploy();

    return { claimFaucetFactory, owner, otherAccount, deployContractInfo };
  }

  describe("Deployment", function () {
    it("Should deploy the factory contract", async function () {
      const { claimFaucetFactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      expect(await claimFaucetFactory.getLengthOfDeployedContracts()).to.equal(
        0
      );
    });
  });

  describe("Deploy ClaimFaucet", function () {
    it("Should deploy a ClaimFaucet contract", async function () {
      const { claimFaucetFactory, owner } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await claimFaucetFactory.deployClaimFaucet("Valora", "VLR");

      const deployedContracts =
        await claimFaucetFactory.getAllContractDeployed();
      expect(deployedContracts.length).to.equal(1);
      expect(deployedContracts[0].deployer).to.equal(owner.address);
    });

    it("Should not allow deploying from zero address", async function () {
      const { claimFaucetFactory, otherAccount } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await expect(
        claimFaucetFactory
          .connect(otherAccount)
          .deployClaimFaucet("Mullato", "MLT")
      ).to.not.be.reverted;
    });
  });

  describe("Getter Functions", function () {
    it("Should return the correct user deployed contracts", async function () {
      const { claimFaucetFactory, otherAccount } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await claimFaucetFactory.deployClaimFaucet("First Token", "1TK");
      await claimFaucetFactory.deployClaimFaucet("Second Token", "2TK");

      const userContracts = await claimFaucetFactory.getUserDeployedContracts();
      expect(userContracts.length).to.equal(2);

      // If other account has no contracts deployed
      const otherUserContracts = await claimFaucetFactory
        .connect(otherAccount)
        .getUserDeployedContracts();
      expect(otherUserContracts.length).to.equal(0);
    });

    it("Should get a specific contract by index", async function () {
      const { claimFaucetFactory, owner, deployContractInfo } =
        await loadFixture(deployClaimFaucetFactoryFixture);

      await claimFaucetFactory.deployClaimFaucet("TokenA", "TKA");
      await claimFaucetFactory.deployClaimFaucet("TokenB", "TKB");

      await claimFaucetFactory.getUserDeployedContractByIndex(1);
      expect(deployContractInfo.deployer).to.equal(owner.address);
    });

    it("Should return token name and symbol", async function () {
      const { claimFaucetFactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await claimFaucetFactory.deployClaimFaucet("Hello", "HL");

      const deployedContracts =
        await claimFaucetFactory.getAllContractDeployed();
      const contractAddress = deployedContracts[0].deployedContract;

      const [name, symbol] = await claimFaucetFactory.getInfoFromContract(
        contractAddress
      );

      expect(name).to.equal("Hello");
      expect(symbol).to.equal("HL");
    });

    it("Should get balance of the contract address that claimed token", async function () {
      const { claimFaucetFactory } = await loadFixture(
        deployClaimFaucetFactoryFixture
      );

      await claimFaucetFactory.deployClaimFaucet("Delthereum", "DTH");

      const deployedContracts =
        await claimFaucetFactory.getAllContractDeployed();
      const contractAddress = deployedContracts[0].deployedContract;

      expect(
        await claimFaucetFactory.getBalanceFromDeployedContract(contractAddress)
      ).to.equal(0);
    });
  });
});
