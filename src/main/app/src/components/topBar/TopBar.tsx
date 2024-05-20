// TopBar.tsx
import React from 'react';
import './TopBar.css'; // Assicurati di creare questo file CSS
import logoImage from './SSV_logo.png';
import {useNavigate} from "react-router-dom";

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const handleLogoClick = () => {
        console.log("return to home page");
        navigate(`/`);
    };
    return (
        <div className="top-bar_container">
            <div className="top-bar_logo" onClick={() => handleLogoClick()}>
                <img src={logoImage} alt="Logo" />
            </div>
            <div className="top-bar_title">
                <h1>SECURITY SMELLS VISUALIZER</h1>
            </div>
        </div>
    );
};

export default TopBar;
