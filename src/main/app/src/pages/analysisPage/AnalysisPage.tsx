import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import Sidebar from '../../components/sideBar/SideBar';
import SmellCard from '../../components/cards/SmellCard';
import { Analysis } from "../../interfaces/Analysis";
import './AnalysisPage.css';
import MicroserviceForm from "../../components/inputForm/MicroserviceForm";
import {Box, Modal} from "@mui/material";
import {useAnalysis} from "../../contexts/AnalysisContext";

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
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { fetchAnalysisById, addMicroservice, addSmellToMicroservice} = useAnalysis();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    // State to control the visibility of the sidebar
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    useEffect(() => {
        if (id) {
            fetchAnalysisById(parseInt(id)).then(setAnalysis);
        }
    }, [id, fetchAnalysisById]);

    const handleSmellClick = (smellId: number) => {
        console.log("check params:", id, smellId);
        navigate(`/analysis/${id}/smell/${smellId}`);
    };

    const [showModal, setShowModal] = useState(false);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const handleAddMicroservice = async (data: any) => {
        if (analysis) {
            try {
                await addMicroservice(data, analysis.id);
                // Assume that addMicroservice updates the analysis context, so refetch it
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
                toggleModal();
            } catch (error) {
                console.error('Error adding microservice:', error);
            }
        }
    };

    const handleAssignMicroserviceToSmell = async (smellId: number, microserviceName: string) => {
        if (analysis) {
            try {
                console.log('Assigning microservice to smell: ', microserviceName, smellId);
                await addSmellToMicroservice(analysis.id, microserviceName, smellId);
            } catch (error) {
                console.error('Error assigning microservice to smell:', error);
            }
        }
    };

    // Render the analysis page container
    return (
        <div className="analysis-page-container">
            <TopBar />
            <Sidebar
                isVisible={isSidebarVisible}
                toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)}
                microservices={analysis?.microservices || []}
                onClickModal={toggleModal}
            />
            {/* Main content area, its margin adjusts based on the sidebar visibility */}
            <div className={`content ${isSidebarVisible ? '' : 'sidebar-closed'} ${!analysis?.isTriageValid ? 'with-banner' : ''}`}>
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
                    {analysis?.smells.map((smell) => (
                        <SmellCard
                            key={smell.id}
                            smellName={smell.name}
                            smellId={smell.id}
                            smellDescription={smell.description}
                            importance={"low"}
                            onClick={() => handleSmellClick(smell.id)}
                            microservices={analysis.microservices || []}
                            onAssignMicroservice={handleAssignMicroserviceToSmell}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
