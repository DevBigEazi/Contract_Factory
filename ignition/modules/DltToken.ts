import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DltTokenModule = buildModule("DltTokenModule", (m) => {

  const dltToken = m.contract("DltToken");

  return { dltToken };
});

export default DltTokenModule;
