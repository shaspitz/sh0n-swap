const { assert } = require("chai");

const Sh0nToken = artifacts.require("Sh0nToken")
const EthSwapper = artifacts.require("EthSwapper")

require("chai")
    .use(require("chai-as-promised"))
    .should()

// Works for any token with 18 decimals, similar to ETH. 
function tokensToSmallestDecimal(numTokens) {
    return web3.utils.toWei(numTokens, "ether");
}

// Fetch two accounts explicitly, deployer and investor. 
// See https://trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript.html
// for use of contract function. 
contract("EthSwapper", ([deployer, investor]) => {
    let sh0nToken, ethSwapper

    before(async () => {
        sh0nToken = await Sh0nToken.new(tokensToSmallestDecimal("1000"))
        ethSwapper = await EthSwapper.new(sh0nToken.address)
        // Transfer all tokens to Eth Swapper contract.
        await sh0nToken.transfer(ethSwapper.address, tokensToSmallestDecimal("1000"))
    })

    describe("Sh0nToken deployment", async () => {
        it("Contract has correct name", async() => {
            const name = await sh0nToken.name()
            assert.equal(name, "Sh0nToken")
        })
 
        it("Token has initial supply as specified", async() => {
            const initSupply = await sh0nToken.totalSupply()
            assert.equal(initSupply, tokensToSmallestDecimal("1000"))
        })
    })

    describe("EthSwapper deployment", async () => {
        it("contract has a name", async() => {
            const name = await ethSwapper.name()
            assert.equal(name, "EthSwapper Exchange")
        })

        it("Eth swapper contract has all the tokens", async () => {
            const balance = await sh0nToken.balanceOf(ethSwapper.address)
            assert.equal(balance, tokensToSmallestDecimal("1000"))
        })
    })

    describe("buyTokens method", async() => {
        let resultOfBuy, investorInitialEth

        before(async () => {
            // Track initial ETH of investor. 
            investorInitialEth = await web3.eth.getBalance(investor)

            // Investor purchases sh0n tokens with 1 ETH. 
            resultOfBuy = await ethSwapper.buySh0nTokens({ from: investor, value: web3.utils.toWei("1", "ether")})
        })
        it("Allows user to purchase sh0ntokens from the eth swapper contract for a fixed price.", async() => {
            let investorBalance = await sh0nToken.balanceOf(investor)
            // Sh0nToken to ETH rate is 100, defined in contract itself. Investor should have 100 sh0ntokens. 
            assert.equal(investorBalance, tokensToSmallestDecimal("100"))

            // EthSwapper should have been decremented 100 Sh0nTokens from initial value. 
            let ethSwapperBalance = await sh0nToken.balanceOf(ethSwapper.address)
            assert.equal(ethSwapperBalance, tokensToSmallestDecimal("900"))

            // EthSwapper exchange contract should gain 1 ETH.
            ethSwapperBalance = await web3.eth.getBalance(ethSwapper.address)
            assert.equal(ethSwapperBalance, web3.utils.toWei("1", "ether"))

            // Investor loses 1 ETH + gas fees, assume gas fees are less than 0.1 ETH.
            let investorEth = await web3.eth.getBalance(investor)
            let losses = investorInitialEth - investorEth
            assert.isAbove(losses, Number(web3.utils.toWei("1", "ether")))
            assert.isBelow(losses, Number(web3.utils.toWei("1.1", "ether")))

            // Confirm event is emitted from logs. 
            const eventLog = resultOfBuy.logs[0].args
            assert.equal(eventLog.accountAddr, investor)
            assert.equal(eventLog.tokenAddr, sh0nToken.address)
            assert.equal(eventLog.amount, tokensToSmallestDecimal("100"))
            assert.equal(eventLog.rate.toString(), '100')

            // investor can't buy more tokens than the eth swapper possesses.  
            await ethSwapper.buySh0nTokens(tokensToSmallestDecimal("1500"), {from: investor}).should.be.rejected;
        })
    })

    describe("sellTokens method", async() => {
        let resultOfSale, investorInitialEth

        before(async () => {
            // Track initial ETH of investor. 
            investorInitialEth = await web3.eth.getBalance(investor)

            // Seller must set an allowance that the eth swapper contract is approved to spend/sell. 
            await sh0nToken.approve(ethSwapper.address, tokensToSmallestDecimal("100"), {from: investor})

            // Invoke sale. 
            resultOfSale = await ethSwapper.sellSh0nTokens(tokensToSmallestDecimal("100"), {from: investor})
        })
        it("Allows user to sell sh0ntokens from the eth swapper contract for a fixed price.", async() => {
            let investorBalance = await sh0nToken.balanceOf(investor)
            // Investor should have sold all of the 100 Sh0nTokens they had.
            assert.equal(investorBalance, tokensToSmallestDecimal("0"))

            // EthSwapper should gain 100 Sh0nTokens.
            let ethSwapperBalance = await sh0nToken.balanceOf(ethSwapper.address)
            assert.equal(ethSwapperBalance, tokensToSmallestDecimal("1000"))

            // EthSwapper should lose 1 Ether. 
            ethSwapperBalance = await web3.eth.getBalance(ethSwapper.address)
            assert.equal(ethSwapperBalance, web3.utils.toWei("0", "ether"))

            // Investor gains 1 ETH - gas fees,  assume gas fees are less than 0.1 ETH.
            let investorEth = await web3.eth.getBalance(investor)
            let gains = investorEth - investorInitialEth
            assert.isAbove(gains, Number(web3.utils.toWei("0.9", "ether")))
            assert.isBelow(gains, Number(web3.utils.toWei("1.0", "ether")))

            // Confirm event is emitted from logs. 
            const eventLog = resultOfSale.logs[0].args
            assert.equal(eventLog.accountAddr, investor)
            assert.equal(eventLog.tokenAddr, sh0nToken.address)
            assert.equal(eventLog.amount, tokensToSmallestDecimal("100"))
            assert.equal(eventLog.rate.toString(), "100")

            // Investor shouldn't be able to sell more than they possess. 
            await ethSwapper.sellSh0nTokens(tokensToSmallestDecimal("500"), {from: investor}).should.be.rejected;
        })
    })
})