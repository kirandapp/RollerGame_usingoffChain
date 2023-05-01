require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config()
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    fantom: {
      url: `${ process.env.FANTOM_PROVIDER }`,
      accounts:[`${process.env.PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: `${process.env.FANTOMSCAN_APIKEY}`,
  },
  settings: {
    optimizer: {
      enabled: true,
      viaIR: true,
      runs: 200,
    },
  },
  allowUnlimitedContractSize: true,
};
