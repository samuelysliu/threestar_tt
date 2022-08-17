export class PathController {
    constructor(chainId) {
        if (String(chainId) === process.env.REACT_APP_BSC) {
            this.apiPath = process.env.REACT_APP_APIPATH + "bsc"
            this.threeStarContractAddress = process.env.REACT_APP_BSC_THREESTARCONTRACTADDRESS
            this.TSTokenContractAddress = process.env.REACT_APP_BSC_TSTOKENCONTRACTADDRESS
            this.stakeContractAddress = process.env.REACT_APP_BSC_STAKECONTRACTADDRESS
            this.title = "BSC 3Star"
        } else {
            this.apiPath = process.env.REACT_APP_APIPATH + "api"
            this.threeStarContractAddress = process.env.REACT_APP_THREESTARCONTRACTADDRESS
            this.TSTokenContractAddress = process.env.REACT_APP_TSTOKENCONTRACTADDRESS
            this.stakeContractAddress = process.env.REACT_APP_STAKECONTRACTADDRESS
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