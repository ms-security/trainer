// HomePage.tsx
import React, { useState } from 'react';
import TopBar from './topBar/TopBar';
import './Home.css'; // Assicurati di creare questo file CSS
import './upload/Upload';
import Upload from "./upload/Upload";

function HomePage() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isUploadVisible, setIsUploadVisible] = useState(false);

    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

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
                <h2>Seleziona una analisi o aggiungine una</h2>
                <button onClick={() => setIsUploadVisible(true)}>
                    Nuova analisi
                </button>
                {isUploadVisible && (
                    <Upload onClose={() => setIsUploadVisible(false)} />
                )}
            </div>
        </div>
    );
}

export default HomePage;
