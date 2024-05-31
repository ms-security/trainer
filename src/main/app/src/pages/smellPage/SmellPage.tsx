import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css';
import { Smell } from "../../interfaces/Smell";
import { useAnalysis } from '../../contexts/AnalysisContext';
import { Analysis } from "../../interfaces/Analysis";
import MicroserviceBanner from "../../components/microserviceBanner/MicroserviceBanner";
import EffortTimeBanner from "../../components/effortTimeBanner/EffortTimeBanner";
import queryString from "query-string";
import { filterSmells, useParsedFiltersFromUrl } from "../../util/filterSmells";
import PropertySections from './PropertySections';
import MicroserviceSection from './MicroserviceSection';
import { urgencyCodeToName, getUrgencyClass} from "../../util/utilityFunctions";
import {EffortTime} from "../../interfaces/EffortTime";

const SmellPage: React.FC = () => {
    const { analysisId, smellId } = useParams<{ analysisId: string, smellId: string }>();
    const [smell, setSmell] = useState<Smell | undefined>();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const { getSmellById, fetchAnalysisById, addEffortTime, changeSmellStatus, addSmellToMicroservice } = useAnalysis();
    const [localStatus, setLocalStatus] = useState<string | undefined>();
    const filters = useParsedFiltersFromUrl();
    const navigate = useNavigate();

    useEffect(() => {
        if (analysisId && smellId) {
            fetchData(analysisId, smellId);
        }
    }, [analysisId, smellId]);

    const fetchData = async (analysisId: string, smellId: string) => {
        try {
            const analysisData = await fetchAnalysisById(analysisId);
            setAnalysis(analysisData);
            const smellData = await getSmellById(analysisId, parseInt(smellId));
            setSmell(smellData);
            setLocalStatus(smellData?.status);
        } catch (error) {
            alert(error);
        }
    };

    const handleSmellClick = async (analysisId: string, smellId: number) => {
        await syncStatusWithBackend();
        navigate(`/analysis/${analysisId}/smell/${smellId}?${queryString.stringify(filters, {arrayFormat: 'bracket'})}`);
    };

    const handleEffortTimeChange = async (newEffortTime: EffortTime) => {
        if (analysisId && smellId) {
            try {
                await addEffortTime(analysisId, parseInt(smellId), newEffortTime);
                await fetchData(analysisId, smellId);
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleBackClick = async (analysisId: string | undefined) => {
        await syncStatusWithBackend();
        navigate(`/analysis/${analysisId}?${queryString.stringify(filters, { arrayFormat: 'bracket' })}`);
    };

    const handleSmellStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setLocalStatus(event.target.value);
    };

    const syncStatusWithBackend = async () => {
        if (analysis && smell && localStatus && localStatus !== smell.status) {
            try {
                await changeSmellStatus(analysis.id, smell.id, localStatus);
                await fetchData(analysis.id, String(smell.id));
            } catch (error) {
                alert(error);
            }
        }
    };

    const handleMicroserviceAssignment = async (microserviceId: number) => {
        if (analysisId && smellId) {
            try {
                await addSmellToMicroservice(analysisId, microserviceId, parseInt(smellId));
                await fetchData(analysisId, smellId);
            } catch (error) {
                alert(error);
            }
        }
    };

    const replaceFileNamesWithSpans = (text: string | undefined, fileName: string | undefined) => {
        if (!text || !fileName) return text;
        const regex = /<([^>]+)>/g;
        const parts = text.split(regex);
        return parts.map((part, index) =>
            index % 2 === 1 ? <span className="file-name-box" key={fileName}>{fileName}</span> : part
        );
    };

    return (
        <div className="smellPage">
            <TopBar onHomeClick={syncStatusWithBackend} />
            <div className="smellPage-header">
                <h1 className="smellPage-backButton" onClick={() => handleBackClick(analysis?.id)}> ← </h1>
                <h1 className="smellPage-analysisName">Analysis - {analysis?.name}</h1>
                <div className="smellPage-statusDropdown">
                    <select value={localStatus} onClick={(e) => { e.stopPropagation(); }} onChange={handleSmellStatusChange}>
                        <option value="NOT_FIXED">Not fixed</option>
                        <option value="FIXED">Fixed</option>
                        <option value="FALSE_POSITIVE">False positive</option>
                        <option value="NOT_GOING_TO_FIX">Not going to fix</option>
                    </select>
                </div>
                <div className="smellPage-urgencyCode-container">
                    <div className={getUrgencyClass(smell?.urgencyCode)}></div>
                    <div className="smellPage-urgencyCode-text">{urgencyCodeToName(smell?.urgencyCode)}</div>
                </div>
                <MicroserviceBanner
                    microservice={smell?.microservice}
                    microservices={analysis?.microservices ?? []}
                    onMicroserviceChange={handleMicroserviceAssignment} />
                <EffortTimeBanner
                    key={smell?.id}
                    effortTime={smell?.effortTime}
                    onEffortTimeChange={handleEffortTimeChange} />
            </div>
            <hr className="smellPage-headerSeparator" />
            <div className="smellPage-layout">
                <aside className="smellPage-sidebar">
                    <div className="smellPage-sidebarContent">
                        <div className="smellPage-smellIndex-fixed">
                            <h3 className="smellPage-smellIndex">Smell: {smell?.id} / {analysis?.smells.length}</h3>
                        </div> {analysis && filterSmells(analysis.smells, filters).map(smellItem => (
                        <div
                            key={smellItem.id}
                            className={`smellPage-smellListCard ${smellItem.id === smell?.id ? 'active' : ''}`}
                            onClick={() => handleSmellClick(analysis?.id, smellItem.id)}>
                            <div className="smellPage-smellList-scripts">
                                <h3 className="smellPage-smellCardTitle">{smellItem.name}</h3>
                                <p className="smellPage-smellCardMicroservice">{"Microservice: " + smellItem.microservice?.name || ''}</p>
                            </div>
                            <p className="smellPage-smellList-effortTime">
                                {smellItem.effortTime ? `${smellItem.effortTime.value} ${smellItem.effortTime.unitOfTime}` : ''}
                            </p>
                            <div className={getUrgencyClass(smellItem?.urgencyCode)}></div>
                        </div>
                    ))}
                    </div>
                </aside>
                <main className="smellPage-mainContent">
                    <h1 className="smellPage-smellTitle">{smell?.name} - {smell?.extendedName}</h1>
                    <div id="analysis-output" className="smellPage-smellK">
                        <h2 className="smellPage-smellName">{smell?.outputAnalysis} - {smell?.name} </h2>
                        <p className="smellPage-smellDescription">{smell?.description}</p>
                    </div>
                    <div id="refactoring" className="smellPage-refactoring">
                        <h3 className="smellPage-refactorName">Refactoring - {smell?.refactoring.name}</h3>
                        <p className="smellPage-refactorDescription">{replaceFileNamesWithSpans(smell?.refactoring.refactor, smell?.refactoring.relatedFileName)}</p>
                    </div>
                    <div id="impact-smell-refactoring" className={`smellPage-properties-${smell?.microservice ? 'with-microservice' : 'without-microservice'}`}>
                        <PropertySections smell={smell} />
                        {smell?.microservice && <MicroserviceSection microservice={smell.microservice} />}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SmellPage;
