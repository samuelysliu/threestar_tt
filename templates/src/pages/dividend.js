import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import axios from 'axios';
import ThreeStarToken from '../images/threeStarToken.png';
import Sidebar from '../components/sidebar';
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import StakingRewardABI from '../abi/stakingRewardABI.json';
import { PathController } from '../components/pathController';
import { ConnectWallet } from '../components/connectWallet'

function Dividend({ userInfo, connectWallet, token }) {
    const metaConnect = new ConnectWallet()
    const web3 = new Web3(window.ethereum);

    const [apiPath, setApiPath] = useState("")
    const [TSTokenContract, setTSTokenContract] = useState();
    const [TSTokenContractAddress, setTSTokenContractAddress] = useState();
    const [stakeContract, setStakeContract] = useState();
    const [stakeContractAddress, setStakeContractAddress] = useState();

    const loadWeb3 = () => {
        metaConnect.getChainId().then((value) => {
            const pathController = new PathController(value)
            setApiPath(pathController.getApiPath())

            const stakeContractABI = StakingRewardABI.abi;
            setStakeContractAddress(pathController.getStakeContractAddress());

            const TSTokenContractABI = ThreeStarTokenABI.abi;
            setTSTokenContractAddress(pathController.getTSTokenContractAddress());

            setTSTokenContract(new web3.eth.Contract(TSTokenContractABI, pathController.getTSTokenContractAddress()));
            setStakeContract(new web3.eth.Contract(stakeContractABI, pathController.getStakeContractAddress()));
        }).catch(error => {
            console.log(error)
        })
    }

    const [stakeMax, setStakeMax] = useState(0);
    const [unstakeMax, setUnstakeMax] = useState(0);

    const [stakeAmount, setStakeAmount] = useState(0);
    const [unstakeAmount, setUnstakeAmount] = useState(0);

    const [dividends, setDividends] = useState(0);
    const [APR, setAPR] = useState(0);
    const [payout, setPayout] = useState(0);

    const [disableDividends, setDisableDividends] = useState(true);

    let totalAllowance = '10000000000000000000000000000';
    const [unlockBool, setUnlockBool] = useState(true);

    const [isStaking, setIsStaking] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)


    const checkContractInfo = () => {
        TSTokenContract.methods.allowance(userInfo.account, stakeContractAddress).call().then(function (receipt) {
            if (receipt >= 10000000000000000000000000) {
                setUnlockBool(false);
                TSTokenContract.methods.balanceOf(userInfo.account).call().then(function (receipt) {
                    setStakeMax(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5));
                }).catch(error => {
                    console.log(error);
                })

                stakeContract.methods.balanceOf(userInfo.account).call().then(function (receipt) {
                    setUnstakeMax(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5));
                }).catch(error => { })

                stakeContract.methods.rewards(userInfo.account).call().then(function (receipt) {
                    if (receipt > 0) {
                        setDisableDividends(false)
                    }
                }).catch(error => { })
            }
        }).catch(error => {
            console.log(error);
        })
    }

    const unlock = () => {
        TSTokenContract.methods.approve(stakeContractAddress, totalAllowance).send({ from: userInfo.account }).then(function (receipt) {
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
        setIsClaiming(true)
        stakeContract.methods.getReward().send({ from: userInfo.account }).then(function (receipt) {
            setDisableDividends(true)
            setIsClaiming(false)
        }).catch(error => {
            setIsClaiming(false)
        })
    }

    useEffect(() => {
        loadWeb3();
        connectWallet()
    }, [])

    useEffect(() => {
        loadWeb3();
    }, [token])

    useEffect(() => {
        if (apiPath !== "") {
            axios.get(apiPath + "/getDividendInfo").then(res => {
                setDividends(res['data']['dividends'])
                setAPR(res['data']['APR'])
                setPayout(res['data']['payout'])
            }).catch(error => {
                console.log(error)
            });

            if (userInfo.account.length !== 0) {
                checkContractInfo();
            }
        }
    }, [apiPath])

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
        <div style={{ backgroundColor: "#FAF9FA", minHeight: "100vh" }}>
            <Sidebar />
            <Container style={{ textAlign: "center", marginTop: "20px", maxWidth: "720px" }}>
                <font style={{ fontSize: "26px" }}><font style={{ color: "#669BFD" }}>3Star </font><font>Dividend</font></font>
                <br></br>
                <font style={{ fontSize: "15px" }}>Stake 3Star to earn {token}</font>
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
                            <font style={{ fontSize: "22px" }}>{dividends} {token}</font>
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
                        <Col>
                            {isClaiming ?
                                <Button disabled={true} style={longButtonStyle}>
                                    <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
                                    Loading...
                                </Button>
                                : <Button disabled={disableDividends} style={longButtonStyle} onClick={claimDevidends}>Claim Dividends</Button>
                            }
                        </Col>
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