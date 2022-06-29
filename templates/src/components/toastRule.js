import { Toast, ToastContainer } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';

function ToastRule({ sendToastShowStatus }) {
    const [toastShow, setToastShow] = useState(sendToastShowStatus())
    const controlToast = () => setToastShow(false);

    useEffect(() => {
        setToastShow(sendToastShowStatus())
    }, [sendToastShowStatus()])

   useEffect(() => {
        sendToastShowStatus(toastShow)
    }, [toastShow])

    return (
        <ToastContainer className="p-3" position={'bottom-center'}>
            <Toast show={toastShow} onClose={controlToast} autohide>
                <Toast.Header>
                    <strong className="me-auto">Rules</strong>
                    <small>10% as fee</small>
                </Toast.Header>
                <Toast.Body style={{ textAlign: 'left' }}>You can choose 5 lucky numbers from 1 to 80. The system will randomly generate 20 unique numbers (star number) from 1 to 80.
                    <br></br>
                    If your lucky number matches three star number, you'll get 2x, four equals 20x, and five equals 100x.
                </Toast.Body>
            </Toast>
        </ToastContainer>
    );
}

export default ToastRule;