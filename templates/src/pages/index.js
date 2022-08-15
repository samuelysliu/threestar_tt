import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import Sidebar from '../components/sidebar';
import ThreeStarABI from '../abi/threeStarABI.json';
import axios from 'axios';
import { TiStarFullOutline } from 'react-icons/ti';
import BetCircle from '../components/betCircle';
import { PathController } from '../components/pathController';
import '../styles/home.css'
import ThreeStarToken from '../images/threeStarToken.png'
import ThreeStarTokenABI from '../abi/threeStarTokenABI.json';
import UserNumber from '../components/userNumber';
import Confetti from 'react-confetti'
import UseWindowSize from '../components/useWindowSize'

function Index({ userInfo, connectWallet }) {
    const pathController = new PathController()

    const apiPath = pathController.getApiPath();

    //const [userInfo, setUserInfo] = useState()
    const [userLuckyNumber, setUserLuckyNumber] = useState([])
    const [starNumber, setStarNumber] = useState([])
    const [userBet, setUserBet] = useState(20);
    const [estimateEarn, setEstimateEarn] = useState(userBet * 100)

    const [threeStarcontract, setThreeStarContract] = useState();
    const [TSTokenContract, setTSTokenContract] = useState();
    const [TSToken, setTSToken] = useState(0)
    const [TTToken, setTToken] = useState(0)

    const TTTokenUrl = "https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1.25,format=auto/https%3A%2F%2F1384322056-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHVry7OTN1UZzjjhTeYXg%252Ficon%252Ftc2CvK0iK8pBB1anEcAT%252F10990.png%3Falt%3Dmedia%26token%3Dd308595a-a25f-4dc2-bd7e-8237f6d9f8e1"

    const [betting, setBetting] = useState(false)

    const [title, setTitle] = useState("YOU WILL WIN TT")
    const [winTS, setWinTS] = useState(0)
    const [winTT, setWinTT] = useState(0)

    const [betNumberCircle, setBetNumberCircle] = useState({ "one": "2", "two": "1", "three": "1", "four": "1", "five": "1" })
    const [userNumberColor, setUserNumberColor] = useState({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "1" })

    const threeStarcontract_abi = ThreeStarABI.abi;
    const threeStarcontract_address = pathController.getThreeStarContractAddress();
    const TSTokenContractABI = ThreeStarTokenABI.abi;
    const TSTokenContractAddress = pathController.getTSTokenContractAddress();

    const { width, height } = UseWindowSize();

    let web3 = new Web3(window.ethereum);

    const loadWeb3 = () => {
        setTSTokenContract(new web3.eth.Contract(TSTokenContractABI, TSTokenContractAddress));
        setThreeStarContract(new web3.eth.Contract(threeStarcontract_abi, threeStarcontract_address));
    }

    //user click let's bet 
    const startGame = () => {
        // user must choose five lucky number
        if (userLuckyNumber.length === 5) {
            setBetting(true)
            let point = 0;
            // assign task to backend to create random number and match
            threeStarcontract.methods.game().send({ from: userInfo.account, value: userBet * 1000000000000000000 }).then(function (receipt) {
                axios.post(apiPath + "/startGame", { "userLuckyNum": userLuckyNumber, "playerAddress": userInfo.account, "betNum": userBet }).then(res => {
                    console.log(res["data"])
                    point = res['data']['point'];
                    setStarNumber(res['data']['starNumber'])
                    checkUserNumberMatch(res['data']['starNumber'])

                    setBetting(false)

                    if (point > 2) {
                        setTitle("YOU WON!!")
                        setWinTT(res['data']['winTT'])
                        setTToken((Number(TTToken) + Number(res['data']['winTT'])).toFixed(2))
                    } else {
                        setTitle("YOU GOT 3Star!")
                        setWinTS(res['data']['winTS'])
                        setTSToken((Number(TSToken) + Number(res['data']['winTS'])).toFixed(2))
                    }

                    setTimeout(() => {
                        setTitle("YOU WILL WIN TT")
                        setUserNumberColor({ "one": "1", "two": "1", "three": "1", "four": "1", "five": "1" })
                    }, "6000")

                }).catch(error => {
                    setBetting(false)
                })
                setTToken((Number(TTToken) - Number(userBet)).toFixed(2))
            }).catch(error => {
                setBetting(false)
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
        }
    }, [userInfo])

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
        width: "50%",
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


    return (
        <>
            <Sidebar />
            <div style={{ backgroundColor: "#1AB3FF", margin: "20px", borderRadius: "6px" }}>
                <Container style={mainContainer}>
                    <Row style={{ paddingTop: "10px" }}>
                        <Col><font style={{ fontSize: "16px" }}><strong>Numbers</strong></font></Col>
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
                        <Col><font>{title}</font></Col>
                    </Row>

                    {title === "YOU WILL WIN TT"
                        ?
                        <Row>
                            <Col><font style={{ fontSize: "28px", color: "#FEE63A" }}>{estimateEarn}</font></Col>
                        </Row>

                        : title === "YOU GOT 3Star!"
                            ?
                            <Row>
                                <Col><img src={ThreeStarToken} style={{ width: "35px" }}></img><font style={{ fontSize: "28px", color: "#FEE63A" }}>{winTS}</font></Col>
                            </Row>
                            :
                            <Row>
                                <Confetti width={width} height={height} />
                                <Col><img src={TTTokenUrl} style={{ width: "35px" }}></img><font style={{ fontSize: "28px", color: "#FEE63A" }}>{winTT}</font></Col>
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
                        {userInfo.account.length === 0
                            ? <>
                                <Col>
                                    <button style={connectBtStyle} onClick={connectWallet}><strong>CONNECT WALLET</strong></button>
                                </Col>
                            </>
                            : <>
                                <Col className='tokenNumBc' style={{ marginLeft: "20px" }}>
                                    <img className='tokenStyle' src={TTTokenUrl}></img>
                                    <font>{TTToken} TT</font>
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
