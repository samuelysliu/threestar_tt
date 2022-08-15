export class PathController{
    constructor(){
        //this.apiPath = 'http://127.0.0.1:5000/api' localhost
        //this.apiPath = 'https://threestar-dapp-test.herokuapp.com/api' //test-net
        this.apiPath = 'https://threestar-dapp.herokuapp.com/api' //mainnet
        this.threeStarContractAddress = '0xb6d957BcD29EEF5c75BA4AEf936CBC3eC5D88ADb'
        this.TSTokenContractAddress = '0xF0F35015Fd4879Ef73Dfc1abbB29226AfBF53186'
        this.stakeContractAddress = '0xa931A981edfCd9cA80A0Be1653CE3b1C4ceb757e'
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