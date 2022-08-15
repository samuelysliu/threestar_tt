import { TbCircleDashed } from 'react-icons/tb';

function BetCircle(betInfo) {
    let bcColor
    if(betInfo.bcColor === "2"){
        bcColor = "#14C7FA"
    }else{
        bcColor = "#056AE1"
    }
    const betNumber = betInfo.betNumber

    const betCircleStyle = {
        backgroundColor: bcColor,
        //backgroundColor: "#056AE1",
        //backgroundColor : "#14C7FA",
        borderRadius: "50%",
        width: "50px",
        height: "50px",

        betStyle: {
            transform: "translate(0%, -180%)",
            fontSize: "12px"
        }
    }

    return (
        <div style={betCircleStyle}>
            <TbCircleDashed size={48} />
            <div style={betCircleStyle.betStyle}><strong>{betNumber}</strong></div>
        </div>
    );
}

export default BetCircle;