import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetModule = buildModule("ClaimFaucetModule", (m) => {

  const claimFaucet = m.contract("ClaimFaucet");

  return { claimFaucet };
});

export default ClaimFaucetModule;
