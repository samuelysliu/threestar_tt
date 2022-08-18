export class PathController {
    constructor(chainId) {
        if (String(chainId) === process.env.REACT_APP_BSC) {
            this.apiPath = process.env.REACT_APP_APIPATH + "bsc"
            this.threeStarContractAddress = process.env.REACT_APP_ThreeStarContractAddress_bsc
            this.TSTokenContractAddress = process.env.REACT_APP_3StarTokenContractAddress_bsc
            this.stakeContractAddress = process.env.REACT_APP_StakeContractAddress_bsc
            this.title = "BSC 3Star"
        } else {
            this.apiPath = process.env.REACT_APP_APIPATH + "api"
            this.threeStarContractAddress = process.env.REACT_APP_ThreeStarContractAddress
            this.TSTokenContractAddress = process.env.REACT_APP_3StarTokenContractAddress
            this.stakeContractAddress = process.env.REACT_APP_StakeContractAddress
            this.title = "TT 3Star"
        }
    }

    getApiPath() {
        return this.apiPath
    }

    getThreeStarContractAddress() {
        return this.threeStarContractAddress
    }

    getTSTokenContractAddress() {
        return this.TSTokenContractAddress
    }

    getStakeContractAddress() {
        return this.stakeContractAddress
    }

    getChainId() {
        return this.chainId
    }

    getTitle(){
        return this.title
    }
}