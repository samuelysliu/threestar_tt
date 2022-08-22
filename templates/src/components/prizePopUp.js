import React, { useState } from 'react';
import { Modal, Row, Col } from 'react-bootstrap';
import PrizePopUpIcon from '../images/prizePopUpIcon.png'
import '../styles/prizePopUp.css'
import threeStarTokenIcon2 from '../images/3StarToken2.png'
import TTTokenIcon2 from '../images/TTToken2.png'

function PrizePopUp() {
    const [show, setShow] = useState(true);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <div className='modalStyle'>
                    <img src={PrizePopUpIcon} alt="prizePopUp" width="80px" className='popUpIcon'></img>
                    <div className='modalHeader'>
                        <font style={{ fontSize: "12px" }}>DAILY BONUS</font>
                        <br></br>
                        <font style={{ fontSize: "20px" }}>DOUBLE REWARD</font>
                    </div>

                    <div className='modalContent'>
                        <Row>
                            <Col><font>Claim once a day.<br></br>Make you win DOUBLE reward.</font></Col>
                        </Row>
                        <Row>
                            <Col xs={5} style={{textAlign:"right"}}><img src={TTTokenIcon2}></img></Col>
                            <Col xs={1}><div style={{ borderLeft: "1px solid #0CB1FD", height: "100%" }}></div></Col>
                            <Col xs={5} style={{textAlign:"left"}}><img src={threeStarTokenIcon2}></img></Col>
                        </Row>
                    </div>
                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    <Modal.Footer>
                        <button onClick={handleClose}>
                            Close
                        </button>
                    </Modal.Footer>
                </div>

            </Modal>
        </>
    );
}

export default PrizePopUp;