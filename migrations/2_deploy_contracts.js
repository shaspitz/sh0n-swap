const Sh0nToken = artifacts.require("Sh0nToken");
const EthSwapper = artifacts.require("EthSwapper");

module.exports = async function(deployer) {
    // Deploy ERC20 contract for Sh0nToken with init supply of 1000.
    await deployer.deploy(Sh0nToken, 1000) 
    const token = await Sh0nToken.deployed()

    // Deploy ETH swapper contract. 
    await deployer.deploy(EthSwapper, token.address)
    const ethSwapper = await EthSwapper.deployed()

    // Transfer all tokens to EthSwapper contract. 
    const totalSupply = await token.totalSupply()
    await token.transfer(ethSwapper.address, totalSupply)
};
