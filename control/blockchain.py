from web3 import Web3
from web3.middleware import geth_poa_middleware
import os
from dotenv import load_dotenv
import json

load_dotenv()


def getOwner():
    owner = {
        'privateKey': os.getenv("walletPrivateKey"),
        'address': os.getenv("walletAddress")
    }
    return owner


owner = getOwner()


def thunderCore():
    web3 = Web3(Web3.HTTPProvider(os.getenv("httpProvider"), request_kwargs={'timeout': 60}))
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    chainID = os.getenv("REACT_APP_ThunderCore")
    return web3, chainID


def bsc():
    web3 = Web3(Web3.HTTPProvider(os.getenv("httpProvider_bsc"), request_kwargs={'timeout': 60}))
    web3.middleware_onion.inject(geth_poa_middleware, layer=0)
    chainID = os.getenv("REACT_APP_BSC")
    return web3, chainID


def getThreeStarContract(web3):
    threeStarABIJson = open('./static/abi/threeStarABI.json')
    threeStarABI = json.load(threeStarABIJson)['abi']

    threeStarContractAddress = os.getenv("REACT_APP_ThreeStarContractAddress")
    threeStarContract = web3.eth.contract(address=threeStarContractAddress, abi=threeStarABI)

    return threeStarContractAddress, threeStarContract


def getThreeStarContract_bsc(web3):
    threeStarABIJson = open('./static/abi/threeStarABI.json')
    threeStarABI = json.load(threeStarABIJson)['abi']

    threeStarContractAddress = os.getenv("REACT_APP_ThreeStarContractAddress_bsc")
    threeStarContract = web3.eth.contract(address=threeStarContractAddress, abi=threeStarABI)

    return threeStarContractAddress, threeStarContract


def getStakeContract(web3):
    stakeABIJson = open('./static/abi/stakingReward.json')
    stakeABI = json.load(stakeABIJson)['abi']
    stakeContractAddress = os.getenv("REACT_APP_StakeContractAddress")
    stakeContract = web3.eth.contract(address=stakeContractAddress, abi=stakeABI)

    return stakeContractAddress, stakeContract


def getStakeContract_bsc(web3):
    stakeABIJson = open('./static/abi/stakingReward.json')
    stakeABI = json.load(stakeABIJson)['abi']
    stakeContractAddress = os.getenv("REACT_APP_StakeContractAddress_bsc")
    stakeContract = web3.eth.contract(address=stakeContractAddress, abi=stakeABI)

    return stakeContractAddress, stakeContract


def getTSToken(web3):
    TSABIJson = open('./static/abi/threeStarTokenABI.json')
    TSABI = json.load(TSABIJson)['abi']
    TSContractAddress = os.getenv("REACT_APP_3StarTokenContractAddress")
    TSContract = web3.eth.contract(address=TSContractAddress, abi=TSABI)

    return TSContractAddress, TSContract


def getTSToken_bsc(web3):
    TSABIJson = open('./static/abi/threeStarTokenABI.json')
    TSABI = json.load(TSABIJson)['abi']
    TSContractAddress = os.getenv("REACT_APP_3StarTokenContractAddress_bsc")
    TSContract = web3.eth.contract(address=TSContractAddress, abi=TSABI)

    return TSContractAddress, TSContract


def sendTransaction(web3, transaction):
    try:
        txCreate = web3.eth.account.sign_transaction(transaction, owner['privateKey'])

        txHash = web3.eth.send_raw_transaction(txCreate.rawTransaction)
        txReceipt = web3.eth.wait_for_transaction_receipt(txHash)
        print(txReceipt)
        return "success"

    except Exception:
        return "failed"

def getOwnerRemain(web3, contractAddress):
    ownerRemain = web3.fromWei(web3.eth.get_balance(contractAddress), 'ether')
    return ownerRemain

def getPlayerAmount(web3, contract, playerAddress):
    playerAmount = web3.fromWei(contract.functions.playerInfo(playerAddress).call, 'ether')
    return playerAmount


def getAPR(web3, dividends, stakeContract):
    try:
        totalSupply = web3.fromWei(stakeContract.functions.totalSupply().call(), 'ether')
        return str(round(dividends * 365 / totalSupply, 2)) + '%'
    except:
        return '0%'

def verifyHashInfo(web3, hash, contractAddress):
    try:
        hashInfo = web3.eth.get_transaction(hash)
        try:
            hashInfo["to"] == contractAddress
            return True
        except:
            return False
    except:
        return False

def getTotalStake(web3, TSTokenContract, stakeContractAddress):
    try:
        totalStake = web3.fromWei(TSTokenContract.functions.balanceOf(stakeContractAddress).call(), 'ether')
        return totalStake
    except:
        return "failed"
