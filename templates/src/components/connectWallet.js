import Web3 from 'web3'

export class ConnectWallet {
    constructor() {
        this.web3 = new Web3(window.ethereum)
    }

    async thunderCore() {
        if (process.env.REACT_APP_NETWORK === "Main") {
            if (typeof window.ethereum === 'undefined') {
                console.log('Please install MetaMask!');
            } else {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const chainId = await this.web3.eth.getChainId();
                if (String(chainId) === process.env.REACT_APP_ThunderCore || String(chainId) === process.env.REACT_APP_BSC) {
                    return { account: accounts[0], balance: this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether') }
                } else {
                    this.changeChain("ThunderCore")
                }
            }
        } else if (process.env.REACT_APP_NETWORK === "Test") {
            if (typeof window.ethereum === 'undefined') {
                console.log('Please install MetaMask!');
            } else {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const chainId = await this.web3.eth.getChainId();
                if (chainId === 18 || chainId === 97) {
                    return { account: accounts[0], balance: this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether') }
                } else {
                    try {
                        await this.web3.currentProvider.request({
                            method: "wallet_switchEthereumChain",
                            params: [{ chainId: "0x12" }],
                        });
                    } catch (error) {
                        if (error.code === 4902) {
                            try {
                                await this.web3.currentProvider.request({
                                    method: "wallet_addEthereumChain",
                                    params: [
                                        {
                                            chainId: "0x12",
                                            chainName: "ThunderCore Testnet",
                                            rpcUrls: ["https://testnet-rpc.thundercore.com"],
                                            nativeCurrency: {
                                                name: "TST token",
                                                symbol: "TST",
                                                decimals: 18,
                                            },
                                            blockExplorerUrls: ["https://explorer-testnet.thundercore.com/"],
                                        },
                                    ],
                                });
                            } catch (error) {
                                alert(error.message);
                            }
                        }

                    }
                }
            }
        }
    }

    async getChainId() {
        if (typeof window.ethereum === 'undefined') {
            console.log('Please install MetaMask!');
            return 0
        } else {
            const chainId = await this.web3.eth.getChainId();
            return chainId
        }
    }

    async changeChain(chainName) {
        if (chainName === "ThunderCore") {
            if (process.env.REACT_APP_ThunderCore === "108") {
                try {
                    await this.web3.currentProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x6c" }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await this.web3.currentProvider.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x6c",
                                        chainName: "ThunderCore",
                                        rpcUrls: ["https://mainnet-rpc.thundercore.com"],
                                        nativeCurrency: {
                                            name: "TT token",
                                            symbol: "TT",
                                            decimals: 18,
                                        },
                                        blockExplorerUrls: ["https://viewblock.io/thundercore"],
                                    },
                                ],
                            });
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                }
            } else if (process.env.REACT_APP_ThunderCore === "18") {
                try {
                    await this.web3.currentProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x12" }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await this.web3.currentProvider.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x6c",
                                        chainName: "ThunderCore Testnet",
                                        rpcUrls: ["https://testnet-rpc.thundercore.com"],
                                        nativeCurrency: {
                                            name: "TST token",
                                            symbol: "TST",
                                            decimals: 18,
                                        },
                                        blockExplorerUrls: ["https://explorer-testnet.thundercore.com/"],
                                    },
                                ],
                            });
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                }
            }
        } else if (chainName === "BSC") {
            if (process.env.REACT_APP_BSC === "56") {
                try {
                    await this.web3.currentProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x38" }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await this.web3.currentProvider.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x38",
                                        chainName: "Smart Chain",
                                        rpcUrls: ["https://bsc-dataseed.binance.org/"],
                                        nativeCurrency: {
                                            name: "BNB token",
                                            symbol: "BNB",
                                            decimals: 18,
                                        },
                                        blockExplorerUrls: ["https://bscscan.com"],
                                    },
                                ],
                            });
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                }
            } else if (process.env.REACT_APP_BSC === "97") {
                try {
                    await this.web3.currentProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x61" }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await this.web3.currentProvider.request({
                                method: "wallet_addEthereumChain",
                                params: [
                                    {
                                        chainId: "0x61",
                                        chainName: "Smart Chain-Testnet",
                                        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
                                        nativeCurrency: {
                                            name: "BNB token",
                                            symbol: "BNB",
                                            decimals: 18,
                                        },
                                        blockExplorerUrls: ["https://testnet.bscscan.com"],
                                    },
                                ],
                            });
                        } catch (error) {
                            alert(error.message);
                        }
                    }
                }
            }
        }
    }

}