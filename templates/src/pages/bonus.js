import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Web3 from 'web3'
import axios from 'axios';
import Sidebar from '../components/sidebar';
import { PathController } from '../components/pathController';
import { ConnectWallet } from '../components/connectWallet'
import { IoChevronBackOutline } from 'react-icons/io5'
import '../styles/bonus.css'
import PrizePopUpIcon from '../images/prizePopUpIcon.png'
import { BsInfoCircleFill } from 'react-icons/bs';
import PrizePopUp from '../components/prizePopUp';
import { ImCheckmark } from 'react-icons/im'

function Bonus({ userInfo, connectWallet, token }) {
    const metaConnect = new ConnectWallet()
    const web3 = new Web3(window.ethereum);
    const [prizePopUpShow, setPrizePopUpShow] = useState(false)
    const [isClaiming, setIsClaiming] = useState(false)
    const [isClaimDone, setIsClaimDone] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const [apiPath, setApiPath] = useState("")

    const loadWeb3 = () => {
        metaConnect.getChainId().then((value) => {
            const pathController = new PathController(value)
            setApiPath(pathController.getApiPath())
        }).catch(error => {
            console.log(error)
        })
    }

    const openPopUp = () => {
        setPrizePopUpShow(true)
    }

    const claimBonus = () => {
        if (userInfo.account.length === 0) {
            connectWallet()
            setErrorMessage("Invalid Wallet")
            setTimeout(() => {
                setErrorMessage("")
            }, 6000)
        } else {
            setIsClaiming(true)
            axios.post(apiPath + "/claimPrize", { "prizeType": "double bonus", "address": userInfo.account }).then(res => {
                setIsClaimDone(true)
            }).catch(error => console.log(error))
        }
    }

    const checkTodayHasClaim = () => {
        axios.get(apiPath + "/claimPrize?prizeType=double bonus&address=" + userInfo.account).then(res => {
            console.log(res["data"]["result"])
            setIsClaimDone(!res["data"]["result"])
        }).catch(error => { console.log(error) })
    }

    useEffect(() => {
        loadWeb3();
        connectWallet()
    }, [])

    useEffect(() => {
        loadWeb3();
    }, [token])

    useEffect(() => {
        if (userInfo.account.length !== 0) {
            checkTodayHasClaim()
        }
    }, [userInfo])


    return (
        <>
            <Sidebar />
            <PrizePopUp show={prizePopUpShow} setShow={setPrizePopUpShow} isClaiming={isClaiming} isClaimDone={isClaimDone} claimBonus={claimBonus} />
            <Container style={{ textAlign: "center", marginTop: "20px", maxWidth: "720px" }}>
                <Row>
                    <Col xs={{ span: 1, offset: 0 }}><a href='/'><IoChevronBackOutline className='backIcon' size="20px" /></a></Col>
                </Row>
                <Row className="prizeCard">
                    <Col xs={{ span: 1 }} style={{ paddingLeft: "0px", paddingRight: "40px" }}><img src={PrizePopUpIcon} width="50px"></img></Col>
                    <Col xs={{ span: 7 }}>
                        <font style={{ fontSize: "12px" }}>DAILY BONUS</font>
                        <br></br>
                        <font style={{ fontSize: "16px" }}><strong>DOUBLE REWARD <BsInfoCircleFill style={{ color: "#27C7FA" }} onClick={openPopUp} /> </strong></font>
                    </Col>
                    <Col xs={{ span: 3 }} style={{ display: "flex", justifyContent: "center", flexDirection: "column", paddingRight: "0px", paddingLeft: "0px", textAlign: "center" }}>
                        <font style={{ fontSize: "12px", color: "red" }}>{errorMessage}</font>
                        {isClaimDone ?
                            <button className='disableBt' disabled><ImCheckmark />CLAIM</button>
                            : isClaiming
                                ? <button><Spinner animation="border" style={{ color: "#0AB700", width: "12px", height: "12px", marginRight: "2px" }} />CLAIM</button>
                                : <button onClick={claimBonus}>CLAIM</button>}

                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Bonus;