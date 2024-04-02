// HomePage.tsx
import React, { useState } from 'react';
import TopBar from './topBar/TopBar';
import './Home.css'; // Assicurati di creare questo file CSS

function HomePage() {
    const [sidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    return (
        <div className="home-container">
            <TopBar />
            <div className={`sidebar-wrapper ${!sidebarVisible ? 'hidden' : ''}`}>
                <div className="sidebar">
                    {/* Contenuti della sidebar */}
                </div>
                <button onClick={toggleSidebar} className="toggle-button">
                    &gt;
                </button>
            </div>
            <div className="content">
                {/* Il resto del tuo contenuto principale qui */}
            </div>
        </div>
    );
}

export default HomePage;
