import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import PrizePopUpIcon from '../images/prizePopUpIcon.png'
import '../styles/prizePopUp.css'

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
                    <font style={{fontSize: "12px"}}>DAILY BONUS</font>
                    <br></br>
                    <font style={{fontSize: "20px"}}>DOUBLE REWARD</font>
                </div>
                
                <div className='modalContent'>
                    <font>Claim once a day.<br></br>Make you win DOUBLE reward.</font>
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