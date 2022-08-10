pragma solidity ^0.5.0;

contract ThreeStar{

    //info about owner
    address payable internal owner;
    uint public ownerRemain;

    //info of player wallet address
    address payable internal playeraddr;

    //info of player bet 
    struct Player{
        uint amount;
    }

    mapping(address => Player) public playerInfo;
    //event for every game round
    event playGame(address player, uint betAmount);
    //event for every game round result if win result will be true if lose result will be false
    event gameResult(address player, uint prize, bool result);

    //event for send user token to contract
    event withdrawOrder(uint betAmount, bool success);

    //publish contract and setting owner
    constructor() public payable{
        owner = msg.sender;
        ownerRemain = msg.value;
    }

    //start game
    function game() public payable{
        require(msg.value>=10000000000000);

        playerInfo[msg.sender].amount = msg.value;

        ownerRemain += playerInfo[msg.sender].amount;
        emit playGame(msg.sender, msg.value);
    }

    function sendPrize(address payable _winner, uint _point) external payable{
        require(msg.sender == owner);
        uint _type = _point-2;
        playeraddr = _winner;

        if(_type == 1){
            ownerRemain -= playerInfo[playeraddr].amount*99/100*2;
            emit gameResult(msg.sender, playerInfo[playeraddr].amount*99/100*2, true);
            playeraddr.transfer(playerInfo[playeraddr].amount*99/100*2);
        }else if(_type == 2){
            ownerRemain -= playerInfo[playeraddr].amount*99/100*20;
            emit gameResult(msg.sender, playerInfo[playeraddr].amount*99/100*20, true);
            playeraddr.transfer(playerInfo[playeraddr].amount*99/100*20);
        }else if(_type == 3){
            ownerRemain -= playerInfo[playeraddr].amount*99/100*100;
            emit gameResult(msg.sender, playerInfo[playeraddr].amount*99/100*100, true);
            playeraddr.transfer(playerInfo[playeraddr].amount*99/100*100);
        }else{
            revert();
        }

        resetPlayer();
    }
    
    function resetPlayer() internal{
        playerInfo[playeraddr].amount = 0;
    }

    function balanceOf(address player) public view returns (uint){
        return playerInfo[player].amount;
    }

    function withdraw(uint withdrawAmount) external payable{
        require(msg.sender == owner);
        ownerRemain -= withdrawAmount;
        owner.transfer(withdrawAmount);
        emit withdrawOrder(withdrawAmount, true);
    }
}
