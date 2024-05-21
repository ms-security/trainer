import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './HomePage.css';
import Upload from "../../components/upload/Upload";
import AnalysisCard from "../../components/cards/AnalysisCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePlus,
    faFilter,
    faStar as faStarRegular,
    faStar as faStarSolid
} from "@fortawesome/free-solid-svg-icons";
import { useAnalysis } from "../../contexts/AnalysisContext";

function HomePage() {
    // State for managing the visibility of the upload component
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    // State for managing the favorite filter
    const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);
    const navigate = useNavigate();
    const { analyses, deleteAnalysis, toggleFavoriteStatus, addAnalysis } = useAnalysis();

    // Function to toggle the visibility of the upload component
    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    // Function to toggle the favorite filter
    const handleFavoriteFilterClick = () => {
        setIsFavoriteFilterActive(!isFavoriteFilterActive);
    };

    // Function to handle a new analysis added by the upload component
    const handleNewAnalysis = async (file: File, name: string, date: string, extension: string) => {
        try {
            await addAnalysis(file, name, date, extension);
            setIsUploadVisible(!isUploadVisible);
        } catch (error) {
            if (error instanceof Error)
                alert(error.message || 'An error occurred while uploading the file.');
        }
    };

    // Function for handling click events on an analysis card
    const handleAnalysisClick = (analysisId: string) => {
        navigate(`/analysis/${analysisId}`);
    };

    // Function to handle changes in analysis favorite status
    const handleFavoriteChange = async (analysisId: string) => {
        await toggleFavoriteStatus(analysisId);
    };

    // Function to handle deleting an analysis
    const handleDeleteAnalysis = async (analysisId: string) => {
        if (window.confirm("Are you sure you want to delete this analysis?")) {
            await deleteAnalysis(analysisId);
        }
    };

    // Filter analyses based on favorite status
    const filteredAnalyses = isFavoriteFilterActive
        ? analyses.filter(analysis => analysis.isFavorite)
        : analyses;

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
                    <button onClick={handleFavoriteFilterClick} className="action-btn filter-btn">
                        <FontAwesomeIcon
                            icon={isFavoriteFilterActive ? faStarSolid : faStarRegular}
                            className={`star-filter ${isFavoriteFilterActive ? 'active' : ''}`}
                        />
                    </button>
                </div>
            </div>
            {/* Conditionally render the Upload component based on its visibility state */}
            {isUploadVisible && (<Upload onClose={() => setIsUploadVisible(false)} onNewAnalysis={handleNewAnalysis} />)}
            {/* Grid container for analysis cards. If there are no analyses, show a message. */}
            <div className={`analysis-grid ${filteredAnalyses.length === 0 ? 'center-content' : ''}`}>
                {filteredAnalyses.length > 0 ? (
                    filteredAnalyses.map((analysis) => (
                        <AnalysisCard
                            key={analysis.id}
                            name={analysis.name}
                            smells={analysis.smells}
                            date={analysis.date}
                            isFavorite={analysis.isFavorite}
                            onFavoriteChange={() => handleFavoriteChange(analysis.id)}
                            onClick={() => handleAnalysisClick(analysis.id)}
                            onDelete={() => handleDeleteAnalysis(analysis.id)}
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
