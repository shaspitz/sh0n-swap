// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "./Sh0nToken.sol";

contract EthSwapper {
    string public name = "EthSwapper Exchange";
    Sh0nToken public sh0nTokenContract;
    uint public sh0nTokenToEthRate = 100;

    constructor(Sh0nToken tokenContract) {
        sh0nTokenContract = tokenContract;
    }

    function buySh0nTokens() public payable {
        uint tokenAmount = msg.value * sh0nTokenToEthRate;
        sh0nTokenContract.transfer(msg.sender, tokenAmount);
    }
}
