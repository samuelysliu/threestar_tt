import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Spinner, Overlay, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import Sidebar from '../components/sidebar';
import ThreeStarABI from '../abi/threeStarABI.json';
import axios from 'axios';
import { TiStarFullOutline } from 'react-icons/ti';
import { BsInfoCircleFill } from 'react-icons/bs';
import BetCircle from '../components/betCircle';
import { PathController } from '../components/pathController';
import '../styles/home.css'
import ThreeStarToken from '../images/threeStarToken.png'
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import UserNumber from '../components/userNumber';
import Confetti from 'react-confetti'
import UseWindowSize from '../components/useWindowSize'
import { ConnectWallet } from '../components/connectWallet'
import BNBTokenImage from '../images/BNB.png'

function Index({ userInfo, connectWallet, token, originTokenUrl }) {
    const metaConnect = new ConnectWallet()
    const [apiPath, setApiPath] = useState("")

    const [userLuckyNumber, setUserLuckyNumber] = useState([])
    const [starNumber, setStarNumber] = useState([])
    const [userBet, setUserBet] = useState(100);
    const [estimateEarn, setEstimateEarn] = useState(userBet * 100)

    const [threeStarcontract, setThreeStarContract] = useState();
    const [TSTokenContract, setTSTokenContract] = useState();
    const [TSToken, setTSToken] = useState(0)
    const [TTToken, setTToken] = useState(0)

    const [betting, setBetting] = useState(false)

    const [statusMessage, setStatusMessage] = useState("")
    const [winTS, setWinTS] = useState(0)
    const [winTT, setWinTT] = useState(0)

    const [betNumberCircle, setBetNumberCircle] = useState({ "one": "1", "two": "1", "three": "2", "four": "1", "five": "1" })
    const [userNumberColor, setUserNumberColor] = useState({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "1" })

    const [walletConnecting, setWalletConnecting] = useState(false)
    const [errorMessage, SetErrorMessage] = useState("")

    const { width, height } = UseWindowSize();

    const [infoShow, setInfoShow] = useState(false)
    const [infoTarget, setInfoTarget] = useState(null)
    const infoRef = useRef(null);

    const TTTokenImage = "https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1.25,format=auto/https%3A%2F%2F1384322056-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHVry7OTN1UZzjjhTeYXg%252Ficon%252Ftc2CvK0iK8pBB1anEcAT%252F10990.png%3Falt%3Dmedia%26token%3Dd308595a-a25f-4dc2-bd7e-8237f6d9f8e1"

    let web3 = new Web3(window.ethereum);

    const loadWeb3 = () => {
        metaConnect.getChainId().then((value) => {
            const pathController = new PathController(value)
            setApiPath(pathController.getApiPath())
            const threeStarcontractABI = ThreeStarABI.abi;
            const threeStarcontractAddress = pathController.getThreeStarContractAddress();
            const TSTokenContractABI = ThreeStarTokenABI.abi;
            const TSTokenContractAddress = pathController.getTSTokenContractAddress();

            setTSTokenContract(new web3.eth.Contract(TSTokenContractABI, TSTokenContractAddress));
            setThreeStarContract(new web3.eth.Contract(threeStarcontractABI, threeStarcontractAddress));

            setStatusMessage("YOU WILL WIN " + token)
        }).catch(error => {
            console.log(error)
        })
    }

    //user click let's bet 
    const startGame = () => {
        if (userInfo.account.length === 0) {
            connectWallet()
            SetErrorMessage("Invalid Wallet")
            setTimeout(() => {
                SetErrorMessage("")
            }, 6000)
        }

        // user must choose five lucky number
        else if (userLuckyNumber.length === 5) {
            setBetting(true)
            let point = 0;
            // assign task to backend to create random number and match
            threeStarcontract.methods.game().send({ from: userInfo.account, value: web3.utils.toWei(String(userBet), "ether") }).then(function (receipt) {
                axios.post(apiPath + "/startGame", { "userLuckyNum": userLuckyNumber, "playerAddress": userInfo.account, "betNum": userBet }).then(res => {
                    point = res['data']['point'];
                    setStarNumber(res['data']['starNumber'])
                    checkUserNumberMatch(res['data']['starNumber'])

                    setBetting(false)

                    if (point > 2) {
                        setStatusMessage("YOU WON!!")
                        setWinTT(res['data']['winTT'])
                        setTToken((Number(TTToken) - Number(userBet) + Number(res['data']['winTT'])).toFixed(2))
                    } else {
                        setStatusMessage("YOU GOT 3Star!")
                        setWinTS(res['data']['winTS'])
                        setTToken((Number(TTToken) - Number(userBet)).toFixed(2))
                        setTSToken((Number(TSToken) + Number(res['data']['winTS'])).toFixed(2))
                    }

                    setTimeout(() => {
                        setStatusMessage("YOU WILL WIN " + token)
                        setUserNumberColor({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "1" })
                    }, "6000")

                }).catch(error => {
                    setBetting(false)
                })
            }).catch(error => {
                setBetting(false)
                SetErrorMessage("Insufficient Balance")
                setTimeout(() => {
                    SetErrorMessage("")
                }, 6000)
            })
        }
    }

    const randomCreateuserLuckyNumber = () => {
        setUserLuckyNumber([])
        let randomTemp = [Math.floor(Math.random() * 80) + 1]
        let temp;
        while (randomTemp.length < 5) {
            temp = Math.floor(Math.random() * 80) + 1
            if (!randomTemp.includes(temp)) {
                randomTemp.push(temp)
            }
        }
        randomTemp.sort((a, b) => {
            if (a < b) {
                return -1
            }
            if (a > b) {
                return 1
            }
            return 0
        })
        setUserLuckyNumber(randomTemp)
    }

    const checkUserNumberMatch = (_starNumber) => {
        setUserNumberColor({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "1" })
        for (let i = 0; i < _starNumber.length; i++) {
            for (let j = 0; j < userLuckyNumber.length; j++) {
                if (_starNumber[i] === userLuckyNumber[j]) {
                    switch (j) {
                        case 0:
                            setUserNumberColor((prev) => ({ ...prev, "one": "2" }))
                            break

                        case 1:
                            setUserNumberColor((prev) => ({ ...prev, "two": "2" }))
                            break

                        case 2:
                            setUserNumberColor((prev) => ({ ...prev, "three": "2" }))
                            break

                        case 3:
                            setUserNumberColor((prev) => ({ ...prev, "four": "2" }))
                            break

                        case 4:
                            setUserNumberColor((prev) => ({ ...prev, "five": "2" }))
                            break
                    }
                }
            }
        }
    }

    const changeBetNumber = (number) => {
        switch (number) {
            case 'one':
                setUserBet(20)
                setBetNumberCircle({ "one": "2", "two": "1", "three": "1", "four": "1", "five": "1" })
                break

            case 'two':
                setUserBet(80)
                setBetNumberCircle({ "one": "1", "two": "2", "three": "1", "four": "1", "five": "1" })
                break

            case 'three':
                setUserBet(100)
                setBetNumberCircle({ "one": "1", "two": "1", "three": "2", "four": "1", "five": "1" })
                break

            case 'four':
                setUserBet(1000)
                setBetNumberCircle({ "one": "1", "two": "1", "three": "1", "four": "2", "five": "1" })
                break

            case 'five':
                setUserBet(10000)
                setBetNumberCircle({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "2" })
                break
        }
    }

    const checkBalance = () => {
        TSTokenContract.methods.balanceOf(userInfo.account).call().then(function (receipt) {
            setTToken(Number(userInfo.balance).toFixed(2));
            setTSToken(Number(web3.utils.fromWei(receipt, 'ether')).toFixed(2));
        }).catch(error => {
            console.log(error);
        })


    }

    useEffect(() => {
        loadWeb3()
        randomCreateuserLuckyNumber()
        connectWallet()
    }, [])

    useEffect(() => {
        setEstimateEarn(userBet * 100)
    }, [userBet]);

    useEffect(() => {
        if (userInfo.account.length !== 0) {
            checkBalance()
            setWalletConnecting(false)
        }
    }, [userInfo])

    useEffect(() => {
        loadWeb3()
    }, [token])

    const mainContainer = {
        textAlign: "center",
        color: "white",
        paddingBottom: "5%"
    }

    const randomNumberStyle = {
        backgroundColor: "#056AE1",
        marginLeft: "60px",
        marginRight: "60px",
        borderRadius: "55px",
        borderStyle: "solid",
        borderWidth: "3px",
        borderColor: "#26C4FF",
        paddingTop: "20px",
        paddingBottom: "20px"
    }

    const changeBtStyle = {
        backgroundColor: "#14C7FA",
        borderWidth: "0",
        borderRadius: "6px",
        color: "white",
        width: "30%",
        boxShadow: "0px 5px 0px 0px #00AFF3",
        padding: "6px",
        fontSize: "16px",
        color: "white",
    }

    const connectBtStyle = {
        backgroundColor: "#F2932D",
        borderWidth: "0",
        borderRadius: "6px",
        color: "white",
        width: "60%",
        boxShadow: "0px 5px 0px 0px #E47600",
        padding: "6px",
        fontSize: "16px",
    }

    const betNowStyle = {
        cardStyle: {
            textAlign: "center",
            position: "relative",
            top: "20px"
        },

        btStyle: {
            backgroundColor: "#70E545",
            borderWidth: "0",
            borderRadius: "6px",
            color: "white",
            width: "70%",
            boxShadow: "0px 5px 0px 0px #09C401",
            fontSize: "16px",
            color: "white",
        }
    }

    const infoStyle = {
        backgroundColor: "white",
        color: "black",
        width: "210px",
        fontSize: "12px",
        borderRadius: "5px",
        height: "30px",
        display: "flex",
        alignItems: "center"
    }


    return (
        <>
            <Sidebar />
            <div style={{ backgroundColor: "#1AB3FF", margin: "20px", borderRadius: "6px" }}>
                <Container style={mainContainer}>
                    <Row style={{ paddingTop: "10px" }}>
                        <Col xs={{ span: 6, offset: 3 }}><font style={{ fontSize: "16px" }}><strong>Numbers</strong></font></Col>
                        <Col xs={{ span: 2, offset: 1 }} style={{ textAlign: "right" }}>
                            <BsInfoCircleFill ref={infoRef} style={{ color: '#27C7FA', backgroundColor: "white", borderRadius: "50%" }} onClick={(event) => { setInfoShow(!infoShow); setInfoTarget(event.target) }} />
                        </Col>
                    </Row>
                    <Row ref={infoRef}>
                        <Overlay
                            show={infoShow}
                            target={infoTarget}
                            placement="bottom"
                            container={infoRef}
                            rootClose
                            onHide={() => setInfoShow(false)}
                        >
                            <div style={infoStyle}>
                                <font>winning {token} will be charged 1% fee </font>
                            </div>
                        </Overlay>
                    </Row>
                    <div style={randomNumberStyle}>
                        <Row style={{ justifyContent: "center" }}>
                            <Col xs="3" style={{ padding: "0px", height: "56px" }}>
                                <UserNumber userLuckyNumber={userLuckyNumber[0]} userColor={userNumberColor.one} />
                            </Col>
                            <Col xs="3" style={{ padding: "0px", height: "56px" }}>
                                <UserNumber userLuckyNumber={userLuckyNumber[1]} userColor={userNumberColor.two} />
                            </Col>
                            <Col xs="3" style={{ padding: "0px", height: "56px" }}>
                                <UserNumber userLuckyNumber={userLuckyNumber[2]} userColor={userNumberColor.three} />
                            </Col>
                            <Col xs="4" style={{ padding: "0px", height: "56px" }}>
                                <UserNumber userLuckyNumber={userLuckyNumber[3]} userColor={userNumberColor.four} />
                            </Col>
                            <Col xs="4" style={{ padding: "0px", height: "56px" }}>
                                <UserNumber userLuckyNumber={userLuckyNumber[4]} userColor={userNumberColor.five} />
                            </Col>
                        </Row>

                    </div>
                    <Row style={{ paddingTop: "10px" }}>
                        <Col>
                            <button style={changeBtStyle} onClick={randomCreateuserLuckyNumber}><strong>CHANGE</strong></button>
                        </Col>
                    </Row>
                    <Row style={{ paddingTop: "10px" }}>
                        <Col><font>{statusMessage}</font></Col>
                    </Row>

                    {statusMessage === "YOU WILL WIN " + token
                        ?
                        <Row>
                            <Col><font style={{ fontSize: "28px", color: "#FEE63A" }}>{estimateEarn}</font></Col>
                        </Row>

                        : statusMessage === "YOU GOT 3Star!"
                            ?
                            <Row>
                                <Col><img src={ThreeStarToken} style={{ width: "35px" }}></img><font style={{ fontSize: "28px", color: "#FEE63A" }}>{winTS}</font></Col>
                            </Row>
                            :
                            <Row>
                                <Confetti width={width} height={height} />
                                <Col><img src={originTokenUrl} style={{ width: "35px" }}></img><font style={{ fontSize: "28px", color: "#FEE63A" }}>{winTT}</font></Col>
                            </Row>
                    }


                    <div style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                        <Row style={{ color: "#FDCE20" }}>
                            <Col style={{ textAlign: "left" }}>
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                            </Col>
                            <Col style={{ textAlign: "right" }}>2X</Col>
                        </Row>
                        <Row style={{ color: "#FDCE20" }}>
                            <Col style={{ textAlign: "left" }}>
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                            </Col>
                            <Col style={{ textAlign: "right" }}>20X</Col>
                        </Row>
                        <Row style={{ color: "#FDCE20" }}>
                            <Col style={{ textAlign: "left" }}>
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                                <TiStarFullOutline size={18} />
                            </Col>
                            <Col style={{ textAlign: "right" }}>100X</Col>
                        </Row>
                    </div>

                    <Row style={{ paddingTop: "20px" }}>
                        <font style={{ color: "#E47600", fontSize: "12px" }}>{errorMessage}</font>
                        {userInfo.account.length === 0
                            ? <>
                                <Col>
                                    <button style={connectBtStyle} onClick={() => { connectWallet(); setWalletConnecting(true) }}>
                                        <strong>CONNECT WALLET</strong>
                                        {walletConnecting ? <Spinner animation="border" style={{ color: "#FFF", width: "1rem", height: "1rem", marginLeft: "5px" }} /> : ""}
                                    </button>
                                </Col>
                            </>
                            : <>
                                <Col className='tokenNumBc' style={{ marginLeft: "20px" }}>
                                    <img className='tokenStyle' src={originTokenUrl}></img>
                                    <Dropdown>
                                        <Dropdown.Toggle>
                                            <font>{TTToken} {token}</font>
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => metaConnect.changeChain("BSC")}>
                                                <img src={BNBTokenImage} width="20px"></img>
                                                <font style={{ paddingLeft: "10px" }}>BNB</font>
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => metaConnect.changeChain("ThunderCore")}>
                                                <img src={TTTokenImage} width="20px"></img>
                                                <font style={{ paddingLeft: "10px" }}>TT</font>
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </Col>
                                <Col className='tokenNumBc' style={{ marginRight: "20px" }}>
                                    <img className='tokenStyle' src={ThreeStarToken}></img>
                                    <font>{TSToken} 3Star</font>
                                </Col>
                            </>
                        }


                    </Row>

                    <Row xs={5} sm={5} style={{ paddingTop: "20px", paddingLeft: "20px", paddingRight: "20px" }}>
                        <Col onClick={() => changeBetNumber("one")}>
                            <BetCircle bcColor={betNumberCircle.one} betNumber="20" />
                        </Col>
                        <Col onClick={() => changeBetNumber("two")}>
                            <BetCircle bcColor={betNumberCircle.two} betNumber="80" />
                        </Col>
                        <Col onClick={() => changeBetNumber("three")}>
                            <BetCircle bcColor={betNumberCircle.three} betNumber="100" />
                        </Col>
                        <Col onClick={() => changeBetNumber("four")}>
                            <BetCircle bcColor={betNumberCircle.four} betNumber="1k" />
                        </Col>
                        <Col onClick={() => changeBetNumber("five")}>
                            <BetCircle bcColor={betNumberCircle.five} betNumber="10k" />
                        </Col>
                    </Row>
                </Container>
                <div style={betNowStyle.cardStyle}>
                    {betting
                        ? <button style={betNowStyle.btStyle}>
                            <strong>
                                <font style={{ fontSize: "48px" }}>BET</font>
                                <br></br>
                                <Spinner animation="border" style={{ color: "#0AB700" }} />
                            </strong>
                        </button>
                        : <button style={betNowStyle.btStyle} onClick={startGame}>
                            <strong>
                                <font style={{ fontSize: "48px" }}>BET</font>
                                <br></br>
                                <font style={{ fontSize: "24px", color: "#0AB700" }}>NOW</font>
                            </strong>
                        </button>
                    }
                </div>
            </div>
        </>
    );
}

export default Index;
