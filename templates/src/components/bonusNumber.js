import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Spinner } from 'react-bootstrap';
import BonusIcon from '../images/bonusIcon.png';

function BonusNumber({ number }) {
  return (
    <font>
      {number}
      <img
        src={BonusIcon}
        style={{
          position: 'absolute',
          bottom: '100%',
          left: '70%',
          width: '40px',
        }}
      ></img>
    </font>
  );
}

export default BonusNumber;
