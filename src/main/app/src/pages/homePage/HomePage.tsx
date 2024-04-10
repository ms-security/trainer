import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './HomePage.css';
import Upload from "../../components/upload/Upload";
import { Analysis } from "../../interfaces/Analysis";
import AnalysisCard from "../../components/cards/AnalysisCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faFilter } from "@fortawesome/free-solid-svg-icons";
import WebController from "../../application/WebController";

function HomePage() {

    // State for managing the visibility of the upload component
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    // State for storing the list of analyses
    const [analysisList, setAnalysisList] = useState<Analysis[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
       fetchAnalyses().then(r => console.log("Analyses fetched"));
    }, []);  // The empty dependency array ensures this effect runs only once on mount

    const fetchAnalyses = async () => {
        try {
            const analyses = await WebController.fetchAllAnalyses();
            setAnalysisList(analyses); // Update the state with the fetched analyses
        } catch (error) {
            console.error('Failed to fetch analyses:', error);
            // Optionally, handle the error e.g., show an error message to the user
        }
    };
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
    const handleFavoriteChange = async (analysisId: number) => {
        try {
            await WebController.toggleFavoriteStatus(analysisId);
            await fetchAnalyses();
        } catch (error) {
            console.error('Failed to update favorite status:', error);
        }
    };

    const handleDeleteAnalysis = async (analysisId: number) => {
        // Confirm deletion
        const isConfirmed = window.confirm("Are you sure you want to delete this analysis?");
        if (isConfirmed) {
            try {
                await WebController.deleteAnalysis(analysisId); // Assume you have this method in your WebController
                // Filter out the deleted analysis from your list
                setAnalysisList(currentList => currentList.filter(analysis => analysis.id !== analysisId));
            } catch (error) {
                console.error('Failed to delete analysis:', error);
                // Optionally, handle the error e.g., show an error message to the user
            }
        }
    };

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
                    analysisList.map((analysis) => (
                        <AnalysisCard
                            name={analysis.name}
                            date={analysis.date}
                            isFavorite={analysis.isFavorite}
                            isTriageValid={analysis.isTriageValid}
                            onFavoriteChange={() => handleFavoriteChange(analysis.id)}
                            onClick={() => handleAnalysisClick(analysis)}
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
