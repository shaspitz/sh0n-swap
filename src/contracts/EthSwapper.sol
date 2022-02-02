// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Sh0nToken.sol";

contract EthSwapper {
    string public name = "EthSwapper Exchange";
    Sh0nToken public sh0nTokenContract;

    /**
     * @dev Conversion rate, units of Sh0nToken per Ether.
     */
    uint public sh0nTokenPerEther = 100;

    event TokenPurchased(
        address accountAddr,
        address tokenAddr,
        uint amount,
        uint rate
    );

    constructor(Sh0nToken tokenContract) {
        sh0nTokenContract = tokenContract;
    }

    function buySh0nTokens() public payable {
        // Conversion rate.  
        uint sh0nTokenAmount = msg.value * sh0nTokenPerEther;

        // Require that EthSwap has enough tokens. TODO: add a test for this statement. 
        require(sh0nTokenContract.balanceOf(address(this)) >= sh0nTokenAmount);

        // Transfer funds to sender. 
        sh0nTokenContract.transfer(msg.sender, sh0nTokenAmount);

        // Invoke event.        
        emit TokenPurchased(msg.sender, address(sh0nTokenContract), sh0nTokenAmount, sh0nTokenPerEther);
    }

    function sellSh0nTokens(uint amount) public {
        // Conversion from Sh0nToken.
        uint etherAmount = amount / sh0nTokenPerEther;

        // Obtain Sh0nToken, pay out Ether. 
        sh0nTokenContract.transferFrom(msg.sender, address(this), amount);
        payable(msg.sender).transfer(etherAmount);
    }
}
