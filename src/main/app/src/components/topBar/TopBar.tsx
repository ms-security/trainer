import React from 'react';
import './TopBar.css';
import logoImage from './SSV_LOGO_BLU.jpg';
import {useNavigate} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome, faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import Tooltip from "@mui/material/Tooltip";


interface TopBarProps {
    onHomeClick?: () => void;  // Make this prop optional
}

const TopBar: React.FC<TopBarProps> = ({ onHomeClick }) => {
    const navigate = useNavigate();

    const handleHomeLogoClick = () => {
        if (onHomeClick) {
            onHomeClick();  // Call the sync function if provided
        }
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
            <Tooltip title="Home" arrow>
                <FontAwesomeIcon icon={faHome} size="2x" className="home-button" onClick={handleHomeLogoClick} />
            </Tooltip>
            <Tooltip title="Help" arrow>
                <FontAwesomeIcon icon={faQuestionCircle} size="2x" className="help-icon" />
            </Tooltip>
        </div>
    );
};

export default TopBar;
