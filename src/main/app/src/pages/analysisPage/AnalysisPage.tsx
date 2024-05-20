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
import MicroserviceManager from "../../components/microserviceManager/MicroserviceManager";
import {Microservice} from "../../interfaces/Microservice";
import {useFilter} from "../../hooks/useFilter";
import queryString from "query-string";
import {filterSmells, useParsedFiltersFromUrl} from "../../util/filterSmells";

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
    const { fetchAnalysisById, addMicroservice, addSmellToMicroservice, updateMicroservice, deleteMicroservice, changeCheckboxValue, changeSmellStatus} = useAnalysis();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const [showModal, setShowModal] = useState(false);
    const [currentMicroservice, setCurrentMicroservice] = useState<Microservice | undefined>(undefined);
    const [filters, updateFilters] = useFilter(useParsedFiltersFromUrl());

    useEffect(() => {
        if (id) {
            fetchAnalysisById(id).then(setAnalysis);
        }
    }, [id, fetchAnalysisById]);

    const handleSmellClick = (smellId: number) => {
        console.log("check params:", id, smellId);
        const queryStringified = queryString.stringify(filters, { arrayFormat: 'bracket' });
        navigate(`/analysis/${id}/smell/${smellId}?${queryStringified}`);
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        if (!showModal) { // When opening the modal, if it's already closed
            setCurrentMicroservice(undefined);
        }
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

    const handleUpdateMicroservice = async (data: any) => {
        if (analysis && currentMicroservice) {
            try {
                await updateMicroservice(data, analysis.id); // Assuming updateMicroservice method exists and accepts an ID
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
                toggleModal();
            } catch (error) {
                console.error('Error updating microservice:', error);
            }
        }
        console.log('Update microservice:', data);
    };

    const handleAssignMicroserviceToSmell = async (smellId: number, microserviceName: string) => {
        if (analysis) {
            try {
                console.log('Assigning microservice to smell: ', microserviceName, smellId);
                await addSmellToMicroservice(analysis.id, microserviceName, smellId);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                console.error('Error assigning microservice to smell:', error);
            }
        }
    };

    const handleDeleteMicroservice = async (microserviceName: string) => {
        if (analysis) {
            console.log('Deleting microservice:', microserviceName);
            await deleteMicroservice(analysis.id, microserviceName);
            // Assume that deleteMicroservice updates the analysis context, so refetch it
            const updatedAnalysis = await fetchAnalysisById(analysis.id);
            setAnalysis(updatedAnalysis);
        }
    }

    const openEditModal = (microservice: Microservice) => {
        setCurrentMicroservice(microservice);
        setShowModal(true);
    };

    const openAddModal = () => {
        setCurrentMicroservice(undefined);
        setShowModal(true);
    };



    const handleCheckboxChange = async (smellId: number, checkboxValue: boolean) => {
        console.log('Checkbox changed:', smellId, checkboxValue);
        if(analysis){
            await changeCheckboxValue(analysis?.id, smellId, checkboxValue);
            const updatedAnalysis = await fetchAnalysisById(analysis.id);
            setAnalysis(updatedAnalysis);
        }
    }

    const handleSmellStatusChange = async (smellId: number, newStatus: string) => {
        console.log('Status changed:', smellId, newStatus);
        if(analysis){
            await changeSmellStatus(analysis?.id, smellId, newStatus);
            const updatedAnalysis = await fetchAnalysisById(analysis.id);
            setAnalysis(updatedAnalysis);
        }
    }

    // Render the analysis page container
    return (
        <div className="analysis-page-container">
            <TopBar />
            <div className="analysisPage-grid">
                <aside className="grid-sidebar">
                    {analysis && <Sidebar
                        filters={filters}
                        updateFilters={updateFilters}
                        microservices={analysis?.microservices || []}
                    />}
                </aside>
                <div className="grid-smells-list">
                    {analysis && filterSmells(analysis.smells, filters).map(smell => (
                        <SmellCard
                            key={smell.id}
                            smellName={smell.name}
                            extendedName={smell.extendedName}
                            outputAnalysis={smell.outputAnalysis}
                            smellId={smell.id}
                            smellDescription={smell.description}
                            urgencyCode={smell.urgencyCode}
                            isChecked={smell.checked}
                            smellStatus={smell.status}
                            effortTime={smell.effortTime}
                            onClick={() => handleSmellClick(smell.id)}
                            microservices={analysis.microservices || []}
                            onAssignMicroservice={handleAssignMicroserviceToSmell}
                            smellMicroservice={smell.microservice}
                            onCheckboxChange={handleCheckboxChange}
                            onStatusChange={handleSmellStatusChange}
                        />
                    ))}
                </div>
                <div className="grid-microservice-manager">
                    {analysis && <MicroserviceManager
                        onClickModal={openAddModal}
                        onEditMicroservice={openEditModal}
                        deleteMicroservice={handleDeleteMicroservice}
                        microservices={analysis.microservices}
                    />}
                </div>
            </div>
            <Modal
                open={showModal}
                onClose={toggleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <MicroserviceForm
                        onAddMicroservice={handleAddMicroservice}
                        onUpdateMicroservice={handleUpdateMicroservice}  // Aggiungi la gestione dell'update qui
                        initialData={currentMicroservice}  // Passa i dati iniziali se in modalità modifica
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default AnalysisPage;
