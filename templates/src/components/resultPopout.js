import Money from '../images/money.gif';
import Win from '../images/win.gif';
import Lose from '../images/lose.gif';
import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function ResultPopout(gameInfo) {

    const [width, setWidth] = useState(450)
    const handleClose = () => {
        if(gameStatus != "Drawing..."){
            window.location.reload()
        }
    };

    const gameStatus = gameInfo['gameStatus']
    const userLuckyNumber = gameInfo['userLuckyNumber']
    const userEarn = gameInfo['userEarn']
    const starNumber = gameInfo['starNumber']

    const resizeImage = () => {
        if (window.innerWidth < 280) {
            setWidth(200)
        } else if (window.innerWidth < 310) {
            setWidth(250)
        } else if (window.innerWidth < 400) {
            setWidth(300)
        } else if (window.innerWidth < 450) {
            setWidth(350)
        } else if (window.innerWidth < 500) {
            setWidth(400)
        } else if (window.innerWidth >= 450) {
            setWidth(450)
        }
    }

    const ModalRender = () => {
        if (gameStatus === "Drawing...") {
            return (
                <>
                    <Modal.Body style={{ textAlign: "center" }}>
                        <img src={Money} width={width}></img>
                    </Modal.Body>
                </>
            )
        } else if (gameStatus === "You Win!") {
            return (
                <>
                    <Modal.Body style={{ textAlign: "center" }}>
                        <img src={Win} width={150}></img>
                        <p>You earn : <font style={{ fontSize: '48px' }}> {userEarn} </font> TT</p>
                        <p><strong>Star number is: 
                            {starNumber.length === undefined || 0 ? ""
                                : starNumber.map((number) =>
                                    <font>{number}, </font>
                                )}
                        </strong></p>
                    </Modal.Body>
                </>
            )
        } else if (gameStatus === "You Lose") {
            return (
                <>
                    <Modal.Body style={{ textAlign: "center" }}>
                        <img src={Lose} width={width - 100}></img>
                        <p><strong>Star number is: 
                            {starNumber.length === undefined || 0 ? ""
                                : starNumber.map((number) =>
                                    <font>{number}, </font>
                                )}
                        </strong></p>
                    </Modal.Body>
                </>
            )
        }

    }

    useEffect(() => {
        resizeImage();
        window.addEventListener('resize', resizeImage)
    }, [])


    return (
        <>
            <Modal show={true} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{gameStatus}</Modal.Title>
                </Modal.Header>

                <ModalRender />
                <Modal.Footer>
                    <p>Your lucky number is:
                        {userLuckyNumber.length === undefined || 0 ? ""
                            : userLuckyNumber.map((number) =>
                                <font>{number}, </font>
                            )}
                    </p>
                </Modal.Footer>
            </Modal>


        </>

    );
}

export default ResultPopout;