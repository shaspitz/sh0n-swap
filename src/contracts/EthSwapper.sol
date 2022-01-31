// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Sh0nToken.sol";

contract EthSwapper {
    string public name = "EthSwapper Exchange";
    Sh0nToken public sh0nTokenContract;
    uint public sh0nTokenToEthRate = 100;

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
        uint sh0nTokenAmount = msg.value * sh0nTokenToEthRate;

        // Require that EthSwap has enough tokens. TODO: add a test for this statement. 
        require(sh0nTokenContract.balanceOf(address(this)) >= sh0nTokenAmount);

        // Transfer funds to sender. 
        sh0nTokenContract.transfer(msg.sender, sh0nTokenAmount);

        // Invoke event.        
        emit TokenPurchased(msg.sender, address(sh0nTokenContract), sh0nTokenAmount, sh0nTokenToEthRate);
    }
}
