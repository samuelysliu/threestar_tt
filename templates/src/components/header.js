import { Container, Nav, Navbar, Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import { ConnectWallet } from './connectWallet';
import Web3 from 'web3'


function Header({ sendUserInfo }) {
    const metaConnect = new ConnectWallet()
    const web3 = new Web3(window.ethereum)

    const [userInfo, setUserInfo] = useState({ account: '', balance: '' });

    const [loading, setLoading] = useState(true)

    const init = () => {
        metaConnect.thunderCoreTest().then(value => {
            try {
                if (value.account) {
                    setLoading(false)
                    setUserInfo(value);
                }
            } catch (e) {
                console.log(e)
            }

        }).catch(error => {
            console.log(error)
        })

        window.ethereum.on('accountsChanged', async (accounts) => {
            if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
                setUserInfo ({ account: accounts[0], balance: this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether') })
            }
        });

        //Update data when user switch the network
        window.ethereum.on('chainChanged', async (chainId) => {
            let network = parseInt(chainId, 16)
            if (network === 18) {
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                let balance = this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether')
                setUserInfo ({ account: accounts[0], balance: balance })
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
        });
    }

    useEffect(() => {
        init();
    }, []);

    useEffect(() => {
        sendUserInfo(userInfo)
    }, [userInfo])

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Container>
                <Navbar.Brand href="/">Three star TT</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/dividend">Dividends</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link>{userInfo.account}</Nav.Link>
                        {loading ? <Spinner animation="border" variant="light" />
                            : <Nav.Link eventKey={2}>
                                {userInfo.balance}
                            </Nav.Link>}

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;