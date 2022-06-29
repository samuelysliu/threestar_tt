from web3 import Web3
import json
import random
import os
from dotenv import load_dotenv

load_dotenv()

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
    web3 = Web3(Web3.HTTPProvider(os.getenv("httpProvider"), request_kwargs={'timeout': 60}))

    abiJson = open('./static/abi/threeStarABI.json')
    abi = json.load(abiJson)['abi']

    contractAddress = os.getenv("contractAddress")
    contract = web3.eth.contract(address=contractAddress, abi=abi)

    owner = {
        'privateKey': os.getenv("walletPrivateKey"),
        'address': os.getenv("walletAddress")
    }

    contractSendPrize = contract.functions.sendPrize(winner, point).buildTransaction(
        {
            'from': owner['address'],
            'gas': 1041586,
            'nonce': web3.eth.get_transaction_count(owner['address']),
        }
    )

    try:
        txCreate = web3.eth.account.sign_transaction(contractSendPrize, owner['privateKey'])

        txHash = web3.eth.send_raw_transaction(txCreate.rawTransaction)
        txReceipt = web3.eth.wait_for_transaction_receipt(txHash)
        return "success"
        # print(f'Tx successful with hash: {txReceipt.transactionHash.hex()}')

    except Exception:
        return Exception

