/**
 * @type import('hardhat/config').HardhatUserConfig
 */

require("hardhat-watcher");
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.12",
  watcher: {
    compile: {
      tasks: ["compile"],
    },
  },
};
