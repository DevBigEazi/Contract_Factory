import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const ClaimFaucetFactoryModule = buildModule("ClaimFaucetFactoryModule", (m) => {

  const claimFaucetFactory = m.contract("ClaimFaucetFactory");

  return { claimFaucetFactory };
});

export default ClaimFaucetFactoryModule;
