// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./IERC20.sol";

contract ThreeStarToken is IERC20 {
    uint public totalSupply;
    uint public remain;
    mapping(address => uint) public balanceOf;
    mapping(address => mapping(address => uint)) public allowance;
    string public name = "";
    string public symbol = "";
    uint8 public decimals = 18;

    address internal owner;

    constructor(uint _totalSupply, string memory _name, string memory _symbol){
        totalSupply = _totalSupply;
        remain = _totalSupply;
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        balanceOf[owner] += _totalSupply*40/100;
        remain -= _totalSupply*40/100;
        emit Transfer(address(0), owner, _totalSupply*40/100);
    }

    function transfer(address recipient, uint amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool) {
        allowance[sender][recipient] -= amount;
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function masterTransfer(uint amount) external{
        require(msg.sender == owner);
        remain -= amount;
        balanceOf[owner] += amount;
        emit Transfer(address(0), owner, amount);
    }

    function mint(uint amount) external {
        require(msg.sender == owner);
        remain += amount;
        totalSupply += amount;
        emit Transfer(address(0), msg.sender, amount);
    }

    function burn(uint amount) external {
        require(msg.sender == owner);
        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;
        emit Transfer(msg.sender, address(0), amount);
    }
}
