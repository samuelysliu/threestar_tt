import { Row, Col } from 'react-bootstrap';
import { TiStarFullOutline } from 'react-icons/ti';

function WinRule() {

    return (
        <>
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
        </>
    );
}

export default WinRule;