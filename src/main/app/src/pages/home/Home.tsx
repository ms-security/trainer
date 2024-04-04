import React, { useState } from 'react';
import TopBar from './topBar/TopBar';
import Sidebar from './sideBar/SideBar'; // Assicurati di avere il percorso corretto
import './Home.css';
import Upload from "./upload/Upload";
import {Analysis} from "../../interfaces/Analysis";
import SmellCard from "./components/SmellCard";

function HomePage() {
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    const [analysisList, setAnalysisList] = useState<Analysis[]>([]);
    const [selectedAnalysis, setSelectedAnalysis] = useState<Analysis | null>(null);

    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    const handleNewAnalysis = (newAnalysis: Analysis) => {
        setAnalysisList(prev => [...prev, newAnalysis]);
        setIsUploadVisible(false); // Chiudi il componente di upload dopo aver ricevuto i dati
    };

    const handleAnalysisSelection = (analysisId: number) => {
        const analysis = analysisList.find(a => a.id === analysisId);
        if (analysis !== undefined) {
            setSelectedAnalysis(analysis); // analisi trovata
        } else {
            setSelectedAnalysis(null); // nessuna analisi trovata, imposta lo stato su null
        }
    };

    return (
        <div className={`home-container ${!sidebarVisible ? 'sidebar-hidden' : ''}`}>
            <TopBar />
            <Sidebar
                isVisible={sidebarVisible}
                toggleSidebar={() => setSidebarVisible(!sidebarVisible)}
                analysisList={analysisList}
                onSelectAnalysis={handleAnalysisSelection}
            />
            <div className="content">
                {isUploadVisible && (
                    <Upload onClose={() => setIsUploadVisible(false)} onNewAnalysis={handleNewAnalysis}/>
                )}
                {selectedAnalysis ? (
                    <div>
                        {selectedAnalysis.smells.map((smell, index) => (
                            <SmellCard key={index} name={smell.name} description={smell.description} />
                        ))}
                    </div>
                ) : (
                    <>
                        <h2>Seleziona una analisi o aggiungine una</h2>
                        <button onClick={handleUploadButtonClick}>
                            Nuova analisi
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default HomePage;
