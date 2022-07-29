import { Container, Nav, Navbar, Spinner } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import Web3 from 'web3'


function Header({ sendUserInfo }) {
    const [userInfo, setUserInfo] = useState({ account: '', balance: '' });

    const [loading, setLoading] = useState(true)
    const web3 = new Web3(window.ethereum)

    const init = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.log('Please install MetaMask!');
        } else {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await web3.eth.getChainId();
            if (chainId === 18 || chainId === 108) {
                setUserInfo({ account: accounts[0], balance: web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') })
                setLoading(false)
            }

            window.ethereum.on('accountsChanged', async (accounts) => {
                setLoading(true)
                if (typeof accounts[0] !== 'undefined' && accounts[0] !== null) {
                    setUserInfo({ account: accounts[0], balance: web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') })
                }
            });

            //Update data when user switch the network
            window.ethereum.on('chainChanged', async (chainId) => {
                setLoading(true)
                let network = parseInt(chainId, 16)
                if (network === 18 || network === 108) {
                    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                    let balance = web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether')
                    setUserInfo(preValue => ({ ...preValue, balance:  balance}))
                    setLoading(false);
                }
            });
        }

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