// Importa useLocation da react-router-dom per accedere allo stato passato attraverso il routing
import React, { useState } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import Sidebar from '../../components/sideBar/SideBar';
import SmellCard from '../../components/cards/SmellCard';
import { Analysis } from "../../interfaces/Analysis";
import './AnalysisPage.css';
import {Smell} from "../../interfaces/Smell"; // Assicurati di creare questo file CSS e di importarlo
import TriageBanner from '../../components/triageBanner/TriageBanner';
import MicroserviceForm from "../../components/inputForm/MicroserviceForm";
import {Box, Modal} from "@mui/material";
import {Microservice} from "../../interfaces/Microservice"; // Assicurati di creare questo file CSS e di importarlo

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400, // Set the width of the modal or use a percentage
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4, // Padding inside the modal
};

const AnalysisPage = () => {
    // Use useLocation to access the state passed from the HomePage
    const location = useLocation();

    const navigate = useNavigate();

    // Extract the 'analysis' data from the location state
    const { analysis } = location.state as { analysis: Analysis };

    // State to control the visibility of the sidebar
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const handleSmellClick = (analysis: Analysis, smell: Smell) => {
        navigate(`/analysis/${analysis.id}/smell/${smell.id}`, { state: { analysis , smell} });
        console.log("Smell clicked    " + smell.description);
    };

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAddMicroservice = (newMicroservice: Microservice) => {
        analysis.microservices.push(newMicroservice);
        setShowModal(!showModal);
    };

    // Render the analysis page container
    return (
        <div className="analysis-page-container">
            <TopBar />
            <Sidebar
                isVisible={isSidebarVisible}
                toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
                microservices={analysis.microservices}
                onClickModal={toggleModal}
            />
            {/* Main content area, its margin adjusts based on the sidebar visibility */}
            <div className={`content ${isSidebarVisible ? '' : 'sidebar-closed'} ${!analysis.isTriageValid ? 'with-banner' : ''}`}>
                {!analysis.isTriageValid && (
                    <TriageBanner onClick={toggleModal} />
                )}
                <Modal
                    open={showModal}
                    onClose={toggleModal}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <MicroserviceForm onAddMicroservice={handleAddMicroservice} />
                    </Box>
                </Modal>
                <div className="smells-list">
                    {analysis.smells.map((smell) => (
                        <SmellCard
                            key={smell.id}
                            smellName={smell.name}
                            smellDescription={smell.description}
                            importance={"low"}
                            onClick={() => handleSmellClick(analysis, smell)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
