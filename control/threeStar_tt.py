from web3 import Web3
import random
import os
from dotenv import load_dotenv
from control import blockchain
import datetime, pytz
from module.prizeInfo import prizeInfo
from module.prizeClaimInfo import prizeClaimInfo
from module.userPrizeInfo import userPrizeInfo
from bson.objectid import ObjectId
from module.transactionInfo import transactionInfo

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
    transactionList = transactionInfo.getTransactionByHash({"hash": args[0]["hash"]})
    if blockchain.verifyHashInfo(web3, args[0]["hash"], threeStarContractAddress):
        if transactionList != "failed":
            for i in transactionList:
                if i["chainName"] == "thunderCore":
                    return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}

        starNumber = createRandom()
        point = countPoint(starNumber, sorted(args[0]["userLuckyNum"]))
        winTS = 0
        winTT = 0

        contractRemain = blockchain.getOwnerRemain(web3, threeStarContractAddress)
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

        transactionInfo.saveTransaction({"address": args[0]["playerAddress"], "hash": args[0]["hash"], "chainName": "thunderCore"})

        return {"point": point, "starNumber": starNumber, "winTS": winTS, "winTT": winTT}
    else:
        return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}


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
        dividend = getTodayDividend(web3)
        withdrawThreeStar({"privateKey": os.getenv("privateKey"),
                           "amount": float(blockchain.getOwnerRemain(web3, threeStarContractAddress)) - float(dividend)})
        try:
            tx = {
                'nonce': web3.eth.get_transaction_count(owner['address']),
                'to': stakeContractAddress,
                'value': web3.toWei(dividend, 'ether'),
                'gas': 6721975,
                'gasPrice': web3.toWei('50', 'gwei'),
                'chainId': int(chainID)
            }
            blockchain.sendTransaction(web3, tx)

            setTodayReward = stakeContract.functions.setReward(web3.toWei(dividend, 'ether')).buildTransaction(
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


def getTodayDividend(web3):
    ownerRemain = blockchain.getOwnerRemain(web3, threeStarContractAddress)
    return round(ownerRemain * 20 / 100, 5)


def getDividendInfo():
    dividend = getTodayDividend(web3)
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


def canClaimBool(prizeType, address):
    prizeType = prizeType
    if prizeType == "double bonus":
        prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
        todayPrizeClaim = prizeClaimInfo.getTodayClaim(self="")
        if todayPrizeClaim != "failed":
            for i in todayPrizeClaim:
                if address == i["address"] and "thunderCore" == i["chainName"] and prizeId == str(i["prizeId"]):
                    return False
            return True
        else:
            return False


def claimPrize(*args):
    try:
        prizeType = args[0]["prizeType"]
        address = args[0]["address"]

        if prizeType == "double bonus":
            if canClaimBool(prizeType, address):
                prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
                userHavePrizeList = userPrizeInfo.getUserPrizeByAddress({"address": address})
                for i in userHavePrizeList:
                    if i["prizeId"] == prizeId and i["chainName"] == "thunderCore":
                        myquery = {"_id": ObjectId(i["id"])}
                        newValues = {"$set": {"number": int(i["number"]) + 1}}
                        userPrizeInfo.updateUserPrize({"myquery": myquery, "newValues": newValues})
                        prizeClaimInfo.savePrizeClaim({"address": address, "prizeId": prizeId, "chainName": "thunderCore"})
                        return "success"

                userPrizeInfo.saveUserPrize({"address": address, "prizeId": prizeId, "chainName": "thunderCore"})
                prizeClaimInfo.savePrizeClaim({"address": address, "prizeId": prizeId, "chainName": "thunderCore"})
                return "success"
            return "failed"
    except:
        return "failed"


def test():
    """userStake = TSContract.functions.transferFrom('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress, web3.toWei(10, 'ether')).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    result = sendTransaction(userStake)"""
