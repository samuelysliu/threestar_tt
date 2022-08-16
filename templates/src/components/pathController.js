export class PathController{
    constructor(){
        //this.apiPath = 'http://127.0.0.1:5000/api' //localhost
        this.apiPath = 'https://threestar-dapp-test.herokuapp.com/api' //test-net
        //this.apiPath = 'https://www.threestar.fun/api' //mainnet
        this.threeStarContractAddress = '0xb6d957BcD29EEF5c75BA4AEf936CBC3eC5D88ADb'
        this.TSTokenContractAddress = '0xF0F35015Fd4879Ef73Dfc1abbB29226AfBF53186'
        //this.stakeContractAddress = '0x5B2AFc9c6b9eef8300B916aC539bED5946B6b29B'
        this.stakeContractAddress = '0x9f3e0C348A08d37E1d4363dd08E6953405F85d4C' //testnet
    }

    getApiPath(){
        return this.apiPath
    }

    getThreeStarContractAddress(){
        return this.threeStarContractAddress
    }

    getTSTokenContractAddress(){
        return this.TSTokenContractAddress
    }

    getStakeContractAddress(){
        return this.stakeContractAddress
    }

    getChainId(){
        return this.chainId
    }
}