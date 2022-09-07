from web3 import Web3
import os
from dotenv import load_dotenv
from control import blockchain
import datetime
import pytz
from module.prizeInfo import prizeInfo
from module.prizeClaimInfo import prizeClaimInfo
from module.userPrizeInfo import userPrizeInfo
from bson.objectid import ObjectId
from module.transactionInfo import transactionInfo
from module.dividendRoundInfo import dividendRoundInfo
import random

load_dotenv()


class threeStar:
    def __init__(self, chain):
        self.owner = blockchain.getOwner()
        if chain == "thunderCore":
            self.web3, self.chainID = blockchain.thunderCore()
            self.threeStarContractAddress, self.threeStarContract = blockchain.getThreeStarContract(self.web3)
            self.stakeContractAddress, self.stakeContract = blockchain.getStakeContract(self.web3)
            self.TSContractAddress, self.TSContract = blockchain.getTSToken(self.web3)
            self.dividendRoundInfo = dividendRoundInfo("thunderCore")
        elif chain == "bsc":
            self.web3, self.chainID = blockchain.bsc()
            self.threeStarContractAddress, self.threeStarContract = blockchain.getThreeStarContract_bsc(self.web3)
            self.stakeContractAddress, self.stakeContract = blockchain.getStakeContract_bsc(self.web3)
            self.TSContractAddress, self.TSContract = blockchain.getTSToken_bsc(self.web3)
            self.dividendRoundInfo = dividendRoundInfo("bsc")

    def cannotLose(self, point, contractRemain, playerAmount, userHaveBonus):
        if userHaveBonus:
            playerAmount = playerAmount * 2
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

    # create random lucky number
    def createRandom(self):
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

    # count point number
    def countPoint(self, starNumber, userNumber):
        point = 0
        for i in starNumber:
            for j in userNumber:
                if j == i:
                    point += 1
        return point

    # start game
    def game(self, *args):
        transactionList = transactionInfo.getTransactionByHash(
            {"hash": args[0]["hash"]})
        if blockchain.verifyHashInfo(self.web3, args[0]["hash"], self.threeStarContractAddress):
            if transactionList != "failed":
                for i in transactionList:
                    if i["chainName"] == "thunderCore":
                        return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}


            starNumber = self.createRandom()
            point = self.countPoint(starNumber, sorted(args[0]["userLuckyNum"]))
            winTS = 0
            winTT = 0

            contractRemain = blockchain.getOwnerRemain(
                self.web3, self.threeStarContractAddress)
            playerAmount = args[0]["betNum"]

            while (self.cannotLose(point, contractRemain, playerAmount,
                                   self.isUserHaveBonus(args[0]["playerAddress"])) == False):
                starNumber = self.createRandom()
                point = self.countPoint(starNumber, sorted(args[0]["userLuckyNum"]))

            if point == 3:
                winTT = playerAmount * 99 / 100 * 2
            elif point == 4:
                winTT = playerAmount * 99 / 100 * 20
            elif point == 5:
                winTT = playerAmount * 99 / 100 * 100
            elif point < 3:
                winTS = float(playerAmount) / 250

            if self.userUseBonus(args[0]["playerAddress"]):
                self.sendPrize(args[0]["playerAddress"], point, 2)
                winTT = winTT * 2
                winTS = winTS * 2
            else:
                self.sendPrize(args[0]["playerAddress"], point, 1)

            transactionInfo.saveTransaction(
                {"address": Web3.toChecksumAddress(args[0]["playerAddress"]), "hash": args[0]["hash"],
                 "chainName": "thunderCore", "betAmount": playerAmount, "winTT": winTT})

            return {"point": point, "starNumber": starNumber, "winTS": winTS, "winTT": winTT}

        else:
            return {"point": 0, "starNumber": [0], "winTS": 0, "winTT": 0}


    def sendPrize(self, winner, point, bonus):
        winner = Web3.toChecksumAddress(winner)
        contractSendPrize = self.threeStarContract.functions.sendPrize(winner, point, bonus).buildTransaction(
            {
                'from': self.owner['address'],
                'gasPrice': self.web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
            }
        )

        result = blockchain.sendTransaction(self.web3, contractSendPrize)
        return result


    def setReward(self):
        try:
            dividend = self.getTodayDividend()
            self.withdrawThreeStar({"privateKey": os.getenv("privateKey"),
                                    "amount": float(
                                        blockchain.getOwnerRemain(self.web3, self.threeStarContractAddress))})

            try:
                self.giveTT(self.stakeContractAddress, dividend)
                """
                setTodayReward = self.stakeContract.functions.setReward(
                    self.web3.toWei(dividend, 'ether')).buildTransaction(
                    {
                        'from': self.owner['address'],
                        'gasPrice': self.web3.toWei('50', 'gwei'),
                        'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
                    }
                )
                blockchain.sendTransaction(self.web3, setTodayReward)
                """
            except:
                return "owner insufficient balance"

            return "success"

        except:
            return "contract insufficient balance"



    # get today dividend
    def getTodayDividend(self):
        ownerRemain = blockchain.getOwnerRemain(self.web3, self.threeStarContractAddress)
        return round(ownerRemain * 20 / 100, 5)


    # get this round dividend info
    def getDividendInfo(self):
        dividend = self.getTodayDividend()
        APR = blockchain.getAPR(self.web3, dividend, self.stakeContract)
        payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT')) + datetime.timedelta(days=1)).strftime(
            "%m/%d") + " 00:00"
        totalStake = blockchain.getTotalStake(self.web3, self.TSContract, self.stakeContractAddress)
        roundNumber = int(self.dividendRoundInfo.getLastRound()["roundNumber"]) + 1

        return str(dividend), APR, payout, float(totalStake), roundNumber


    # scheduler will auto save lastRound
    def saveLastRound(self):
        try:
            dividend, APR, payout, totalStake, roundNumber = self.getDividendInfo()
            payout = "GMT " + (datetime.datetime.now(pytz.timezone('GMT'))).strftime(
                "%m/%d") + " 00:00"
            self.dividendRoundInfo.saveDividendRound(
                {"roundNumber": roundNumber, "payout": payout, "totalStake": totalStake, "APR": APR,
                 "dividend": dividend})
            return "success"
        except:
            return "failed"


    def getLastRound(self):
        lastRound = self.dividendRoundInfo.getLastRound()
        return {"roundNumber": lastRound["roundNumber"], "payout": lastRound["payout"],
                "totalStake": lastRound["totalStake"],
                "APR": lastRound["APR"], "dividend": lastRound["dividend"]}


    """
    # function let owner transfer 3star token
    def giveTSToken(self, receipient, amount):
        try:
            receipient = self.web3.toChecksumAddress(receipient)
            transferTSToken = self.TSContract.functions.transfer(receipient,
                                                                 self.web3.toWei(amount, "ether")).buildTransaction({
                'from': self.owner['address'],
                'gasPrice': self.web3.toWei('50', 'gwei'),
                'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
            })
    
            blockchain.sendTransaction(self.web3, transferTSToken)
            return "success"
        except:
            return "failed"
    
    """


    # master withdraw the tt in threestar main contract
    def withdrawThreeStar(self, *args):
        if args[0]['privateKey'] == os.getenv("privateKey"):
            try:
                threeStarWithdraw = self.threeStarContract.functions.withdraw(
                    self.web3.toWei(args[0]['amount'], "ether")).buildTransaction({
                    'from': self.owner['address'],
                    'gasPrice': self.web3.toWei('50', 'gwei'),
                    'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
                })
                blockchain.sendTransaction(self.web3, threeStarWithdraw)
            except:
                return {"result": "failed"}

            return {"result": "success"}
        else:
            return {"result": "failed"}


    # if user can get daily check prize
    def canClaimBool(self, prizeType, address):
        prizeType = prizeType
        address = address.lower()

        if prizeType == "double bonus":
            prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
            todayPrizeClaim = prizeClaimInfo.getTodayClaim(self='')
            if todayPrizeClaim != "failed":
                for i in todayPrizeClaim:
                    if address == i["address"] and "thunderCore" == i["chainName"] and prizeId == str(i["prizeId"]):
                        return False
                return True
            else:
                return False


    # usear request get daily prize
    def claimPrize(self, *args):
        try:
            prizeType = args[0]["prizeType"]
            address = args[0]["address"]

            if prizeType == "double bonus":
                if self.canClaimBool(prizeType, address):
                    prizeId = prizeInfo.getPrizeByName({"name": prizeType})["id"]
                    userHavePrizeList = userPrizeInfo.getUserPrizeByAddress(
                        {"address": address})
                    for i in userHavePrizeList:
                        if i["prizeId"] == prizeId and i["chainName"] == "thunderCore":
                            myquery = {"_id": ObjectId(i["id"])}
                            newValues = {"$set": {"number": int(i["number"]) + 1}}
                            userPrizeInfo.updateUserPrize(
                                {"myquery": myquery, "newValues": newValues})
                            prizeClaimInfo.savePrizeClaim(
                                {"address": address, "prizeId": prizeId, "chainName": "thunderCore"})
                            return "success"

                    userPrizeInfo.saveUserPrize(
                        {"address": address, "prizeId": prizeId, "chainName": "thunderCore", "number": 1})
                    prizeClaimInfo.savePrizeClaim(
                        {"address": address, "prizeId": prizeId, "chainName": "thunderCore"})
                    return "success"
                return "failed"

            else:
                return "failed"
        except:
            return "failed"


    # get user all prize
    def getUserPrizeList(self, playerAddress):
        playerAddress = playerAddress.lower()

        userPrizeArray = userPrizeInfo.getUserPrizeByAddress(
            {"address": playerAddress})
        return userPrizeArray


    # check user have bonus but not use it only for check
    def isUserHaveBonus(self, playerAddress):
        playerAddress = playerAddress.lower()
        userPrizeList = userPrizeInfo.getUserPrizeByAddress(
            {"address": playerAddress})
        for i in userPrizeList:
            if i["chainName"] == "thunderCore" and int(i["number"]) > 0:
                return True
        return False


    # user using prize coupon
    def userUseBonus(self, playerAddress):
        playerAddress = playerAddress.lower()
        userPrizeList = userPrizeInfo.getUserPrizeByAddress(
            {"address": playerAddress})
        for i in userPrizeList:
            if i["chainName"] == "thunderCore" and int(i["number"]) > 0:
                myquery = {"_id": ObjectId(i["id"])}
                newValues = {"$set": {"number": int(i["number"]) - 1}}
                userPrizeInfo.updateUserPrize(
                    {"myquery": myquery, "newValues": newValues})
                return True

        return False


    # function let master transfer tt from owner wallet
    def giveTT(self, receipient, amount):
        try:
            receipient = Web3.toChecksumAddress(receipient)
            tx = {
                'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
                'to': receipient,
                'value': self.web3.toWei(amount, 'ether'),
                'gas': 99999999,
                'gasPrice': self.web3.toWei('50', 'gwei'),
                'chainId': int(self.chainID)
            }
            blockchain.sendTransaction(self.web3, tx)
            return "success"
        except:
            return "failed"


    def changeGasFee(self):
        threeStarWithdraw = self.threeStarContract.functions.changeGasFee(250).buildTransaction({
            'from': self.owner['address'],
            'gasPrice': self.web3.toWei('50', 'gwei'),
            'nonce': self.web3.eth.get_transaction_count(self.owner['address']),
        })
        blockchain.sendTransaction(self.web3, threeStarWithdraw)

        return "success"
