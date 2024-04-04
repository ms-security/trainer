import React from 'react';
import './SideBar.css';
import {Analysis} from "../../../interfaces/Analysis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft} from "@fortawesome/free-solid-svg-icons";

interface SidebarProps {
    isVisible: boolean;
    toggleSidebar: () => void;
    analysisList: Analysis[];
    onSelectAnalysis: (analysisId: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, toggleSidebar, analysisList, onSelectAnalysis }) => {
    return (
        <div className={`sidebar-wrapper ${!isVisible ? 'hidden' : ''}`}>
            <div className="sidebar">
                {analysisList.map((analysis, index) => (
                    <div key={index} onClick={() => onSelectAnalysis(analysis.id)} className="analisi-item">
                        Analisi {index + 1}
                    </div>
                ))}
            </div>
            <button onClick={toggleSidebar} className="toggle-button">
                <FontAwesomeIcon icon={faArrowLeft}  className={`arrow-icon ${!isVisible ? 'flipped' : ''}`}/>
            </button>
        </div>
    );
};

export default Sidebar;
