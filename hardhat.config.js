/**
 * @type import('hardhat/config').HardhatUserConfig
 */

const { getJsonWalletAddress } = require("ethers/lib/utils");

require("hardhat-watcher");
require("hardhat-gas-reporter");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

console.log(process.env.COINMARKETCAP_APIKEY);
module.exports = {
  solidity: "0.8.12",
  watcher: {
    compile: {
      tasks: ["compile"],
    },
    test: {
      tasks: ["test"],
      files: ["contracts", "test"],
    },
  },
  gasReporter: {
    coinmarketcap: process.env.COINMARKETCAP_APIKEY,
  },
};
