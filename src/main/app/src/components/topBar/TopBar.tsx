// TopBar.tsx
import React from 'react';
import './TopBar.css'; // Assicurati di creare questo file CSS
import logoImage from './SSV_logo.png';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

const TopBar: React.FC = () => {
    const navigate = useNavigate();

    const handleHomeLogoClick = () => {
        navigate(`/`);
    };
    return (
        <div className="top-bar_container">
            <div className="top-bar_logo">
                <img src={logoImage} alt="Logo" />
            </div>
            <div className="top-bar_title">
                <h1>SECURITY SMELLS VISUALIZER</h1>
            </div>
            <FontAwesomeIcon icon={faHome} size="2x" className="home-button" onClick={handleHomeLogoClick} />
            <FontAwesomeIcon icon={faQuestionCircle} size="2x" className="help-icon" />
        </div>
    );
};

export default TopBar;
