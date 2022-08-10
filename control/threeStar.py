from web3 import Web3
import random
import os
from dotenv import load_dotenv
from control import blockchain
import datetime, pytz

load_dotenv()

owner = blockchain.getOwner()
web3, chainID = blockchain.thunderCore()
threeStarContractAddress, threeStarContract = blockchain.getThreeStarContract(web3)
stakeContractAddress, stakeContract = blockchain.getStakeContract(web3)
TSContractAddress, TSContract = blockchain.getTSToken(web3)


def game(userLuckyNum):
    starNumber = [random.randint(1, 80)]
    while len(starNumber) < 20:
        temp = random.randint(1, 80)
        for i in starNumber:
            if i == temp:
                break
            elif i == starNumber[-1]:
                starNumber.append(temp)

    starNumber = sorted(starNumber)

    point = 0
    for i in starNumber:
        for j in userLuckyNum:
            if j == i:
                point += 1

    return {"point": point, "starNumber": starNumber}


def sendPrize(winner, point):
    winner = Web3.toChecksumAddress(winner)

    contractSendPrize = threeStarContract.functions.sendPrize(winner, point).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    result = blockchain.sendTransaction(web3, contractSendPrize)
    return result


def setReward():
    try:
        dividend = getTodayDividend()
        tx = {
            'nonce': web3.eth.get_transaction_count(owner['address']),
            'to': stakeContractAddress,
            'value': web3.toWei(dividend, 'ether'),
            'gas': 1041586,
            'gasPrice': web3.toWei('50', 'gwei'),
            'chainId': 18
        }

        blockchain.sendTransaction(web3, tx)

        setTodayReward = stakeContract.functions.setReward(web3.toWei(dividend, 'ether')).buildTransaction(
            {
                'from': owner['address'],
                'gas': 1041586,
                'nonce': web3.eth.get_transaction_count(owner['address']),
            }
        )
        blockchain.sendTransaction(web3, setTodayReward)
        return "success"

    except Exception:
        return "insufficient balance"


def getOwnerRemain():
    ownerRemain = web3.fromWei(threeStarContract.functions.ownerRemain().call(), 'ether')
    return ownerRemain


def getTodayDividend():
    ownerRemain = getOwnerRemain()
    return round(ownerRemain * 20 / 100, 5)


def getDividendInfo():
    ownerRemain = blockchain.getOwnerRemain(web3, threeStarContract)
    dividend = getTodayDividend()
    APR = blockchain.getAPR(web3, dividend)
    payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT')) + datetime.timedelta(days=1)).strftime(
        "%m/%d") + " 00:00"

    return str(dividend), APR, payout


def test():
    # userStake = TSContract.functions.allowance('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress).call()
    userStake = web3.fromWei(threeStarContract.functions.ownerRemain().call(), 'ether')
    print(userStake)
    """userStake = TSContract.functions.transferFrom('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress, web3.toWei(10, 'ether')).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    result = sendTransaction(userStake)"""
