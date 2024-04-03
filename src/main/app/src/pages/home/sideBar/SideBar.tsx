import React from 'react';
import './SideBar.css';

interface SidebarProps {
    isVisible: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, toggleSidebar }) => {
    return (
        <div className={`sidebar-wrapper ${!isVisible ? 'hidden' : ''}`}>
            <div className="sidebar">
                {/* Contenuti della sidebar */}
            </div>
            <button onClick={toggleSidebar} className="toggle-button">
                &gt;
            </button>
        </div>
    );
};

export default Sidebar;
