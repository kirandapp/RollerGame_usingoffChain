require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    fantom: {
      url: `https://ftm.getblock.io/7176162d-8e17-43dc-a78a-2837fcc423d3/testnet/`,
      accounts:[`0x4ba35480719fa68c04f812b60a58c78c05674d9ec35f87795cae3c32b55e74fc`],
    },
  },
  etherscan: {
    apiKey: `T1CP27RPHNJ79V379B1W2PEF3UBJDH8AG2`,
  }
};
