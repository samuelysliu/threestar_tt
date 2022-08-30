from control import blockchain
from web3 import Web3

owner = blockchain.getOwner()
web3, chainId = blockchain.thunderCore()

TSContractAddress, TSContract = blockchain.getTSToken(web3)

stakeContractAddress, stakeContract = blockchain.getStakeContract(web3)

"""
tokenHolder = ["0x0edb293b029e0cfa2c598d49bc878e3fb34dcff5", "0x68d6d0ecfe2204893042b30c48f086a72fc443a6",
               "0xcbced0f022d4eb6b461643599c38c51564fdb365", "0xf4fc0303e1d72e06955e7687d508125055f47ef9",
               "0xf0f35015fd4879ef73dfc1abbb29226afbf53186", "0xe59982d1a6f3230d10ead56d363650e490e09018",
               "0xf66b44c71112e3978390db94e9f29e5bc9d49bf0", "0x5b7d3e158cacfd6d0ed12ac1a5d19bb6914cd19d",
               "0xa342746a7c428595cd0887aa75183422743734f9", "0x39a3a9d33085c4fd3f57318429651b167dd1d6af",
               "0xca87c69f08f9f5e94c504b289e8b7c9f0dc9d3b4", "0x31bb67ba0f615bb80b30ebc4789114666514f9a5",
               "0xf7a29495ffef83cf4d3c92c5d71c79a7c1acd998", "0x50516e06efbc9c1c11e834f25b6472bbc33531a1",
               "0x4591c15bb3cd2d1ae87533eb51f2ea81d4c23ca9", "0x57104ffe20c33dcd5cd8753565dfe0ce42f8b27a",
               "0x0700beef0aea0cc4d2164795a5acbec50f28a02a", "0xd59b3604863bb6fb49e77a31ad0fa89d1e5403b8",
               "0xa23ac405a23b4a8f125c12627d912d6bc6b5f571", "0x0eeee3c21e12c6a6efa1c919fc7d4f0c21589887",
               "0xd32562ad76206a066f9e491c127bb88d8b08fdee", "0x00d64f48dd7f9adbd2cc752d3b1e76594ed00156",
               "0x3e11ecdf8d3cd396d77ccdba672ee8284d22a8c4", "0x7fc5ee18dfd5b28562d2187eee1a9cb3d254dc2c",
               "0xb69a92df2f8c9a5ed4a700f7caabf55d6d289279", "0xc649afb10a8dba3b6b3e9b58164705d5b731d538",
               "0x6a0c6db6950ffa35283a1f17cb191bbd83df84c4", "0x18a9ece2c8ecb6cb9831e9a302570f3768a139a6",
               "0x81966bde9dcfd18802ac106845edcb0fa01e5dfa", "0x728ba0581d12858d4b55d9297fa799ebbd0b9259",
               "0x3e0af59b04be58afe182f9accfcc567ff5810573", "0x5a9d0c9db08bd5adcb0be7da5b56eb80fc6d4cf9"]

amount = {"0x0edb293b029e0cfa2c598d49bc878e3fb34dcff5": 75.2, "0x68d6d0ecfe2204893042b30c48f086a72fc443a6": 67.065,
          "0xcbced0f022d4eb6b461643599c38c51564fdb365": 32, "0xf4fc0303e1d72e06955e7687d508125055f47ef9": 19,
          "0xf0f35015fd4879ef73dfc1abbb29226afbf53186": 16, "0xe59982d1a6f3230d10ead56d363650e490e09018": 7.605,
          "0xf66b44c71112e3978390db94e9f29e5bc9d49bf0": 5.447, "0x5b7d3e158cacfd6d0ed12ac1a5d19bb6914cd19d": 5.037,
          "0xa342746a7c428595cd0887aa75183422743734f9": 5, "0x39a3a9d33085c4fd3f57318429651b167dd1d6af": 4,
          "0xca87c69f08f9f5e94c504b289e8b7c9f0dc9d3b4": 1.76, "0x31bb67ba0f615bb80b30ebc4789114666514f9a5": 1.2,
          "0xf7a29495ffef83cf4d3c92c5d71c79a7c1acd998": 1.12, "0x50516e06efbc9c1c11e834f25b6472bbc33531a1": 1,
          "0x4591c15bb3cd2d1ae87533eb51f2ea81d4c23ca9": 0.925, "0x57104ffe20c33dcd5cd8753565dfe0ce42f8b27a": 0.8,
          "0x0700beef0aea0cc4d2164795a5acbec50f28a02a": 0.8, "0xd59b3604863bb6fb49e77a31ad0fa89d1e5403b8": 0.8,
          "0xa23ac405a23b4a8f125c12627d912d6bc6b5f571": 0.709, "0x0eeee3c21e12c6a6efa1c919fc7d4f0c21589887": 0.643,
          "0xd32562ad76206a066f9e491c127bb88d8b08fdee": 0.377, "0x00d64f48dd7f9adbd2cc752d3b1e76594ed00156": 0.32,
          "0x3e11ecdf8d3cd396d77ccdba672ee8284d22a8c4": 0.308, "0x7fc5ee18dfd5b28562d2187eee1a9cb3d254dc2c": 0.16,
          "0xb69a92df2f8c9a5ed4a700f7caabf55d6d289279": 0.16, "0xc649afb10a8dba3b6b3e9b58164705d5b731d538": 0.08,
          "0x6a0c6db6950ffa35283a1f17cb191bbd83df84c4": 0.08, "0x18a9ece2c8ecb6cb9831e9a302570f3768a139a6": 0.015,
          "0x81966bde9dcfd18802ac106845edcb0fa01e5dfa": 0.011, "0x728ba0581d12858d4b55d9297fa799ebbd0b9259": 0.006,
          "0x3e0af59b04be58afe182f9accfcc567ff5810573": 0.004, "0x5a9d0c9db08bd5adcb0be7da5b56eb80fc6d4cf9": 0.001}
"""

stakeHolder = [
               "0x5a9d0C9DB08bd5ADCB0BE7dA5b56eB80Fc6d4Cf9",
               "0xEA4D5140afF991C35ae2df3EEBB59fd49D8814e9",
               "0xF63984ee251E83Ef81c459E7Ba658716B856bC12",
               "0x3E11EcdF8D3CD396d77ccDBa672eE8284d22a8C4",
               "0xcCEE7c9F68dDB01e26Cf9994D27E887D09e1f99E",
               "0x1e873fD8716e87e483e04694cb2b7a3e4F563B06",
               "0xA2A0c1c41dB2e8c44b2B723dF17AE20f4dE4210B",
               "0x4406152F5f965A642A1feE67BC4A8ba32FeBE3f2"
               ]

stakeAmount = {"0xA234b060a5b6A75eF751d14D1eFDD350C293A92f": 18.72,
               "0x0Dd725ffB87A02c2C70693a5a3583194DABe6d6E": 5,
               "0xdbE2C9EFf4c14fDeF3Fea3104E7090daEaA5C30a": 71.8744,
               "0x8c5c6a9FF89646Eb112Ea4bDc785b28102f32ee0": 0.32,
               "0xF41E849f7A459E02a5Fd9E7Dfd0a1009231DD206": 48.56,
               "0x4a32978B7b989C5DC79199e83d3c8Ad1cAdC73BF": 0.64,
               "0x056B2EcF3385f16bC8D9878181aE7f341fF5CD61": 25,
               "0xFB96DC682E8139C746307Cc3bB52af5f1f921A40": 1.72113,
               "0xA342746A7C428595Cd0887aA75183422743734F9": 91.63848,
               "0x354c359862FAcaCCC72bAc728Eead83e50fb4679": 36.69747,
               "0x4972B3d31F02C4331a24200dff6Ac0BB85a8189b": 4.000004659182775768,
               "0x198F346148EE868212060c4797772F671E240eC2": 71.76,
               "0xaA8A03e4E7415545DbB9Bb7672683E6abd502d3B": 55.14671,
               "0x6A0c6Db6950ffa35283a1F17cb191BBD83Df84c4": 2.64,
               "0x3E0aF59B04BE58Afe182F9aCcfcc567fF5810573": 31.642,
               "0x5bE204d70E035c4854792a8a9b0290Cd2FbCD4f0": 107,
               "0xfCF63e2DCC494A36FFd75064CE1023b35c040C86": 4.1854,
               "0x75fc6D828a70b8A18F605561B3635d8E41a3C935": 20.73624,
               "0x204Fb06c1271F013464B54bc0636C975Ea8471Bf": 4.90332,
               "0x0eeEe3C21E12c6a6EFa1c919FC7d4f0C21589887": 252.879,
               "0x7Fc5EE18Dfd5b28562D2187eee1A9cB3D254dC2C": 0.4,
               "0x728BA0581d12858D4B55D9297fa799eBBd0B9259": 0.00008,
               "0x5b7d3E158cACFd6D0ED12aC1A5d19bb6914cd19d": 35.22546,
               "0x871D0bD31703A8bdd88305e055CC89da33bbdd54": 0.48,
               "0x4F325adD9b809A1193f0a9de91A1aeda821C23e8": 2.16,
               "0xcA87C69F08F9f5e94C504b289e8b7c9F0Dc9d3b4": 16.96,
               "0x8A835CF4D8f7EF8536d1b67eca60F44A5029706D": 1,
               "0x40d62c93bbc80D197530f99d306226FC7427e2c3": 21.68922,
               "0xEa42CF61Ffb5A9Cb31420cFe5daE685d25a8B110": 10,
               "0x32cFe74281B95bb88cB19FEc9577F886884B6488": 0.2,
               "0x0e8c40818d2de73409c4BFBeA51301a02cC3aCb5": 1.22,
               "0x179b4127967db0d6bd2b1C13D547F7f2c2cea3A9": 50.00663,
               "0x4591c15bB3Cd2d1Ae87533EB51f2ea81D4C23ca9": 10.70182,
               "0xB42dC5768278E7deFd782EC7D179a89D8b84D2B7": 5.23844,
               "0x00d64f48DD7f9aDBd2cc752D3B1e76594Ed00156": 20.79592,
               "0x6aDcfCD107A85993aFb9e448ef7e78489C830C0d": 17,
               "0x68d6D0ECFe2204893042B30c48f086A72fC443a6": 47.80031,
               "0xC02A9934Ca3b5ae46F87aA0728c304F86D4A3022": 3.34492,
               "0x18a9ECE2C8ECB6cB9831e9a302570F3768A139A6": 7,
               "0xA5Ce311569EBD168Ff1bFCC02DA64f1730C6BD87": 0.007,
               "0x5a9d0C9DB08bd5ADCB0BE7dA5b56eB80Fc6d4Cf9": 6.748,
               "0xEA4D5140afF991C35ae2df3EEBB59fd49D8814e9": 4.19522,
               "0xF63984ee251E83Ef81c459E7Ba658716B856bC12": 6.88,
               "0x3E11EcdF8D3CD396d77ccDBa672eE8284d22a8C4": 24.08,
               "0xcCEE7c9F68dDB01e26Cf9994D27E887D09e1f99E": 0.16,
               "0x1e873fD8716e87e483e04694cb2b7a3e4F563B06": 4.16,
               "0xA2A0c1c41dB2e8c44b2B723dF17AE20f4dE4210B": 2,
               "0x4406152F5f965A642A1feE67BC4A8ba32FeBE3f2": 85
               }

"""
for i in range(100):
    staker = stakeContract.functions.stakerAddress(i).call()
    print('"' + staker + '",')


for i in stakeHolder:
    i = Web3.toChecksumAddress(i)
    userStake = web3.fromWei(stakeContract.functions.balanceOf(i).call(), 'ether')
    print('"' + i + '"' + ': ' + str(userStake) + ',')
"""

for i in stakeHolder:
    receipient = Web3.toChecksumAddress(i)
    transferTSToken = TSContract.functions.transfer(receipient, web3.toWei(stakeAmount[i], "ether")).buildTransaction({
        'from': owner['address'],
        'gasPrice': web3.toWei('50', 'gwei'),
        'nonce': web3.eth.get_transaction_count(owner['address']),
    })

    blockchain.sendTransaction(web3, transferTSToken)

