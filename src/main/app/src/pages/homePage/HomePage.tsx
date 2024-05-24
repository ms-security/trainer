import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './HomePage.css';
import Upload from "../../components/upload/Upload";
import AnalysisCard from "../../components/cards/AnalysisCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCirclePlus, faQuestionCircle, faStar as faStarRegular, faStar as faStarSolid
} from "@fortawesome/free-solid-svg-icons";
import { useAnalysis } from "../../contexts/AnalysisContext";
import Tooltip from "@mui/material/Tooltip";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import HelpContent from "../../components/helpContent/HelpContent";
import '../../components/helpContent/HelpContent.css';

function HomePage() {
    const [isUploadVisible, setIsUploadVisible] = useState(false);
    const [isFavoriteFilterActive, setIsFavoriteFilterActive] = useState(false);
    const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
    const navigate = useNavigate();
    const { analyses, deleteAnalysis, toggleFavoriteStatus, addAnalysis } = useAnalysis();

    const handleUploadButtonClick = () => {
        setIsUploadVisible(!isUploadVisible);
    };

    const handleFavoriteFilterClick = () => {
        setIsFavoriteFilterActive(!isFavoriteFilterActive);
    };

    const handleNewAnalysis = async (file: File, name: string, date: string, extension: string) => {
        try {
            await addAnalysis(file, name, date, extension);
            setIsUploadVisible(!isUploadVisible);
        } catch (error) {
            if (error instanceof Error)
                alert(error.message || 'An error occurred while uploading the file.');
        }
    };

    const handleAnalysisClick = (analysisId: string) => {
        navigate(`/analysis/${analysisId}`);
    };

    const handleFavoriteChange = async (analysisId: string) => {
        await toggleFavoriteStatus(analysisId);
    };

    const handleDeleteAnalysis = async (analysisId: string) => {
        if (window.confirm("Are you sure you want to delete this analysis?")) {
            await deleteAnalysis(analysisId);
        }
    };

    const filteredAnalyses = isFavoriteFilterActive ? analyses.filter(analysis => analysis.isFavorite) : analyses;

    const handleHelpIconClick = () => {
        setIsHelpModalOpen(true);
    };

    const closeModal = () => {
        setIsHelpModalOpen(false);
    };

    const modalStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        padding: '20px 40px 20px 40px'
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
                        <Tooltip title="Add Analysis" arrow>
                            <FontAwesomeIcon icon={faCirclePlus} />
                        </Tooltip>
                    </button>
                    <button onClick={handleFavoriteFilterClick} className="action-btn filter-btn">
                        <Tooltip title="Filter by favorite" arrow>
                            <FontAwesomeIcon icon={isFavoriteFilterActive ? faStarSolid : faStarRegular} className={`star-filter ${isFavoriteFilterActive ? 'active' : ''}`}/>
                        </Tooltip>
                    </button>
                </div>
                <Tooltip title="Help" arrow>
                    <FontAwesomeIcon icon={faQuestionCircle} className="help-icon" onClick={handleHelpIconClick} />
                </Tooltip>
            </div>
            {isUploadVisible && (<Upload onClose={() => setIsUploadVisible(false)} onNewAnalysis={handleNewAnalysis} />)}
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
            <Modal
                open={isHelpModalOpen}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <HelpContent />
                </Box>
            </Modal>
        </div>
    );
}

export default HomePage;
