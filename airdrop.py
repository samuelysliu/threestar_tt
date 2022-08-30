from control import blockchain
from web3 import Web3

owner = blockchain.getOwner()
web3, chainId = blockchain.thunderCore()

TSContractAddress, TSContract = blockchain.getTSToken(web3)

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
          "0xb69a92df2f8c9a5ed4a700f7caabf55d6d289279": 0.16, "	0xc649afb10a8dba3b6b3e9b58164705d5b731d538": 0.08,
          "0x6a0c6db6950ffa35283a1f17cb191bbd83df84c4": 0.08, "0x18a9ece2c8ecb6cb9831e9a302570f3768a139a6": 0.015,
          "0x81966bde9dcfd18802ac106845edcb0fa01e5dfa": 0.011, "	0x728ba0581d12858d4b55d9297fa799ebbd0b9259": 0.006,
          "0x3e0af59b04be58afe182f9accfcc567ff5810573": 0.004, "0x5a9d0c9db08bd5adcb0be7da5b56eb80fc6d4cf9": 0.001}

receipient = Web3.toChecksumAddress(receipient)
transferTSToken = TSContract.functions.transfer(receipient,
                                                web3.toWei(, "ether")).buildTransaction({
    'from': owner['address'],
    'gasPrice': web3.toWei('50', 'gwei'),
    'nonce': web3.eth.get_transaction_count(owner['address']),
})

blockchain.sendTransaction(web3, transferTSToken)
