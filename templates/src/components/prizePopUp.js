import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Spinner } from 'react-bootstrap';
import PrizePopUpIcon from '../images/prizePopUpIcon.png'
import '../styles/prizePopUp.css'
import threeStarTokenIcon2 from '../images/3StarToken2.png'
import TTTokenIcon2 from '../images/TTToken2.png'
import { ImCheckmark } from 'react-icons/im'
import axios from 'axios';

function PrizePopUp({ show, setShow, isClaiming, isClaimDone, claimBonus }) {
    const [errorMessage, setErrorMessage] = useState("")
    const handleClose = () => setShow(false);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <div className='modalStyle'>
                    <img src={PrizePopUpIcon} alt="prizePopUp" width="90px" className='popUpIcon'></img>
                    <div className='modalHeader'>
                        <font style={{ fontSize: "12px" }}>DAILY BONUS</font>
                        <br></br>
                        <font style={{ fontSize: "20px" }}>DOUBLE REWARD</font>
                    </div>

                    <div className='modalContent'>
                        <Row style={{ padding: "9px" }}>
                            <Col><font>Claim once a day.<br></br>Make you win DOUBLE reward.</font></Col>
                        </Row>
                        <Row style={{ justifyContent: "center" }}>
                            <Col xs={5} style={{ textAlign: "right" }}><img src={TTTokenIcon2} style={{width: "60px"}}></img></Col>
                            <Col xs={1}><div style={{ borderLeft: "1px solid #0CB1FD", height: "100%" }}></div></Col>
                            <Col xs={5} style={{ textAlign: "left" }}><img src={threeStarTokenIcon2} style={{width: "60px"}}></img></Col>
                        </Row>
                        <Row style={{ padding: "9px" }}>
                            <Col>
                                <font>Spend your original BET and get <strong>TWICE</strong> as much TT or 3Star.</font>
                            </Col>
                        </Row>
                    </div>

                    <div className='claimDiv'>
                        <font style={{ color: "red", fontSize: "12px" }}>{errorMessage}</font>
                        <br></br>
                        {isClaimDone ?
                            <button className='disableBt' disabled><ImCheckmark style={{paddingBottom: "3px"}} />CLAIM BONUS</button>
                            : isClaiming
                                ? <button><Spinner animation="border" style={{ color: "#0AB700", width: "1rem", height: "1rem" }} />CLAIM BONUS</button>
                                : <button onClick={claimBonus}>CLAIM BONUS</button>}

                    </div>
                </div>

            </Modal>
        </>
    );
}

export default PrizePopUp;