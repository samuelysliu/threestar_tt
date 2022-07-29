from web3 import Web3
from web3.middleware import geth_poa_middleware
import json
import random
import os
from dotenv import load_dotenv

load_dotenv()

web3 = Web3(Web3.HTTPProvider(os.getenv("httpProvider_test"), request_kwargs={'timeout': 60}))
web3.middleware_onion.inject(geth_poa_middleware, layer=0)

threeStarABIJson = open('./static/abi/threeStarABI.json')
threeStarABI = json.load(threeStarABIJson)['abi']

threeStarContractAddress = os.getenv("threeStarContractAddress_test")
threeStarContract = web3.eth.contract(address=threeStarContractAddress, abi=threeStarABI)

stakeABIJson = open('./static/abi/stakingReward.json')
stakeABI = json.load(stakeABIJson)['abi']
stakeContractAddress = os.getenv("stakeContractAddress_test")
stakeContract = web3.eth.contract(address=stakeContractAddress, abi=stakeABI)

TSABIJson = open('./static/abi/threeStarTokenABI.json')
TSABI = json.load(TSABIJson)['abi']
TSContractAddress = '0xc5929cBd676C2a8445eA75585C3eA3FfffCD0958'
TSContract = web3.eth.contract(address = TSContractAddress, abi=TSABI)

owner = {
    'privateKey': os.getenv("walletPrivateKey"),
    'address': os.getenv("walletAddress")
}


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

    result = sendTransaction(contractSendPrize)
    return result


def setReward(privateKey, todayEarn):
    if privateKey == os.getenv("privateKey"):
        tx = {
            'nonce': web3.eth.get_transaction_count(owner['address']),
            'to': stakeContractAddress,
            'value': web3.toWei(todayEarn, 'ether'),
            'gas': 1041586,
            'gasPrice': web3.toWei('50', 'gwei'),
            'chainId': 18
        }

        try:
            signed_tx = web3.eth.account.signTransaction(tx, owner['privateKey'])
            tx_hash = web3.eth.send_raw_transaction(signed_tx.rawTransaction)

            setTodayReward = stakeContract.functions.setReward(web3.toWei(todayEarn, 'ether')).buildTransaction(
                {
                    'from': owner['address'],
                    'gas': 1041586,
                    'nonce': web3.eth.get_transaction_count(owner['address']),
                }
            )
            result = sendTransaction(setTodayReward)
            return result

        except Exception:
            return "insufficient balance"

    else:
        return "authorized error"


def sendTransaction(transaction):
    try:
        txCreate = web3.eth.account.sign_transaction(transaction, owner['privateKey'])

        txHash = web3.eth.send_raw_transaction(txCreate.rawTransaction)
        txReceipt = web3.eth.wait_for_transaction_receipt(txHash)
        print(txReceipt)
        return "success"

    except Exception:
        print(Exception)
        return "failed"


def getOwnerRemain():
    ownerRemain = web3.fromWei(threeStarContract.functions.ownerRemain().call(), 'ether')
    return ownerRemain

def getDividend(ownerRemain):
    return round(ownerRemain * 20 / 100, 5)

def getAPR(dividends):
    totalSupply = web3.fromWei(stakeContract.functions.totalSupply().call(), 'ether')

    return str(round(dividends*365/totalSupply, 2)) + '%'


def test():
    #userStake = TSContract.functions.allowance('0xbB931B676919cDC9Fb6727609e70d94C3fdA7A42', stakeContractAddress).call()
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