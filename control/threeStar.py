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


def cannotLose(point, contractRemain, playerAmount):
    point -= 2
    if (point > 0):
        if (point == 1):
            if (contractRemain <= playerAmount * 2):
                return False
        elif (point == 2):
            if (contractRemain <= playerAmount * 20):
                return False
        elif (point == 3):
            if (contractRemain <= playerAmount * 100):
                return False
    elif (point > 3):
        return False

    return True


def createRandom():
    randomNumber = [random.randint(1, 80)]
    while len(randomNumber) < 20:
        temp = random.randint(1, 80)
        for i in randomNumber:
            if i == temp:
                break
            elif i == randomNumber[-1]:
                randomNumber.append(temp)

    randomNumber = sorted(randomNumber)
    return randomNumber


def countPoint(starNumber, userNumber):
    point = 0
    for i in starNumber:
        for j in userNumber:
            if j == i:
                point += 1
    return point


def game(*args):
    starNumber = createRandom()
    point = countPoint(starNumber, sorted(args[0]["userLuckyNum"]))
    winTS = 0
    winTT = 0

    contractRemain = blockchain.getOwnerRemain(web3, threeStarContract)
    playerAmount = args[0]["betNum"]

    while (cannotLose(point, contractRemain, playerAmount) == False):
        starNumber = createRandom()
        point = countPoint(starNumber, sorted(args[0]["userLuckyNum"]))

    if point > 2:
        sendPrize(args[0]["playerAddress"], point)
        if point == 3:
            winTT = playerAmount*99/100*2
        elif point == 4:
            winTT = playerAmount * 99 / 100 * 20
        elif point == 5:
            winTT = playerAmount *99/100*100
    else:
        giveTSToken(args[0]["playerAddress"], playerAmount * 0.004)
        winTS = playerAmount * 0.004

    return {"point": point, "starNumber": starNumber, "winTS": winTS, "winTT": winTT}


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

        withdrawThreeStar([{"privateKey": os.getenv("privateKey"), "amount": float(blockchain.getOwnerRemain(web3, threeStarContract)) - float(dividend)}])
        return "success"

    except Exception:
        return "insufficient balance"


def getTodayDividend():
    ownerRemain = blockchain.getOwnerRemain(web3, threeStarContract)
    return round(ownerRemain * 20 / 100, 5)


def getDividendInfo():
    dividend = getTodayDividend()
    APR = blockchain.getAPR(web3, dividend)
    payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT')) + datetime.timedelta(days=1)).strftime(
        "%m/%d") + " 00:00"

    return str(dividend), APR, payout


def giveTSToken(receipient, amount):
    try:
        receipient = Web3.toChecksumAddress(receipient)
        transferTSToken = TSContract.functions.transfer(receipient, web3.toWei(amount, "ether")).buildTransaction({
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        })

        blockchain.sendTransaction(web3, transferTSToken)
        return "success"
    except:
        return "failed"

def withdrawThreeStar(*args):
    if args[0]['privateKey'] == os.getenv("privateKey"):
        threeStarWithdraw = threeStarContract.functions.withdraw(web3.toWei(args[0]['amount'], "ether")).buildTransaction({
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        })
        blockchain.sendTransaction(web3, threeStarWithdraw)
        return {"result": "success"}
    else:
        return {"result": "failed"}


def test():
    # userStake = TSContract.functions.allowance('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress).call()
    test = web3.fromWei(threeStarContract.functions.sendPrize('0xf58392840Be5939AB1DA03569D1B3C70247D5400', 5).call({
        'from': '0xf58392840Be5939AB1DA03569D1B3C70247D5400'
    }), 'ether')
    print(test)
    return test
    """userStake = TSContract.functions.transferFrom('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress, web3.toWei(10, 'ether')).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    result = sendTransaction(userStake)"""
