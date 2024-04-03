import React from 'react';
import './SideBar.css';
import {Analysis} from "../../../interfaces/Analysis";

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
                &gt;
            </button>
        </div>
    );
};

export default Sidebar;
