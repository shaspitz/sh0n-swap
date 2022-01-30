pragma solidity ^0.8.11;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract Sh0nToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Sh0nToken", "SH0N") {
        _mint(msg.sender, initialSupply);
    }
}
