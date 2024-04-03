import React, { useState } from 'react';
import TopBar from './topBar/TopBar';
import Sidebar from './sideBar/SideBar'; // Assicurati di avere il percorso corretto
import './Home.css';
import Upload from "./upload/Upload";

function HomePage() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isUploadVisible, setIsUploadVisible] = useState(false);

    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    return (
        <div className={`home-container ${!sidebarVisible ? 'sidebar-hidden' : ''}`}>
            <TopBar />
            <Sidebar isVisible={sidebarVisible} toggleSidebar={() => setSidebarVisible(!sidebarVisible)} />
            <div className="content">
                <h2>Seleziona una analisi o aggiungine una</h2>
                <button onClick={handleUploadButtonClick}>
                    Nuova analisi
                </button>
                {isUploadVisible && (
                    <Upload onClose={() => setIsUploadVisible(false)}/>
                )}
            </div>
        </div>
    );
}

export default HomePage;
