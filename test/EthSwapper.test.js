
const Sh0nToken = artifacts.require("Sh0nToken")
const EthSwapper = artifacts.require("EthSwapper")

require("chai")
    .use(require("chai-as-promised"))
    .should()

// Works for any token with 18 decimals, similar to ETH. 
function tokensToSmallestDecimal(numTokens) {
    return web3.utils.toWei(numTokens, "ether");
}

contract("EthSwapper", (accounts) => {
    let sh0nToken, ethSwapper

    // Deploy contracts before tests. 
    before(async () => {
        sh0nToken = await Sh0nToken.new(tokensToSmallestDecimal("100"))
        ethSwapper = await EthSwapper.new()
        // Transfer all tokens to Eth Swapper contract.
        await sh0nToken.transfer(ethSwapper.address, tokensToSmallestDecimal("100"))
    })

    describe("Sh0nToken deployment", async () => {
        it("Contract has correct name", async() => {
            const name = await sh0nToken.name()
            assert.equal(name, "Sh0nToken")
        })
 
        it("Token has initial supply as specified", async() => {
            const initSupply = await sh0nToken.totalSupply()
            assert.equal(initSupply, tokensToSmallestDecimal("100"))
        })
    })

    describe("EthSwapper deployment", async () => {
        it("contract has a name", async() => {
            const name = await ethSwapper.name()
            assert.equal(name, "EthSwapper Exchange")
        })

        it("Eth swapper contract has all the tokens", async () => {
            const balance = await sh0nToken.balanceOf(ethSwapper.address)
            assert.equal(balance, tokensToSmallestDecimal("100"))
        })
    })
})