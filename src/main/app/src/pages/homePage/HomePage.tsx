import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './HomePage.css';
import Upload from "../../components/upload/Upload";
import { Analysis } from "../../interfaces/Analysis";
import AnalysisCard from "../../components/cards/AnalysisCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faFilter } from "@fortawesome/free-solid-svg-icons";

function HomePage() {
    // State for managing the visibility of the upload component
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    // State for storing the list of analyses
    const [analysisList, setAnalysisList] = useState<Analysis[]>([]);
    const navigate = useNavigate();

    // Function to toggle the visibility of the upload component
    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    // Function to handle a new analysis added by the upload component
    const handleNewAnalysis = (newAnalysis: Analysis) => {
        setAnalysisList(prev => [...prev, newAnalysis]);
    };

    // Function for handling click events on an analysis card
    const handleAnalysisClick = (analysis: Analysis) => {
        navigate(`/analysis/${analysis.id}`, { state: { analysis } });
    };

    // Placeholder function to handle changes in analysis favorite status
    const handleFavoriteChange = (isFavourite: boolean) => {
        // Future implementation for handling favorite status change
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
                        <FontAwesomeIcon icon={faCirclePlus} />
                    </button>
                    <button className="action-btn filter-btn">
                        <FontAwesomeIcon icon={faFilter} />
                    </button>
                </div>
            </div>
            {/* Conditionally render the Upload component based on its visibility state */}
            {isUploadVisible && (
                <Upload onClose={() => setIsUploadVisible(false)} onNewAnalysis={handleNewAnalysis} />
            )}
            {/* Grid container for analysis cards. If there are no analyses, show a message. */}
            <div className={`analysis-grid ${analysisList.length === 0 ? 'center-content' : ''}`}>
                {analysisList.length > 0 ? (
                    analysisList.map((analysis, index) => (
                        <AnalysisCard
                            key={index}
                            name={analysis.name}
                            date={analysis.name}
                            isFavorite={false}
                            onFavoriteChange={() => handleFavoriteChange(true)}
                            onClick={() => handleAnalysisClick(analysis)}
                        />
                    ))
                ) : (
                    <p className="no-analysis-message">No analysis uploaded. Upload an analysis to start.</p>
                )}
            </div>
        </div>
    );
}

export default HomePage;
