import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Assicurati di avere react-router-dom
import TopBar from '../../components/topBar/TopBar';
import './HomePage.css';
import Upload from "../../components/upload/Upload";
import {Analysis} from "../../interfaces/Analysis";
import AnalysisCard from "../../components/cards/AnalysisCard";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCirclePlus} from "@fortawesome/free-solid-svg-icons";
import {faFilter} from "@fortawesome/free-solid-svg-icons";

function HomePage() {
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    const [analysisList, setAnalysisList] = useState<Analysis[]>([]);
    const navigate = useNavigate();

    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    const handleNewAnalysis = (newAnalysis: Analysis) => {
        setAnalysisList(prev => [...prev, newAnalysis]);
        setIsUploadVisible(false); // Chiudi il componente di upload dopo aver ricevuto i dati
    };

    // Funzione per gestire il click su una card di analisi
    const handleAnalysisClick = (analysis: Analysis) => {
        navigate(`/analysis/${analysis.id}`, { state: { analysis } });
    };

    const handleFavoriteChange = (isFavourite: boolean) => {

    }

    return (
        <div className="home-container">
            <TopBar />
            <div className="content-header">
                <div className="title-container">
                    <h1 className="main-title">My Analysis</h1>
                    <p className="subtitle">Select an analysis or upload one</p>
                </div>
                <div className="buttons-container">
                    <button onClick={handleUploadButtonClick} className="action-btn upload-btn">
                        <FontAwesomeIcon icon = {faCirclePlus} />
                    </button>
                    <button className="action-btn filter-btn">
                        <FontAwesomeIcon icon = {faFilter} />
                    </button>
                </div>
            </div>
            {isUploadVisible && (
                <Upload onClose={() => setIsUploadVisible(false)} onNewAnalysis={handleNewAnalysis}/>
            )}
            <div className="analysis-grid">
                {analysisList.length > 0 ? (
                    analysisList.map((analysis, index) => (
                        <AnalysisCard
                            key={index}
                            name={analysis.name}
                            date={analysis.name} // Utilizza la descrizione corretta qui
                            isFavorite={false}
                            onFavoriteChange={() => handleFavoriteChange(true)}
                            onClick={() => handleAnalysisClick(analysis)}
                        />
                    ))
                ) : (
                    <p>No analysis uploaded. Upload an analysis to start.</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
