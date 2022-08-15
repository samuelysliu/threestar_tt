import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import axios from 'axios';
import ThreeStarToken from '../images/threeStarToken.png';
import Header from '../components/header';
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import StakingRewardABI from '../abi/stakingRewardABI.json';
import { PathController } from '../components/pathController';
import { ConnectWallet } from '../components/connectWallet';

function Dividend() {
    const pathController = new PathController()
    const metaConnect = new ConnectWallet()
    const web3 = new Web3(window.ethereum);

    const apiPath = pathController.getApiPath();
    const TSTokenContractABI = ThreeStarTokenABI.abi;
    const stakeContractABI = StakingRewardABI.abi;
    const TSTokenContractAddress = pathController.getTSTokenContractAddress();
    const stakeContractAddress = pathController.getStakeContractAddress();

    const [userInfo, setUserInfo] = useState({ 'account': '', 'balance': '' })

    const [TSTokencontract, setTSTokenContract] = useState();
    const [stakeContract, setStakeContract] = useState();

    const [stakeMax, setStakeMax] = useState(0);
    const [unstakeMax, setUnstakeMax] = useState(0);

    const [stakeAmount, setStakeAmount] = useState(0);
    const [unstakeAmount, setUnstakeAmount] = useState(0);

    const [dividends, setDividends] = useState(0);
    const [APR, setAPR] = useState(0);
    const [payout, setPayout] = useState(0);

    const [disableDividends, setDisableDividends] = useState(true);

    let totalAllowance = '100000000000000000000000000';
    const [unlockBool, setUnlockBool] = useState(true);

    const [isStaking, setIsStaking] = useState(false)


    const getUserInfo = (_userInfo) => {
        setUserInfo(_userInfo)
    }

    const connectWallet = () => {
        metaConnect.thunderCoreTest().then(value => {
            try {
                if (value.account) {
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
                setUserInfo({ account: accounts[0], balance: this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether') })
            }
        });

        //Update data when user switch the network
        window.ethereum.on('chainChanged', async (chainId) => {
            let network = parseInt(chainId, 16)
            if (network === 18) {
                let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                let balance = this.web3.utils.fromWei(await this.web3.eth.getBalance(accounts[0]), 'ether')
                setUserInfo({ account: accounts[0], balance: balance })
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

    const loadWeb3 = () => {
        setTSTokenContract(new web3.eth.Contract(TSTokenContractABI, TSTokenContractAddress));
        setStakeContract(new web3.eth.Contract(stakeContractABI, stakeContractAddress));
    }

    const checkContractInfo = () => {
        TSTokencontract.methods.allowance(userInfo.account, stakeContractAddress).call().then(function (receipt) {
            if (receipt >= Number(totalAllowance)) {
                setUnlockBool(false);
                TSTokencontract.methods.balanceOf(userInfo.account).call().then(function (receipt) {
                    setStakeMax(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5));
                }).catch(error => {
                    console.log(error);
                })

                stakeContract.methods.balanceOf(userInfo.account).call().then(function (receipt) {
                    setUnstakeMax(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5));
                }).catch(error => {
                    console.log(error);
                })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const checkClaimBool = () =>{
        stakeContract.methods.rewards(userInfo.account).call().then(function(receipt) {
            if(receipt > 0){
                setDisableDividends(false)
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const unlock = () => {
        TSTokencontract.methods.approve(stakeContractAddress, totalAllowance).send({ from: userInfo.account }).then(function (receipt) {
            checkContractInfo();
        }).catch(error => {
            console.log(error)
        })
    }

    const stake = () => {
        setIsStaking(true)
        if (stakeAmount > 0 && stakeAmount <= stakeMax) {
            stakeContract.methods.stake(web3.utils.toWei(stakeAmount, 'ether')).send({ from: userInfo.account }).then(function (receipt) {
                setUnstakeMax((Number(unstakeMax) + Number(stakeAmount)).toFixed(5));
                setStakeMax((Number(stakeMax) - Number(stakeAmount)).toFixed(5));
                setIsStaking(false)
            }).catch(error => {
                console.log(error);
                setIsStaking(false)
            })
        }
    }

    const unstake = () => {
        if (unstakeAmount > 0 && unstakeAmount <= unstakeMax) {
            stakeContract.methods.withdraw(web3.utils.toWei(unstakeAmount, 'ether')).send({ from: userInfo.account, value: web3.utils.toWei('1', 'ether') }).then(function (receipt) {
                setUnstakeMax((Number(unstakeMax) - Number(unstakeAmount)).toFixed(5));
                setStakeMax((Number(stakeMax) + Number(unstakeAmount)).toFixed(5));
            }).catch(error => {
                console.log(error);
            })
        }
    }

    const claimDevidends = () => {
        stakeContract.methods.getReward().send({ from: userInfo.account }).then(function (receipt) {
            console.log(receipt)
        }).catch(error => {
            console.log(error)
        })
    }

    useEffect(() => {
        loadWeb3();
        axios.get(apiPath + "/getDividendInfo").then(res => {
            setDividends(res['data']['dividends'])
            setAPR(res['data']['APR'])
            setPayout(res['data']['payout'])
        }).catch(error => {
            console.log(error)
        });
    }, [])

    useEffect(() => {
        if (userInfo.account.length !== 0) {
            checkContractInfo();
            checkClaimBool();
        }
    }, [userInfo])

    useEffect(() => {
        if (Number(dividends) > 0) {
            setDisableDividends(false)
        }
    }, [dividends])

    const card = {
        border: "1px",
        borderStyle: "solid",
        borderColor: "#669BFD",
        borderRadius: "10px",
        backgroundColor: "white",
        marginTop: "10px"
    }

    const blockOneStyle = {
        border: "1px",
        borderStyle: "solid",
        borderColor: "#669BFD",
        borderLeft: "none",
        borderRight: "none",
        borderTop: "none",
        marginTop: "10px",
        paddingBottom: "10px"
    }

    const blockTwoStyle = {
        marginTop: "10px",
    }

    const blockThreeStyle = {
        border: "1px",
        borderStyle: "solid",
        borderColor: "#669BFD",
        borderRadius: "10px",

        marginTop: "10px",
        paddingTop: "10px",
        marginLeft: "4px",
        marginRight: "4px",
        paddingBottom: "10px"
    }

    const blockFourStyle = {
        marginTop: "10px",
        marginBottom: "50px"
    }

    const blockFiveStyle = {
        marginTop: "10px",
        marginLeft: "10px",
        marginRight: "10px",
    }

    const longButtonStyle = {
        backgroundColor: "#669BFD",
        borderColor: "#669BFD",
        width: "98%",
        borderRadius: "10px"
    }

    return (
        <div style={{ backgroundColor: "#FAF9FA" }}>
            <Header sendUserInfo={getUserInfo} />
            <Container style={{ textAlign: "center", marginTop: "20px", maxWidth:"720px" }}>
                <font style={{ fontSize: "26px" }}><font style={{ color: "#669BFD" }}>3Star </font><font>Dividend</font></font>
                <br></br>
                <font style={{ fontSize: "15px" }}>Stake 3Star to earn TT</font>
                <Container style={card}>
                    <Row style={blockOneStyle}>
                        <Col xs={2} sm={2}><img src={ThreeStarToken} width="50px"></img></Col>
                        <Col xs={4} sm={4} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px" }}>Stake</font>
                            <br></br>
                            <font style={{ fontSize: "17px" }}>3Star</font>
                        </Col>
                        <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                            <font style={{ fontSize: "13px" }}>Coming Dividend</font>
                            <br></br>
                            <font style={{ fontSize: "22px" }}>{dividends} TT</font>
                        </Col>
                    </Row>
                    <Row style={blockTwoStyle}>
                        <Col style={{ fontSize: "15px", textAlign: "left" }}>APR</Col>
                        <Col style={{ fontSize: "15px", textAlign: "right" }}>{APR}</Col>
                    </Row>
                    <Row>
                        <Col style={{ fontSize: "15px", textAlign: "left" }}>Next Payout</Col>
                        <Col style={{ fontSize: "15px", textAlign: "right" }}>{payout}</Col>
                    </Row>

                    {userInfo.account.length === 0
                        ?
                        <Row>
                            <Col><Button style={longButtonStyle} onClick={connectWallet}>Connect Wallet</Button></Col>
                        </Row>
                        : unlockBool
                            ?
                            <Row>
                                <Col><Button style={longButtonStyle} onClick={unlock}>Unlock</Button></Col>
                            </Row>
                            :
                            ""
                    }

                    <Row style={blockThreeStyle}>
                        <Col xs={5} sm={5} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px", color: "#669BFD" }}>Aviailable 3Star</font>
                            <br></br>
                            <font style={{ fontSize: "15px" }}><Form.Control value={stakeAmount} style={{ border: "0px" }} type="number" onChange={(e) => { setStakeAmount(e.target.value) }} /></font>
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                            <font style={{ fontSize: "10px", color: "#669BFD", textDecoration: "underline" }} onClick={() => { setStakeAmount(stakeMax) }}>Max: {stakeMax}</font>
                            <br></br>
                            {isStaking ? <Button style={{ backgroundColor: "#669BFD", borderColor: "#669BFD", width: "70%", lineHeight: "1.1" }} disabled>
                                <Spinner
                                    as="span"
                                    animation="grow"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Loading...
                            </Button>
                                : <Button disabled={stakeAmount > stakeMax} style={{ backgroundColor: "#669BFD", borderColor: "#669BFD", width: "70%", lineHeight: "1.1" }} onClick={stake}>Stake</Button>
                            }


                            <br></br>
                            <font style={{ fontSize: "12px", color: "#FF0000" }}>
                                {stakeAmount > stakeMax ? "Insufficient balance"
                                    : ""}
                            </font>
                        </Col>
                    </Row>
                    <Row style={blockThreeStyle}>
                        <Col xs={5} sm={5} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px", color: "#669BFD" }}>Staked 3Star</font>
                            <br></br>
                            <font style={{ fontSize: "15px" }}><Form.Control value={unstakeAmount} style={{ border: "0px" }} type="number" onChange={(e) => { setUnstakeAmount(e.target.value) }} /></font>
                        </Col>
                        <Col style={{ textAlign: "right", }}>
                            <font style={{ fontSize: "10px", color: "#669BFD", textDecoration: "underline" }} onClick={() => { setUnstakeAmount(unstakeMax) }}>Max: {unstakeMax}</font>
                            <br></br>
                            <Button disabled={unstakeAmount > unstakeMax} variant="outline-primary" style={{ color: "#669BFD", borderColor: "#669BFD", width: "70%", lineHeight: "1.1" }} onClick={unstake}>Unstake</Button>
                            <br></br>
                            <font style={{ fontSize: "12px", color: "#FF0000" }}>
                                {unstakeAmount > unstakeMax ? "Insufficient balance"
                                    : ""}
                            </font>
                        </Col>
                    </Row>
                    <Row style={blockTwoStyle}>
                        <Col><Button disabled={disableDividends} style={longButtonStyle} onClick={claimDevidends}>Claim Dividends</Button></Col>
                    </Row>
                    <Row style={blockFourStyle}>
                        <Col><p style={{ color: "red", fontSize: "12px" }}>*Dividends must be claimed within 1 days</p></Col>
                    </Row>
                </Container>

                <Container style={card}>
                    <Row style={blockOneStyle}>
                        <Col><font style={{ fontSize: "26px" }}>Get <font style={{ color: "#669BFD" }}>3Star</font></font></Col>
                    </Row>
                    <Row style={blockFiveStyle}>
                        <Col><font>You can also get <font style={{ color: "#669BFD" }}>3 Star</font> tokens, by playing the games!</font></Col>
                    </Row>
                    <Row style={blockFourStyle}>
                        <Col><a href='/'><Button style={longButtonStyle}>Go to play</Button></a></Col>
                    </Row>
                </Container>
            </Container>
        </div>
    );
}

export default Dividend;