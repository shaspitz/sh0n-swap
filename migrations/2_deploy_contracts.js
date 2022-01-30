const EthSwapper = artifacts.require("EthSwapper");

module.exports = function(deployer) {
  deployer.deploy(EthSwapper);
};
