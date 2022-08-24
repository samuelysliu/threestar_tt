from web3 import Web3
import random
import os
from dotenv import load_dotenv
from control import blockchain
import datetime, pytz
import time
from module.prizeInfo import prizeInfo
from module.prizeClaimInfo import prizeClaimInfo
from module.userPrizeInfo import userPrizeInfo
from bson.objectid import ObjectId
from module.transactionInfo import transactionInfo

load_dotenv()

owner = blockchain.getOwner()
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


def getTodayDividend(web3, threeStarContractAddress):
    ownerRemain = blockchain.getOwnerRemain(web3, threeStarContractAddress)
    return round(ownerRemain * 20 / 100, 5)


def game_bsc(*args):
    transactionList = transactionInfo.getTransactionByHash({"hash": args[0]["hash"]})
    if blockchain.verifyHashInfo(web3_bsc, args[0]["hash"], threeStarContractAddress_bsc):
        if transactionList != "failed":
            for i in transactionList:
                if i["chainName"] == "bsc":
                    return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}

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

            if userUseBonus_bsc(args[0]["playerAddress"]):
                giveBNB(args[0]["playerAddress"], winTT)
                winTT = winTT*2

        else:
            winTS = float(playerAmount) * 0.004
            giveTSToken_bsc(args[0]["playerAddress"], winTS)
            if userUseBonus_bsc(args[0]["playerAddress"]):
                giveTSToken_bsc(args[0]["playerAddress"], winTS)
                winTS = winTS*2

        transactionInfo.saveTransaction({"address": args[0]["playerAddress"], "hash": args[0]["hash"],
                                         "chainName": "thunderCore", "betAmount": playerAmount, "winTT": winTT})

        return {"point": point, "starNumber": starNumber, "winTS": winTS, "winTT": winTT}
    else:
        return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}


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


def setReward_bsc():
    try:
        dividend = getTodayDividend(web3_bsc, threeStarContractAddress_bsc)
        withdrawThreeStar_bsc({"privateKey": os.getenv("privateKey"),
                               "amount": float(blockchain.getOwnerRemain(web3_bsc, threeStarContract_bsc)) - float(
                                   dividend)})
        try:
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


def getDividendInfo_bsc():
    dividend = getTodayDividend(web3_bsc, threeStarContractAddress_bsc)
    APR = blockchain.getAPR_bsc(web3_bsc, dividend)
    payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT')) + datetime.timedelta(days=1)).strftime(
        "%m/%d") + " 00:00"

    return str(dividend), APR, payout


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


def canClaimBool_bsc(prizeType, address):
    prizeType = prizeType
    if prizeType == "double bonus":
        prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
        todayPrizeClaim = prizeClaimInfo.getTodayClaim(self="")
        if todayPrizeClaim != "failed":
            for i in todayPrizeClaim:
                if address == i["address"] and "bsc" == i["chainName"] and prizeId == str(i["prizeId"]):
                    return False
            return True
        else:
            return False


def claimPrize_bsc(*args):
    try:
        prizeType = args[0]["prizeType"]
        address = args[0]["address"]

        if prizeType == "double bonus":
            if canClaimBool_bsc(prizeType, address):
                prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
                userHavePrizeList = userPrizeInfo.getUserPrizeByAddress({"address": address})
                for i in userHavePrizeList:
                    if i["prizeId"] == prizeId and i["chainName"] == "bsc":
                        myquery = {"_id": ObjectId(i["id"])}
                        newValues = {"$set": {"number": int(i["number"]) + 1}}
                        userPrizeInfo.updateUserPrize({"myquery": myquery, "newValues": newValues})
                        prizeClaimInfo.savePrizeClaim({"address": address, "prizeId": prizeId, "chainName": "bsc"})
                        return "success"

                userPrizeInfo.saveUserPrize({"address": address, "prizeId": prizeId, "chainName": "bsc", "number": 1})
                prizeClaimInfo.savePrizeClaim({"address": address, "prizeId": prizeId, "chainName": "bsc"})
                return "success"
            return "failed"

        else:
            return "failed"
    except:
        return "failed"


# get user all prize
def getUserPrizeList(playerAddress):
    userPrizeArray = userPrizeInfo.getUserPrizeByAddress({"address": playerAddress})
    return userPrizeArray


# user using prize coupon
def userUseBonus_bsc(playerAddress):
    userPrizeList = getUserPrizeList(playerAddress)
    for i in userPrizeList:
        if i["chainName"] == "bsc" and int(i["number"]) > 0:
            myquery = {"_id": ObjectId(i["id"])}
            newValues = {"$set": {"number": int(i["number"]) - 1}}
            userPrizeInfo.updateUserPrize({"myquery": myquery, "newValues": newValues})
            return True

    return False


def giveBNB(receipient, amount):
    try:
        receipient = Web3.toChecksumAddress(receipient)
        tx = {
            'nonce': web3_bsc.eth.get_transaction_count(owner['address']),
            'to': receipient,
            'value': web3_bsc.toWei(amount, 'ether'),
            'gas': 6721975,
            'gasPrice': web3_bsc.toWei('50', 'gwei'),
            'chainId': int(chainID_bsc)
        }
        blockchain.sendTransaction(web3_bsc, tx)
        return "success"
    except:
        return "failed"
