from web3 import Web3
import random
import os
from dotenv import load_dotenv
from control import blockchain
import datetime, pytz
import time

load_dotenv()

owner = blockchain.getOwner()
web3, chainID = blockchain.thunderCore()
threeStarContractAddress, threeStarContract = blockchain.getThreeStarContract(web3)
stakeContractAddress, stakeContract = blockchain.getStakeContract(web3)
TSContractAddress, TSContract = blockchain.getTSToken(web3)

web3_bsc, chainID_bsc = blockchain.bsc()
threeStarContractAddress_bsc, threeStarContract_bsc = blockchain.getThreeStarContract_bsc(web3_bsc)
stakeContractAddress_bsc, stakeContract_bsc = blockchain.getStakeContract_bsc(web3_bsc)
TSContractAddress_bsc, TSContract_bsc = blockchain.getTSToken_bsc(web3_bsc)


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
            winTT = playerAmount * 99 / 100 * 2
        elif point == 4:
            winTT = playerAmount * 99 / 100 * 20
        elif point == 5:
            winTT = playerAmount * 99 / 100 * 100
    else:
        giveTSToken(args[0]["playerAddress"], playerAmount * 0.004)
        winTS = playerAmount * 0.004

    return {"point": point, "starNumber": starNumber, "winTS": winTS, "winTT": winTT}


def game_bsc(*args):
    starNumber = createRandom()
    point = countPoint(starNumber, sorted(args[0]["userLuckyNum"]))
    winTS = 0
    winTT = 0

    contractRemain = blockchain.getOwnerRemain(web3_bsc, threeStarContract_bsc)
    playerAmount = args[0]["betNum"]

    while (cannotLose(point, contractRemain, playerAmount) == False):
        starNumber = createRandom()
        point = countPoint(starNumber, sorted(args[0]["userLuckyNum"]))

    if point > 2:
        sendPrize_bsc(args[0]["playerAddress"], point)
        if point == 3:
            winTT = playerAmount * 99 / 100 * 2
        elif point == 4:
            winTT = playerAmount * 99 / 100 * 20
        elif point == 5:
            winTT = playerAmount * 99 / 100 * 100
    else:
        giveTSToken_bsc(args[0]["playerAddress"], playerAmount * 52000)
        winTS = playerAmount * 52000

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


def sendPrize_bsc(winner, point):
    winner = Web3.toChecksumAddress(winner)

    contractSendPrize = threeStarContract_bsc.functions.sendPrize(winner, point).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'gasPrice': web3_bsc.toWei('50', 'gwei'),
            'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
        }
    )

    result = blockchain.sendTransaction(web3_bsc, contractSendPrize)
    return result


def setReward():
    try:
        dividend = getTodayDividend(web3, threeStarContract)
        withdrawThreeStar({"privateKey": os.getenv("privateKey"),
                           "amount": float(blockchain.getOwnerRemain(web3, threeStarContract)) - float(dividend)})

        try:
            time.sleep(60)

            tx = {
                'nonce': web3.eth.get_transaction_count(owner['address']),
                'to': stakeContractAddress,
                'value': web3.toWei(117.49081, 'ether'),
                'gas': 6721975,
                'gasPrice': web3.toWei('50', 'gwei'),
                'chainId': int(chainID)
            }
            blockchain.sendTransaction(web3, tx)

            setTodayReward = stakeContract.functions.setReward(web3.toWei(117.49081, 'ether')).buildTransaction(
                {
                    'from': owner['address'],
                    'gas': 6721975,
                    'nonce': web3.eth.get_transaction_count(owner['address']),
                }
            )
            blockchain.sendTransaction(web3, setTodayReward)
        except:
            "owner insufficient balance"

        return "success"

    except:
        return "contract insufficient balance"


def setReward_bsc():
    try:
        dividend = getTodayDividend(web3_bsc, threeStarContract_bsc)
        withdrawThreeStar_bsc({"privateKey": os.getenv("privateKey"),
                               "amount": float(blockchain.getOwnerRemain(web3_bsc, threeStarContract_bsc)) - float(
                                   dividend)})

        try:
            time.sleep(60)

            tx = {
                'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
                'to': stakeContractAddress_bsc,
                'value': web3_bsc.toWei(dividend, 'ether'),
                'gas': 6721975,
                'gasPrice': web3_bsc.toWei('50', 'gwei'),
                'chainId': int(chainID_bsc)
            }
            blockchain.sendTransaction(web3_bsc, tx)

            setTodayReward = stakeContract_bsc.functions.setReward(web3_bsc.toWei(dividend, 'ether')).buildTransaction(
                {
                    'from': owner['address'],
                    'gas': 6721975,
                    'gasPrice': web3_bsc.toWei('50', 'gwei'),
                    'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
                }
            )
            blockchain.sendTransaction(web3_bsc, setTodayReward)
        except:
            "owner insufficient balance"

        return "success"

    except:
        return "contract insufficient balance"


def getTodayDividend(web3, threeStarContract):
    ownerRemain = blockchain.getOwnerRemain(web3, threeStarContract)
    return round(ownerRemain * 20 / 100, 5)


def getDividendInfo():
    dividend = getTodayDividend(web3, threeStarContract)
    APR = blockchain.getAPR(web3, dividend)
    payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT')) + datetime.timedelta(days=1)).strftime(
        "%m/%d") + " 00:00"

    return str(dividend), APR, payout


def getDividendInfo_bsc():
    dividend = getTodayDividend(web3_bsc, threeStarContract_bsc)
    APR = blockchain.getAPR_bsc(web3_bsc, dividend)
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


def giveTSToken_bsc(receipient, amount):
    try:
        receipient = Web3.toChecksumAddress(receipient)
        transferTSToken = TSContract_bsc.functions.transfer(receipient,
                                                            web3_bsc.toWei(amount, "ether")).buildTransaction({
            'from': owner['address'],
            'gas': 1041586,
            'gasPrice': web3_bsc.toWei('50', 'gwei'),
            'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
        })

        blockchain.sendTransaction(web3_bsc, transferTSToken)
        return "success"
    except:
        return "failed"


def withdrawThreeStar(*args):
    if args[0]['privateKey'] == os.getenv("privateKey"):
        try:
            threeStarWithdraw = threeStarContract.functions.withdraw(
                web3.toWei(args[0]['amount'], "ether")).buildTransaction({
                'from': owner['address'],
                'gas': 1041586,
                'nonce': web3.eth.get_transaction_count(owner['address']),
            })
            blockchain.sendTransaction(web3, threeStarWithdraw)
        except:
            return {"result": "failed"}

        return {"result": "success"}
    else:
        return {"result": "failed"}


def withdrawThreeStar_bsc(*args):
    if args[0]['privateKey'] == os.getenv("privateKey"):
        try:
            threeStarWithdraw = threeStarContract_bsc.functions.withdraw(
                web3_bsc.toWei(args[0]['amount'], "ether")).buildTransaction({
                'from': owner['address'],
                'gas': 1041586,
                'gasPrice': web3_bsc.toWei('50', 'gwei'),
                'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
            })
            blockchain.sendTransaction(web3_bsc, threeStarWithdraw)
        except:
            return {"result": "failed"}

        return {"result": "success"}
    else:
        return {"result": "failed"}


def test():
    """userStake = TSContract.functions.transferFrom('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress, web3.toWei(10, 'ether')).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    result = sendTransaction(userStake)"""
