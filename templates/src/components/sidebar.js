import '../styles/sidebar.css';
import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'


function Sidebar() {

    const [isOpen, setIsopen] = useState(false);

    const ToggleSidebar = () => {
        isOpen === true ? setIsopen(false) : setIsopen(true);
    }

    const [userInfo, setUserInfo] = useState({ account: '', balance: '' });

    return (
        <div className="container-fluid" style={{ backgroundColor: "#01AFFB" }}>
            <nav className="navbar navbar-expand-lg navbar-light shadow-md">
                <font style={{ fontSize: "28px", color: "white", position: "fixed", left: "50%", marginLeft: "-60px" }}><strong>TT 3Star</strong></font>
                <div className="form-inline ml-auto">
                    <div className="btn btn-primary" onClick={ToggleSidebar} >
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
                    </ul>
                </div>
            </div>
            <div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
        </div>
    );
}

export default Sidebar;