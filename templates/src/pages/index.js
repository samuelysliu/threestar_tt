import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import Header from '../components/header';
import ToastRule from '../components/toastRule';
import ThreeStarABI from '../abi/threeStarABI.json';
import axios from 'axios';
import ResultPopout from '../components/resultPopout';
import { BsFillInfoCircleFill } from 'react-icons/bs';

function Index() {
    const apiPath = 'https://three-star.herokuapp.com/';
    const [userInfo, setUserInfo] = useState()
    const [userLuckyNumber, setUserLuckyNumber] = useState([])
    const [starNumber, setStarNumber] = useState([])
    const [userBet, setUserBet] = useState(1);
    const [userEarn, setUserEanr] = useState(0);
    const [estimateEarn, setEstimateEarn] = useState(userBet * 100)
    const [contract, setContract] = useState();
    const [gameStatus, setGameStatus] = useState("")
    const [popoutShow, setPopoutShow] = useState(false)
    const [show, setShow] = useState(true)
    const [toastShow, setToastShow] = useState(false)
    let web3 = new Web3(window.ethereum);

    const getUserInfo = (_userInfo) => {
        setUserInfo(_userInfo)
    }

    const getToastShowStatus = (_toastShowStatus) =>{
        if(_toastShowStatus === undefined){
            return toastShow
        }else if(_toastShowStatus != toastShow){
            setToastShow(_toastShowStatus)
        }
    }

    //Control user click their lucky number into array
    const addLuckyNumber = (luckyNumber) => {
        const temp = [...userLuckyNumber];
        let index = temp.indexOf(luckyNumber);

        if (index > -1) {
            temp.splice(index, 1)
        } else {
            if (temp.length < 5) {
                temp.push(luckyNumber)
            }
        }

        setUserLuckyNumber(temp)
    }

    const loadWeb3 = () => {
        let contract_abi = ThreeStarABI.abi;
        let contract_address = '0xe8fbF366510907D0B616b387CBc513f7Fc31279B';
        setContract(new web3.eth.Contract(contract_abi, contract_address));
    }

    //user click let's bet 
    const startGame = () => {
        // user must choose five lucky number
        if (userLuckyNumber.length === 5) {
            // popout the status
            setGameStatus("Drawing...");
            setPopoutShow(true);
            let point = 0;
            // assign task to backend to create random number and match
            axios.post(apiPath + "/startGame", { "userLuckyNum": userLuckyNumber }).then(res => {
                point = res['data']['point'];
                setStarNumber(res['data']['starNumber'])
                contract.methods.game().send({ from: userInfo.account, value: userBet * 1000000000000000000 }).then(function (receipt) {
                    if (point >= 3) {
                        axios.post(apiPath + "/sendPrize", { "winner": userInfo.account, "point": point }).then(res => {
                            if (res['data']['result'] === 'success') {
                                setGameStatus("You Win!");
                                setUserEanr(estimateEarn * 0.9);
                            } else {
                                setPopoutShow(false);
                                console.log("failed")
                            }
                        }).catch(error => {
                            setPopoutShow(false);
                            console.log(error)
                        })
                    } else {
                        setGameStatus("You Lose");
                    }
                })
            }).catch(error => {
                console.log(error);
            })
        }
    }

    useEffect(() => {
        loadWeb3()
    }, [])

    useEffect(() => {
        setEstimateEarn(userBet * 100)
    }, [userBet]);

    return (
        <>
            <Header sendUserInfo={getUserInfo} />
            <Container style={{ textAlign: "center" }}>
                <ToastRule sendToastShowStatus={getToastShowStatus} />
                <Row>
                    <Col><h2>Three Star Game</h2></Col>
                </Row>
                <Row>
                    <Col><p>Please Select your luck number</p></Col>
                </Row>
                <Row xs="auto" style={{ paddingLeft: "5%" }}>
                    {Array.from({ length: 80 }).map((_, index) => (
                        <Col key={index} style={{ padding: "2px" }}>
                            <Button variant={userLuckyNumber.includes(index + 1) ? 'dark' : 'outline-dark'} style={{ width: "60px" }} onClick={() => addLuckyNumber(index + 1)} >{index + 1}</Button>
                        </Col>
                    ))}
                </Row>
                <Row>
                    <Col><p>Buy Three Star</p></Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <Form.Label><img src='https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1,format=auto/https%3A%2F%2F1384322056-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHVry7OTN1UZzjjhTeYXg%252Ficon%252Ftc2CvK0iK8pBB1anEcAT%252F10990.png%3Falt%3Dmedia%26token%3Dd308595a-a25f-4dc2-bd7e-8237f6d9f8e1' alt="tt token" width="20px"></img>TT</Form.Label>
                            <Form.Control type="number" placeholder="bet amount" value={userBet} onChange={(e) => setUserBet(e.target.value)} />
                            <Form.Label>Your will Earn<BsFillInfoCircleFill onClick={()=>setToastShow(!toastShow)}/></Form.Label>
                            <br></br>
                            <font style={{ fontSize: "48px", paddingRight: "10px", color: "orange" }}>{estimateEarn}</font><font>TT</font>
                            <br></br>
                            <Button variant="primary" size="lg" onClick={startGame}>
                                Let's Bet
                            </Button>
                        </Form>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {popoutShow ? <ResultPopout gameStatus={gameStatus} userLuckyNumber={userLuckyNumber} starNumber={starNumber} userEarn={userEarn} show={show} />
                            : ""}

                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Index;