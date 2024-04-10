import React from 'react';
import './SideBar.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
    isVisible: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, toggleSidebar}) => {
    return (
        <div className={`sidebar-wrapper ${!isVisible ? 'hidden' : ''}`}>
            <div className="sidebar">
                Legenda...
            </div>
            <button onClick={toggleSidebar} className="toggle-button">
                <FontAwesomeIcon icon={faArrowLeft}  className={`arrow-icon ${!isVisible ? 'flipped' : ''}`}/>
            </button>
        </div>
    );
};

export default Sidebar;
