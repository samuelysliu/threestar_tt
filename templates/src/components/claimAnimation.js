import React, { useState, useEffect } from 'react';
import { css } from '@emotion/css'
import { Container, Row, Col } from 'react-bootstrap';
import MoneyBox from '../images/moneyBox.png'
import MoneyDown from '../images/moneyDown.gif';

function ClaimAnimation({ claimNumber }) {
    const TTTokenImage =
        'https://www.gitbook.com/cdn-cgi/image/width=40,height=40,fit=contain,dpr=1.25,format=auto/https%3A%2F%2F1384322056-files.gitbook.io%2F~%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FHVry7OTN1UZzjjhTeYXg%252Ficon%252Ftc2CvK0iK8pBB1anEcAT%252F10990.png%3Falt%3Dmedia%26token%3Dd308595a-a25f-4dc2-bd7e-8237f6d9f8e1';

    return (
        <div className={style}>
            <div className='backgroundOverlay'>
                <Container className='animationDiv'>
                    <Row className="iconDiv">
                        <Col><img src={MoneyBox} alt="moneyBox" style={{ width: "90px" }}></img></Col>
                    </Row>
                    <div className='cardFirst'>
                        <div className='cardSecond'>
                            <Row style={{paddingTop: "15px"}}>
                                <Col><font className="title">3 Star Dividend</font></Col>
                            </Row>
                            <div className='numberDiv'>
                                <img src={TTTokenImage} alt="tttoken" style={{ width: "28px" }}></img><font> {claimNumber}</font>
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col><img src={MoneyDown} alt="moneyDown" style={{width: "220px"}}></img></Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}

export default ClaimAnimation;

const style = css`
.backgroundOverlay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    transition: 0.5s;
    z-index: 999;
}

.animationDiv{
    text-align: center;
    position: relative;
    top: 20%;
    width: 70%;
}

.iconDiv{
    position: relative;
    top: 20px;
}

.cardFirst{
    background-color: #3250DE;
    height: 120px;
    border-radius: 15px;
}

.cardSecond{
    background-color: #94A7FF;
    height: 85%;
    border-radius: 15px;
    box-shadow: 0px 15px 0px 0px #5E75E0;
}

.title{
    color: white;
    font-weight: bolder;
    text-shadow: 0.1em 0.1em 0.05em #B7B7B7;
    font-size: 20px;
}

.numberDiv{
    background-color: white;
    border-radius: 10px;
    margin-left: 5px;
    margin-right: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    color: #5E75E0;
    font-size: 18px;
    font-weight: 500;
}
`