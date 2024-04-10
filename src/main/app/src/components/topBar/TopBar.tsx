// TopBar.tsx
import React from 'react';
import './TopBar.css'; // Assicurati di creare questo file CSS
import logoImage from './SSV_logo.png';

const TopBar: React.FC = () => {
    return (
        <div className="top-bar">
            <div className="logo">
                <img src={logoImage} alt="Logo" />
            </div>
            <div className="title">
                <h1>SECURITY SMELLS VISUALIZER</h1>
            </div>
        </div>
    );
};

export default TopBar;
