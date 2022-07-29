import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import axios from 'axios';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import ThreeStarToken from '../images/threeStarToken.png';
import Header from '../components/header';
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import StakingRewardABI from '../abi/stakingRewardABI.json';
import TetherABI from '../abi/tetherABI.json';

function Dividend() {
    const apiPath = 'https://three-star.herokuapp.com';
    let web3 = new Web3(window.ethereum);

    const [userInfo, setUserInfo] = useState({ 'account': '', 'balance': '' })
    
    const [TSTokencontract, setTSTokenContract] = useState();
    const [stakeContract, setStakeContract] = useState();

    const [stakeMax, setStakeMax] = useState(0);
    const [unstakeMax, setUnstakeMax] = useState(0);

    let totalAllowance = '100000000000000000000000000000';
    const [remainAllowance, setRemainAllowance] = useState(0);
    let TSTokenContractABI = ThreeStarTokenABI.abi;
    let TSTokenContractAddress = '0x9838357AD99D0e83D7d449651094A63A6fd16F83';
    let stakeContractABI = StakingRewardABI.abi;
    let stakeContractAddress = '0x768acfb045b9563A62FC1213b4e91cc8Eee1E91E';

    const getUserInfo = (_userInfo) => {
        setUserInfo(_userInfo)
    }

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.log('Please install MetaMask!');
        } else {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const chainId = await web3.eth.getChainId();
            if (chainId === 18 || chainId === 108) {
                setUserInfo({ account: accounts[0], balance: web3.utils.fromWei(await web3.eth.getBalance(accounts[0]), 'ether') })
            } else {
                try {
                    await web3.currentProvider.request({
                        method: "wallet_switchEthereumChain",
                        params: [{ chainId: "0x12" }],
                    });
                } catch (error) {
                    if (error.code === 4902) {
                        try {
                            await web3.currentProvider.request({
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
                connectWallet()
            }
        }
    }

    const loadWeb3 = () => {
        setTSTokenContract(new web3.eth.Contract(TSTokenContractABI, TSTokenContractAddress));
        setStakeContract(new web3.eth.Contract(stakeContractABI, stakeContractAddress));
    }

    const checkContractInfo = () => {
        TSTokencontract.methods.allowance(userInfo.account, stakeContractAddress).call().then(function (receipt) {
            setRemainAllowance(receipt);
        }).catch(error => {
            console.log(error);
        })

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

    const unlock = () => {

        TSTokencontract.methods.approve(stakeContractAddress, totalAllowance).send({ from: userInfo.account }).then(function (receipt) {

        }).catch(error => {
            console.log(error)
        })
        /*contract.methods.stake('1000000000000000000').send({ from: userInfo.account, gas: 100000 }).then(function (receipt) {
            
        }).catch(error => {
            console.log(error)
        })*/
    }

    const stake = () => {

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
    }, [])

    useEffect(() => {
        if (userInfo.account.length !== 0) {
            checkContractInfo();
        }
    }, [userInfo])

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
            <Container style={{ textAlign: "center", marginTop: "20px" }}>
                <font style={{ fontSize: "26px" }}><font style={{ color: "#669BFD" }}>TS </font><font>Dividend</font></font>
                <br></br>
                <font style={{ fontSize: "15px" }}>Stake TS to earn TT</font>
                <Container style={card}>
                    <Row style={blockOneStyle}>
                        <Col xs={2} sm={2}><img src={ThreeStarToken} width="50px"></img></Col>
                        <Col xs={4} sm={4} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px" }}>Stake</font>
                            <br></br>
                            <font style={{ fontSize: "17px" }}>TS</font>
                        </Col>
                        <Col xs={6} sm={6} style={{ textAlign: "right" }}>
                            <font style={{ fontSize: "13px" }}>Coming Dividend</font>
                            <br></br>
                            <font style={{ fontSize: "22px" }}>2000.88 TT</font>
                        </Col>
                    </Row>
                    <Row style={blockTwoStyle}>
                        <Col style={{ fontSize: "15px", textAlign: "left" }}>APR</Col>
                        <Col style={{ fontSize: "15px", textAlign: "right" }}>36%</Col>
                    </Row>
                    <Row>
                        <Col style={{ fontSize: "15px", textAlign: "left" }}>Next Payout</Col>
                        <Col style={{ fontSize: "15px", textAlign: "right" }}>7/31 19:00</Col>
                    </Row>

                    {userInfo.account.length === 0
                        ?
                        <Row>
                            <Col><Button style={longButtonStyle} onClick={connectWallet}>Connect Wallet</Button></Col>
                        </Row>
                        : remainAllowance < 10000000000000000000000000
                            ?
                            <Row>
                                <Col><Button style={longButtonStyle} onClick={unlock}>Unlock</Button></Col>
                            </Row>
                            :
                            ""
                    }

                    <Row style={blockThreeStyle}>
                        <Col xs={5} sm={5} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px", color: "#669BFD" }}>Aviailable TS</font>
                            <br></br>
                            <font style={{ fontSize: "15px" }}><Form.Control defaultValue={0} style={{ border: "0px" }} type="number" /></font>
                        </Col>
                        <Col style={{ textAlign: "right" }}>
                            <font style={{ fontSize: "10px", color: "#669BFD", textDecoration: "underline" }}>Max: {stakeMax}</font>
                            <br></br>
                            <Button style={{ backgroundColor: "#669BFD", borderColor: "#669BFD", width: "70%", lineHeight: "1.1" }} onClick={stake}>Stake</Button>
                        </Col>
                    </Row>
                    <Row style={blockThreeStyle}>
                        <Col xs={5} sm={5} style={{ textAlign: "left" }}>
                            <font style={{ fontSize: "13px", color: "#669BFD" }}>Staked TS</font>
                            <br></br>
                            <font style={{ fontSize: "15px" }}><Form.Control defaultValue={0} style={{ border: "0px" }} type="number" /></font>
                        </Col>
                        <Col style={{ textAlign: "right", }}>
                            <font style={{ fontSize: "10px", color: "#669BFD", textDecoration: "underline" }}>Max: {unstakeMax}</font>
                            <br></br>
                            <Button variant="outline-primary" style={{ color: "#669BFD", borderColor: "#669BFD", width: "70%", lineHeight: "1.1" }}>Unstake</Button>
                        </Col>
                    </Row>
                    <Row style={blockTwoStyle}>
                        <Col><Button style={longButtonStyle} onClick={claimDevidends}>Claim Dividends</Button></Col>
                    </Row>
                    <Row style={blockFourStyle}>
                        <Col><p style={{ color: "red", fontSize: "11px" }}>*Dividends must be claimed within 1 days</p></Col>
                    </Row>
                </Container>

                <Container style={card}>
                    <Row style={blockOneStyle}>
                        <Col><font style={{ fontSize: "26px" }}>Get <font style={{ color: "#669BFD" }}>TS</font></font></Col>
                    </Row>
                    <Row style={blockFiveStyle}>
                        <Col><font>You can also get <font style={{ color: "#669BFD" }}>3 Star</font> tokens, by playing the games!</font></Col>
                    </Row>
                    <Row style={blockFiveStyle}>
                        <Col><font>Whether you <font style={{ color: "#669BFD" }}>win/lost</font> a game, you'll receive the token to earn from the dividend!</font></Col>
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