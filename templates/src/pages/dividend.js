import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3';
import axios from 'axios';
import ThreeStarToken from '../images/threeStarToken.png';
import Sidebar from '../components/sidebar';
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import StakingRewardABI from '../abi/stakingRewardABI.json';
import { PathController } from '../components/pathController';
import { ConnectWallet } from '../components/connectWallet';
import { FiExternalLink } from 'react-icons/fi';
import '../styles/dividend.css';
import { AiOutlineDown, AiOutlineUp } from 'react-icons/ai';
import useCollapse from 'react-collapsed';
import TTSwapIcon from '../images/TTSwapIcon.png';

function Dividend({ userInfo, connectWallet, token }) {
    const metaConnect = new ConnectWallet();
    const web3 = new Web3(window.ethereum);

    const [apiPath, setApiPath] = useState('');
    const [TSTokenContract, setTSTokenContract] = useState();
    const [TSTokenContractAddress, setTSTokenContractAddress] = useState();
    const [stakeContract, setStakeContract] = useState();
    const [stakeContractAddress, setStakeContractAddress] = useState();

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

    const [isStaking, setIsStaking] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [isUnlocking, setIsUnlocking] = useState(false);
    const [isUnStaking, setIsUnStaking] = useState(false);

    const [totalStakeNow, setTotalStakeNow] = useState(0);

    const [detailOpen, setDetailOpen] = useState(false);
    const { getCollapseProps, getToggleProps } = useCollapse({ detailOpen });

    const [lastPayout, setLastPayout] = useState('');
    const [lastTotalStake, setLastTotalStake] = useState('');
    const [lastAPR, setLastAPR] = useState('');
    const [lastDividend, setLastDividend] = useState('');

    const [ttEarnRoundTitle, setTTEarnRoundTitle] = useState('');

    const [todayClaimNum, setTodayClaimNum] = useState(0);

    const loadWeb3 = () => {
        metaConnect
            .getChainId()
            .then((value) => {
                const pathController = new PathController(value);
                setApiPath(pathController.getApiPath());

                const stakeContractABI = StakingRewardABI.abi;
                setStakeContractAddress(pathController.getStakeContractAddress());

                const TSTokenContractABI = ThreeStarTokenABI.abi;
                setTSTokenContractAddress(pathController.getTSTokenContractAddress());

                setTSTokenContract(
                    new web3.eth.Contract(
                        TSTokenContractABI,
                        pathController.getTSTokenContractAddress()
                    )
                );
                setStakeContract(
                    new web3.eth.Contract(
                        stakeContractABI,
                        pathController.getStakeContractAddress()
                    )
                );
                //setStakeContract(new web3.eth.Contract(stakeContractABI, "0xa931A981edfCd9cA80A0Be1653CE3b1C4ceb757e"));
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const checkContractInfo = () => {
        TSTokenContract.methods
            .allowance(userInfo.account, stakeContractAddress)
            .call()
            .then(function (receipt) {
                if (receipt >= 100000000000000000000000) {
                    setUnlockBool(false);
                    TSTokenContract.methods
                        .balanceOf(userInfo.account)
                        .call()
                        .then(function (receipt) {
                            setStakeMax(
                                Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5)
                            );
                        })
                        .catch((error) => {
                            console.log(error);
                        });

                    stakeContract.methods
                        .balanceOf(userInfo.account)
                        .call()
                        .then(function (receipt) {
                            setUnstakeMax(
                                Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5)
                            );
                        })
                        .catch((error) => { });

                    stakeContract.methods
                        .rewards(userInfo.account)
                        .call()
                        .then(function (receipt) {
                            if (receipt > 0) {
                                setTTEarnRoundTitle('Last');
                                console.log(web3.utils.fromWei(receipt, 'ether'));
                                setTodayClaimNum(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(5));
                                setDisableDividends(false);
                            } else {
                                setTTEarnRoundTitle('Next');
                            }
                        })
                        .catch((error) => { });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const unlock = () => {
        setIsUnlocking(true);
        TSTokenContract.methods
            .approve(stakeContractAddress, totalAllowance)
            .send({ from: userInfo.account })
            .then(function (receipt) {
                checkContractInfo();
                setIsUnlocking(false);
            })
            .catch((error) => {
                setIsUnlocking(false);
            });
    };

    const stake = () => {
        setIsStaking(true);
        if (stakeAmount > 0 && stakeAmount <= stakeMax) {
            stakeContract.methods
                .stake(web3.utils.toWei(stakeAmount, 'ether'))
                .send({ from: userInfo.account })
                .then(function (receipt) {
                    setUnstakeMax((Number(unstakeMax) + Number(stakeAmount)).toFixed(5));
                    setStakeMax((Number(stakeMax) - Number(stakeAmount)).toFixed(5));
                    setIsStaking(false);
                })
                .catch((error) => {
                    console.log(error);
                    setIsStaking(false);
                });
        }
    };

    const unstake = () => {
        if (unstakeAmount > 0 && unstakeAmount <= unstakeMax) {
            setIsUnStaking(true);
            stakeContract.methods
                .withdraw(web3.utils.toWei(unstakeAmount, 'ether'))
                .send({ from: userInfo.account, value: web3.utils.toWei('1', 'ether') })
                .then(function (receipt) {
                    setUnstakeMax(
                        (Number(unstakeMax) - Number(unstakeAmount)).toFixed(5)
                    );
                    setStakeMax((Number(stakeMax) + Number(unstakeAmount)).toFixed(5));
                    setIsUnStaking(false);
                })
                .catch((error) => {
                    setIsUnStaking(false);
                });
        }
    };

    const claimDevidends = () => {
        setIsClaiming(true);
        stakeContract.methods
            .getReward()
            .send({ from: userInfo.account })
            .then(function (receipt) {
                setDisableDividends(true);
                setIsClaiming(false);
            })
            .catch((error) => {
                setIsClaiming(false);
            });
    };

    useEffect(() => {
        loadWeb3();
        connectWallet();
    }, []);

    useEffect(() => {
        loadWeb3();

        if (apiPath !== '') {
            axios.get(apiPath + '/getDividendInfo').then((res) => {
                setDividends(res['data']['dividends']);
                setAPR(res['data']['APR']);
                setPayout(res['data']['payout']);
                setTotalStakeNow(res['data']['totalStake']);
            }).catch((error) => {
                console.log(error);
            });

            axios.get(apiPath + '/lastRound').then((res) => {
                setLastPayout(res['data']['payout']);
                setLastTotalStake(res['data']['totalStake']);
                setLastAPR(res['data']['APR']);
                setLastDividend(res['data']['dividend']);
            }).catch((error) => console.log(error));

            if (userInfo.account.length !== 0) {
                checkContractInfo();
            }
        }
    }, [token]);

    useEffect(() => {
        if (userInfo.account.length !== 0) {
            checkContractInfo();
        }
        setIsConnecting(false);
    }, [userInfo]);

    useEffect(() => {
        if (ttEarnRoundTitle === 'Next') {
            setTodayClaimNum(
                ((Number(dividends) * Number(unstakeMax)) / Number(totalStakeNow)).toFixed(5)
            );
        }
    }, [dividends, isStaking, totalStakeNow]);

    const blockOneStyle = {
        border: '1px',
        borderStyle: 'solid',
        borderColor: '#669BFD',
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
        marginTop: '10px',
        paddingBottom: '10px',
    };

    const blockThreeStyle = {
        border: '1px',
        borderStyle: 'solid',
        borderColor: '#669BFD',
        borderRadius: '10px',

        marginTop: '10px',
        paddingTop: '10px',
        marginLeft: '4px',
        marginRight: '4px',
        paddingBottom: '10px',
    };

    const blockFiveStyle = {
        marginTop: '10px',
        marginLeft: '10px',
        marginRight: '10px',
    };

    return (
        <div style={{ backgroundColor: '#FAF9FA', minHeight: '100vh' }}>
            <Sidebar />
            <Container style={{ textAlign: 'center', marginTop: '20px', maxWidth: '720px' }} >
                <font style={{ fontSize: '26px' }}>
                    <font style={{ color: '#669BFD' }}>3Star </font>
                    <font>Dividend</font>
                </font>
                <br></br>
                <font style={{ fontSize: '15px' }}>Stake 3Star to earn {token}</font>
                <Container className='card'>
                    <Row style={blockOneStyle}>
                        <Col xs={2} sm={2}>
                            <img src={ThreeStarToken} width='50px'></img>
                        </Col>
                        <Col xs={4} sm={4} style={{ textAlign: 'left' }}>
                            <font style={{ fontSize: '13px' }}>Stake</font>
                            <br></br>
                            <font style={{ fontSize: '17px' }}>3Star</font>
                        </Col>
                        <Col xs={6} sm={6} style={{ textAlign: 'right' }}>
                            <font style={{ fontSize: '13px' }}>Coming Dividend</font>
                            <br></br>
                            <font style={{ fontSize: '22px' }}>
                                {dividends} {token}
                            </font>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col style={{ fontSize: '15px', textAlign: 'left' }}>APR</Col>
                        <Col style={{ fontSize: '15px', textAlign: 'right' }}>{APR}</Col>
                    </Row>
                    <Row>
                        <Col style={{ fontSize: '15px', textAlign: 'left' }}>
                            Next Payout
                        </Col>
                        <Col style={{ fontSize: '15px', textAlign: 'right' }}>{payout}</Col>
                    </Row>
                    <Row>
                        <Col style={{ fontSize: '15px', textAlign: 'left' }}>
                            Total Staked
                        </Col>
                        <Col style={{ fontSize: '15px', textAlign: 'right' }}>
                            {totalStakeNow}
                        </Col>
                    </Row>

                    {userInfo.account.length === 0 ? (
                        <Row>
                            <Col>
                                {isConnecting ? (
                                    <Button disabled={true} className='longButton'>
                                        <Spinner
                                            as='span'
                                            animation='grow'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                        Loading...
                                    </Button>
                                ) : (
                                    <Button
                                        className='longButton'
                                        onClick={() => {
                                            setIsConnecting(true);
                                            connectWallet()
                                                .then((value) => {
                                                    setIsConnecting(false);
                                                })
                                                .catch((error) => {
                                                    setIsConnecting(false);
                                                });
                                        }}
                                    >
                                        Connect Wallet
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ) : unlockBool ? (
                        <Row>
                            <Col>
                                {isUnlocking ? (
                                    <Button disabled={true} className='longButton'>
                                        <Spinner
                                            as='span'
                                            animation='grow'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                        Loading...
                                    </Button>
                                ) : (
                                    <Button className='longButton' onClick={unlock}>
                                        Unlock
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ) : (
                        ''
                    )}

                    <Row style={blockThreeStyle}>
                        <Col xs={5} sm={5} style={{ textAlign: 'left' }}>
                            <font style={{ fontSize: '13px', color: '#669BFD' }}>
                                Aviailable 3Star
                            </font>
                            <br></br>
                            <font style={{ fontSize: '15px' }}>
                                <Form.Control
                                    value={stakeAmount}
                                    style={{ border: '0px' }}
                                    type='number'
                                    onChange={(e) => {
                                        setStakeAmount(e.target.value);
                                    }}
                                />
                            </font>
                        </Col>
                        <Col style={{ textAlign: 'right' }}>
                            <font
                                style={{
                                    fontSize: '10px',
                                    color: '#669BFD',
                                    textDecoration: 'underline',
                                }}
                                onClick={() => {
                                    setStakeAmount(stakeMax);
                                }}
                            >
                                Max: {stakeMax}
                            </font>
                            <br></br>
                            {isStaking ? (
                                <Button
                                    style={{
                                        backgroundColor: '#669BFD',
                                        borderColor: '#669BFD',
                                        width: '70%',
                                        lineHeight: '1.1',
                                    }}
                                    disabled
                                >
                                    <Spinner
                                        as='span'
                                        animation='grow'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true'
                                    />
                                    Loading...
                                </Button>
                            ) : (
                                <Button
                                    disabled={stakeAmount > stakeMax || stakeAmount < 1}
                                    style={{
                                        backgroundColor: '#669BFD',
                                        borderColor: '#669BFD',
                                        width: '70%',
                                        lineHeight: '1.1',
                                    }}
                                    onClick={stake}
                                >
                                    Stake
                                </Button>
                            )}

                            <br></br>
                            <font style={{ fontSize: '12px', color: '#FF0000' }}>
                                {stakeAmount > stakeMax ? 'Insufficient balance' : ''}
                            </font>
                        </Col>
                    </Row>

                    <Row style={{ marginTop: '10px' }} className='claimBlock'>
                        <Col style={{ textAlign: 'left' }}>
                            <font style={{ color: '#00B3F7' }}>
                                {ttEarnRoundTitle} TT Earn
                            </font>
                            <br></br>
                            <font>{todayClaimNum}</font>
                        </Col>
                        <Col className='claimBtDiv'>
                            {isClaiming ? (
                                <Button disabled={true}>
                                    <Spinner
                                        as='span'
                                        animation='grow'
                                        size='sm'
                                        role='status'
                                        aria-hidden='true'
                                    />
                                    Loading...
                                </Button>
                            ) : (
                                <Button disabled={disableDividends} onClick={claimDevidends}>
                                    Claim
                                </Button>
                            )}
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <p style={{ color: 'red', fontSize: '12px' }}>
                                *Dividends must be claimed within 1 day
                            </p>
                        </Col>
                    </Row>

                    <Row className='detailBlock'>
                        {detailOpen ? (
                            <Col {...getToggleProps({ onClick: () => setDetailOpen(false) })}>
                                Detail <AiOutlineDown />
                            </Col>
                        ) : (
                            <Col {...getToggleProps({ onClick: () => setDetailOpen(true) })}>
                                Detail <AiOutlineUp />
                            </Col>
                        )}
                    </Row>
                    <div {...getCollapseProps()}>
                        <Row style={blockThreeStyle}>
                            <Col xs={5} sm={5} style={{ textAlign: 'left' }}>
                                <font style={{ fontSize: '13px', color: '#669BFD' }}>
                                    Staked 3Star
                                </font>
                                <br></br>
                                <font style={{ fontSize: '15px' }}>
                                    <Form.Control
                                        value={unstakeAmount}
                                        style={{ border: '0px' }}
                                        type='number'
                                        onChange={(e) => {
                                            setUnstakeAmount(e.target.value);
                                        }}
                                    />
                                </font>
                            </Col>
                            <Col style={{ textAlign: 'right' }}>
                                <font
                                    style={{
                                        fontSize: '10px',
                                        color: '#669BFD',
                                        textDecoration: 'underline',
                                    }}
                                    onClick={() => {
                                        setUnstakeAmount(unstakeMax);
                                    }}
                                >
                                    Max: {unstakeMax}
                                </font>
                                <br></br>
                                {isUnStaking ? (
                                    <Button
                                        disabled={true}
                                        style={{
                                            color: '#669BFD',
                                            borderColor: '#669BFD',
                                            width: '70%',
                                            lineHeight: '1.1',
                                        }}
                                    >
                                        <Spinner
                                            as='span'
                                            animation='grow'
                                            size='sm'
                                            role='status'
                                            aria-hidden='true'
                                        />
                                        Loading...
                                    </Button>
                                ) : (
                                    <Button
                                        disabled={unstakeAmount > unstakeMax}
                                        variant='outline-primary'
                                        style={{
                                            color: '#669BFD',
                                            borderColor: '#669BFD',
                                            width: '70%',
                                            lineHeight: '1.1',
                                        }}
                                        onClick={unstake}
                                    >
                                        Unstake
                                    </Button>
                                )}

                                <br></br>

                                <font style={{ fontSize: '12px', color: '#FF0000' }}>
                                    {unstakeAmount > unstakeMax ? 'Insufficient balance' : ''}
                                </font>
                            </Col>
                        </Row>

                        <Row style={{ marginTop: '10px' }}>
                            <Col style={{ fontSize: '15px', textAlign: 'left' }}>
                                Last Payout
                            </Col>
                            <Col style={{ fontSize: '15px', textAlign: 'right' }}>
                                {lastPayout}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ fontSize: '15px', textAlign: 'left' }}>
                                Total Staked
                            </Col>
                            <Col style={{ fontSize: '15px', textAlign: 'right' }}>
                                {lastTotalStake}
                            </Col>
                        </Row>
                        <Row>
                            <Col style={{ fontSize: '15px', textAlign: 'left' }}>APR</Col>
                            <Col style={{ fontSize: '15px', textAlign: 'right' }}>
                                {lastAPR}
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '10px' }}>
                            <Col style={{ fontSize: '15px', textAlign: 'left' }}>
                                Dividends
                            </Col>
                            <Col style={{ fontSize: '15px', textAlign: 'right' }}>
                                {lastDividend}
                            </Col>
                        </Row>
                    </div>
                </Container>

                <Container className='card'>
                    <Row style={blockOneStyle}>
                        <Col>
                            <font style={{ fontSize: '26px' }}>
                                Get <font style={{ color: '#669BFD' }}>3Star</font>
                            </font>
                        </Col>
                    </Row>
                    <Row style={blockFiveStyle}>
                        <Col>
                            <font>
                                To get <font style={{ color: '#669BFD' }}>3Star</font> you just
                                need to play the games!
                            </font>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <Col>
                            <a href='/'>
                                <Button className='longButton'>Go to play</Button>
                            </a>
                        </Col>
                    </Row>

                    <Row style={blockFiveStyle}>
                        <Col>
                            <font>
                                You can also buy <font style={{ color: '#669BFD' }}>3Star</font>{' '}
                                on TTSwap
                            </font>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <img src={TTSwapIcon} alt='ttswapicon' width='45px'></img>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px', marginBottom: '10px' }}>
                        <Col>
                            <a href='https://ttswap.space/#/swap/0xF0F35015Fd4879Ef73Dfc1abbB29226AfBF53186'>
                                <Button className='longButton'>Buy on TTSwap</Button>
                            </a>
                        </Col>
                    </Row>
                </Container>
            </Container>
        </div>
    );
}

export default Dividend;
