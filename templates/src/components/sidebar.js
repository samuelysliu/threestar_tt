import '../styles/sidebar.css';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'
import NewIcon from '../images/newIcon.png'

function Sidebar({headerColor}) {
    const [isOpen, setIsopen] = useState(false);

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }

    const backHome = () => {
        window.location.href="/"
    }

    return (
        <div className="container-fluid" style={{ backgroundColor: headerColor, position:"sticky", top: "0px", zIndex: "99" }}>
            <nav className="navbar navbar-expand-lg navbar-light shadow-md">
                <font style={{ fontSize: "28px", color: "white", position: "absolute", left: "50%", marginLeft: "-60px", cursor: "pointer" }} onClick={backHome}><strong>TT 3Star</strong></font>
                <div className="form-inline ml-auto">
                    <div className="btn btn-primary" style={{borderColor: headerColor, backgroundColor: headerColor}} onClick={ToggleSidebar} >
                        <FaBars />
                    </div>
                </div>
            </nav>
            <div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
                <div className="sd-header">
                    <h4 className="mb-0"></h4>
                    <div className="btn" onClick={ToggleSidebar}>
                        <FaTimes style={{ color: "#056AE1" }} size={24} />
                    </div>
                </div>
                <div className="sd-body">
                    <ul>
                        <li><a className="sd-link" href='/'>Home</a></li>
                        <li><a className="sd-link" href='/dividend'>Dividend</a></li>
                        {/*<li><a className="sd-link" href='/lpDividend'>Hyper Dividend<img src={NewIcon} style={{paddingLeft: "5px", width: "35px"}}></img></a></li>*/}
                        <li><a className="sd-link" href='/bonus'>Bonus<img src={NewIcon} style={{paddingLeft: "5px", width: "35px"}}></img></a></li>
                        <li><a className="sd-link" href='https://twitter.com/3star_tt'>Twitter</a></li>
                        <li><a className="sd-link" href='https://t.me/ThreeStarDapp'>Telegram</a></li>
                    </ul>
                </div>
            </div>
            <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
    );
}

export default Sidebar;