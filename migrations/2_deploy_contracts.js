const Sh0nToken = artifacts.require("Sh0nToken");
const EthSwapper = artifacts.require("EthSwapper");

module.exports = function(deployer) {
  // Deploy ERC20 contract for Sh0nToken.
  deployer.deploy(Sh0nToken); 

  // Deploy ETH swapper contract. 
  deployer.deploy(EthSwapper);
};
