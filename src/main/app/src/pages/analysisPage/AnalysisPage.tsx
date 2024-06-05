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
import {Microservice} from "../../interfaces/Microservice";
import {useFilter} from "../../hooks/useFilter";
import queryString from "query-string";
import {filterSmells, useParsedFiltersFromUrl} from "../../util/filterSmells";
import {calculateTotalEffortTime} from "../../util/calculateTotalEffortTime";
import MicroserviceDropdown from "../../components/microserviceDropdown/MicroserviceDropdown";

 const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500, // Set the width of the modal or use a percentage
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2, // Padding inside the modal
};

const AnalysisPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { fetchAnalysisById, addMicroservice, addSmellToMicroservice, updateMicroservice, deleteMicroservice, changeCheckboxValue, changeSmellStatus, multipleAssignments} = useAnalysis();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const [showModal, setShowModal] = useState(false);
    const [currentMicroservice, setCurrentMicroservice] = useState<Microservice | undefined>(undefined);
    const [filters, updateFilters] = useFilter(useParsedFiltersFromUrl());

    useEffect(() => {
        if (id) {
            fetchAnalysisById(id)
                .then(setAnalysis)
                .catch(error => alert(error));
        }
    }, [id, fetchAnalysisById]);

    const handleSmellClick = (smellId: number) => {
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
                toggleModal();
                await addMicroservice(data, analysis.id);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleUpdateMicroservice = async (data: any) => {
        if (analysis && currentMicroservice) {
            try {
                toggleModal();
                await updateMicroservice(data, analysis.id); // Assuming updateMicroservice method exists and accepts an ID
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleAssignMicroserviceToSmell = async (smellId: number, microserviceId: number) => {
        if (analysis) {
            try {
                await addSmellToMicroservice(analysis.id, microserviceId, smellId);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleMultipleAssignment = async (microserviceId: number, resultFileNames: string[]) : Promise<void> => {
        if(analysis) {
            try {
                const smellIds = analysis.smells
                    .filter(smell => resultFileNames.includes(smell.refactoring.relatedFileName))
                    .map(smell => smell.id);
                await multipleAssignments(analysis.id, microserviceId, smellIds);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error){
                alert(error);
            }
        }
    }

    const handleDeleteMicroservice = async (microserviceId: number) => {
        if (analysis) {
            try {
                await deleteMicroservice(analysis.id, microserviceId);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error);
            }
        }
    };

    const openEditModal = (microservice: Microservice) => {
        setCurrentMicroservice(microservice);
        setShowModal(true);
    };

    const openAddModal = () => {
        setCurrentMicroservice(undefined);
        setShowModal(true);
    };



    const handleCheckboxChange = async (smellId: number, checkboxValue: boolean) => {
        if (analysis) {
            try {
                await changeCheckboxValue(analysis.id, smellId, checkboxValue);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error)
            }
        }
    }

    const handleSmellStatusChange = async (smellId: number, newStatus: string) => {
        if (analysis) {
            try {
                await changeSmellStatus(analysis.id, smellId, newStatus);
                const updatedAnalysis = await fetchAnalysisById(analysis.id);
                setAnalysis(updatedAnalysis);
            } catch (error) {
                alert(error)
            }
        }
    }
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        updateFilters({
            ...filters,
            sortBy: e.target.value as 'none' | 'urgencyTop' | 'urgencyBottom' | 'effortTop' | 'effortBottom'
        });
    }

    const handleMicroserviceSelect = (microservice: Microservice) => {
        setCurrentMicroservice(microservice);
    };

    const extractUniqueFilenames = (analysis: Analysis) => {
        const filenamesSet = new Set<string>();
        analysis.smells.forEach(smell => {
            if(smell.refactoring.relatedFileName)
            filenamesSet.add(smell.refactoring.relatedFileName);
        });
        return Array.from(filenamesSet);
    };

    const filenames = analysis ? extractUniqueFilenames(analysis) : []

    const totalEffortTime = analysis ? calculateTotalEffortTime(analysis.smells) : "0min";

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
                    <div className="smells-list-header">
                        <button className= "analysis-page-addButtonMicroservice" onClick={openAddModal}>Add Microservice</button>
                        {analysis && (
                            <MicroserviceDropdown
                                microservices={analysis.microservices}
                                onSelect={handleMicroserviceSelect}
                                onEditMicroservice={openEditModal}
                                deleteMicroservice={handleDeleteMicroservice}
                                filenames={filenames}
                                onAssignMicroservice={handleMultipleAssignment}
                            />
                        )}
                        <div className="controls">
                            <span className="sort-by-label">Sort By:</span>
                            <select className="sort-by-select" value={filters.sortBy ?? 'none'} onChange={handleSortChange}>
                                <option value="none">None</option>
                                <option value="urgencyTop">Decreasing urgency</option>
                                <option value="urgencyBottom">Increasing urgency</option>
                                <option value="effortTop">Decreasing effort</option>
                                <option value="effortBottom">Increasing effort</option>
                            </select>
                            <span className="total-effort-time">Total effort:</span>
                            {totalEffortTime}
                            <span className="smells-count">Smells: </span>
                            {analysis ? analysis.smells.length : 0}
                        </div>
                    </div>
                    <div className="smells-list-content">
                        {analysis && filterSmells(analysis.smells, filters).map(smell => (
                            <SmellCard
                                key={smell.id}
                                smell={smell}
                                isChecked={smell.checked}
                                onClick={() => handleSmellClick(smell.id)}
                                microservices={analysis.microservices || []}
                                onAssignMicroservice={handleAssignMicroserviceToSmell}
                                onCheckboxChange={handleCheckboxChange}
                                onStatusChange={handleSmellStatusChange}
                                currentFilterStatus={filters.smellStatus}
                            />
                        ))}
                    </div>
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
                        onUpdateMicroservice={handleUpdateMicroservice}
                        initialData={currentMicroservice}
                        microservicesList={analysis?.microservices ?? []}
                    />
                </Box>
            </Modal>
        </div>
    );
};

export default AnalysisPage;
