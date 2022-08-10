// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IERC20 {
    function totalSupply() external view returns (uint);

    function balanceOf(address account) external view returns (uint);

    function transfer(address recipient, uint amount) external returns (bool);

    function allowance(address owner, address spender) external view returns (uint);

    function approve(address spender, uint amount) external returns (bool);

    function transferFrom(
        address sender,
        address recipient,
        uint amount
    ) external returns (bool);

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);
}

contract StakingRewards {
    IERC20 public immutable stakingToken;

    address internal owner;
    uint public ownerGasFee;

    uint TT = 0;

    // lasttime staking
    uint public stakingTimestamp;
    // lasttime withdraw
    uint public withdrawTimestamp;
    // User address => rewards to be claimed
    mapping(address => uint) public rewards;

    // Total staked
    uint public totalSupply;
    // User address => staked amount
    mapping(address => uint) public balanceOf;

    //all staker address
    address[] public stakerAddress;

    //stakingEvent
    event stakingEvent(address staker, uint stakeAmount, uint timestamp);
    //withdrawEvent
    event withdrawEvent(address staker, uint withdrawAmount, uint timestamp);

    //received event
    event Received(address angle, uint amount);

    event withdrawOrder(uint, bool);

    receive() external payable{
        emit Received(msg.sender, msg.value);
    }

    constructor(address _stakingToken) payable{
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "not authorized");
        _;
    }

    modifier updataStakingTimeStamp() {
        stakingTimestamp = block.timestamp;
        _;
    }

    modifier updataWithdrawTimeStamp() {
        withdrawTimestamp = block.timestamp;
        _;
    }

    function stake(uint _amount) external updataStakingTimeStamp(){
        require(_amount > 0, "amount = 0");

        stakingToken.transferFrom(msg.sender, address(this), _amount);
        balanceOf[msg.sender] += _amount;
        totalSupply += _amount;

        emit stakingEvent(msg.sender, _amount, stakingTimestamp);
        appendStaker(msg.sender);
    }

    function withdraw(uint _amount) external payable updataWithdrawTimeStamp(){
        require(_amount > 0, "amount <= 0");
        require(balanceOf[msg.sender] >= _amount, "insufficient balance");
        require(msg.value >= 1000000000000000000);

        ownerGasFee += msg.value;
        balanceOf[msg.sender] -= _amount;
        totalSupply -= _amount;
        stakingToken.transfer(msg.sender, _amount);

        emit withdrawEvent(msg.sender, _amount, withdrawTimestamp);
    }

    function appendStaker(address _staker) internal returns (bool){
        for(uint i = 0; i < stakerAddress.length; i++){
            if(_staker == stakerAddress[i]){
                return false;
            }
        }
        stakerAddress.push(_staker);
        return true;
    }

    function getReward() external{
        uint reward = rewards[msg.sender];
       
        if (reward > 0) {
            rewards[msg.sender] = 0;
            payable(msg.sender).transfer(reward);
        }
    }

    function setReward(uint todayEarn) external onlyOwner {
        for(uint i = 0; i < stakerAddress.length; i++){
            rewards[stakerAddress[i]] = balanceOf[stakerAddress[i]] / totalSupply * todayEarn;
        }
    }

    function masterWithdraw(uint withdrawAmount) external payable onlyOwner{
        ownerGasFee -= withdrawAmount;
        payable(owner).transfer(withdrawAmount);
        emit withdrawOrder(withdrawAmount, true);
    }
}