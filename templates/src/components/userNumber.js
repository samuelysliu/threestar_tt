import { TiStarFullOutline } from 'react-icons/ti';

function UserNumber(userNumberInfo) {
    let userColor, bcColor
    if (userNumberInfo.userColor === "2") {
        userColor = "#9E6700"
        bcColor = "FDCE20"
    } else {
        userColor = "#07AAF4"
        bcColor = "#FFFFFF"
    }
    const userLuckyNumber = userNumberInfo.userLuckyNumber

    const userNumberStyle = {
        transform: "translate(0%, -150%)",
        color: userColor,
        
        iconStyle:{
            color: bcColor
        }
    }

    return (
        <>
            <TiStarFullOutline size={56} style={userNumberStyle.iconStyle} />
            <div style={userNumberStyle}><strong>{userLuckyNumber}</strong></div>
        </>
    );
}

export default UserNumber;