import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css';
import { Smell, UrgencyCode } from "../../interfaces/Smell";
import { useAnalysis } from '../../contexts/AnalysisContext';
import { Analysis } from "../../interfaces/Analysis";
import { Category } from "../../interfaces/QualityAttribute";
import MicroserviceBanner from "../../components/microserviceBanner/MicroserviceBanner";
import EffortTimeBanner from "../../components/effortTimeBanner/EffortTimeBanner";
import { EffortTime } from "../../interfaces/EffortTime";
import queryString from "query-string";
import { filterSmells, useParsedFiltersFromUrl } from "../../util/filterSmells";

const SmellPage = () => {
    const { analysisId, smellId } = useParams<{ analysisId: string, smellId: string }>();
    const [smell, setSmell] = useState<Smell | undefined>();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const { getSmellById, fetchAnalysisById, addEffortTime, changeSmellStatus, addSmellToMicroservice } = useAnalysis();
    const [localStatus, setLocalStatus] = useState<string | undefined>();
    const filters = useParsedFiltersFromUrl();
    const navigate = useNavigate();

    useEffect(() => {
        if (analysisId && smellId) {
            fetchAnalysisById(analysisId).then(setAnalysis);
            getSmellById(analysisId, parseInt(smellId)).then(smell => {
                setSmell(smell);
                setLocalStatus(smell?.status);  // Initialize local status
            });
        }
    }, [analysisId, smellId]);


    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `smellPage-urgency-indicator ${code}` : 'smellPage-urgency-indicator';
    };

    const handleSmellClick = (analysisId: string, smellId: number) => {
        syncStatusWithBackend().then(() => {
            const queryStringified = queryString.stringify(filters, {arrayFormat: 'bracket'});
            navigate(`/analysis/${analysisId}/smell/${smellId}?${queryStringified}`);
        });  // Sync status before navigating
    };

    const handleEffortTimeChange = async (newEffortTime: EffortTime) => {
        if (analysisId && smellId) {
            await addEffortTime(analysisId, parseInt(smellId), newEffortTime);
            const updatedAnalysis = await fetchAnalysisById(analysisId);
            setAnalysis(updatedAnalysis);
            const updatedSmell = await getSmellById(analysisId, parseInt(smellId));
            setSmell(updatedSmell);
        }
    };

    const handleBackClick = (analysisId: string | undefined) => {
        syncStatusWithBackend().then(() => {
            const queryStringified = queryString.stringify(filters, { arrayFormat: 'bracket' });
            navigate(`/analysis/${analysisId}?${queryStringified}`);
        });  // Sync status before navigating
    };

    const handleSmellStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        setLocalStatus(newStatus);  // Update local status
    };

    const syncStatusWithBackend = async () => {
        if (analysis && smell && localStatus && localStatus !== smell.status) {
            await changeSmellStatus(analysis.id, smell.id, localStatus);
            const updatedAnalysis = await fetchAnalysisById(analysis.id);
            setAnalysis(updatedAnalysis);
            const updatedSmell = await getSmellById(analysis.id, smell.id);
            setSmell(updatedSmell);
        }
    };

    const replaceFileNamesWithSpans = (text: string | undefined, fileName: string | undefined) => {
        if (!text || !fileName) return text;
        const regex = /<([^>]+)>/g;
        const parts = text.split(regex);
        return parts.map((part, index) =>
            index % 2 === 1 ? <span className="file-name-box" key={index}>{fileName}</span> : part
        );
    };

    const handleMicroserviceAssignment = async (newMicroserviceName: string) => {
        console.log("Nuovo microservizio selezionato:", newMicroserviceName);
        if (analysisId && smellId) {
            await addSmellToMicroservice(analysisId, newMicroserviceName, parseInt(smellId) );
            const updatedAnalysis = await fetchAnalysisById(analysisId);
            setAnalysis(updatedAnalysis);
            const updatedSmell = await getSmellById(analysisId, parseInt(smellId));
            setSmell(updatedSmell);
        }
    }

    const urgencyCodeToName = (code: UrgencyCode | undefined) => {
        switch (code) {
            case 'HH':
                return 'High';
            case 'HM':
                return 'Medium to High';
            case 'MM':
                return 'Medium';
            case 'ML':
                return 'Low to Medium';
            case 'LL':
                return 'Low';
            case 'LN':
                return 'None to Low';
            case 'Ø':
                return 'None';
            default:
                return 'Undefined';
        }
    };

    return (
        <div className="smellPage">
            <TopBar
                onHomeClick={syncStatusWithBackend}
            />
            <div className="smellPage-header">
                <h1 className="smellPage-backButton" onClick={() => handleBackClick(analysis?.id)}> ← </h1>
                <h1 className="smellPage-analysisName">Analysis - {analysis?.name}</h1>
                <div className="smellPage-statusDropdown">
                    <select value={localStatus} onClick={(e) => { e.stopPropagation(); }}
                            onChange={handleSmellStatusChange}>
                        <option value="UNFIXED">Not fixed</option>
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
                    microserviceName={smell?.microservice?.name}
                    microservices={analysis?.microservices.map(ms => ms.name) || []}
                    onMicroserviceChange={handleMicroserviceAssignment}/>
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

                    <div id="impact-smell-refactoring" className="smellPage-properties">
                        <div className="smellPage-smellImpact">
                            <h3 className="smellPage-propertiesSmellImpact">Smell Impact</h3>
                            {Object.values(Category).map((category) => {
                                const filteredAttributes = smell?.propertiesAffected.filter(attribute => attribute.category === category);
                                return filteredAttributes && filteredAttributes.length > 0 && (
                                    <div key={category}>
                                        <h4 className="smellPage-propertyCategory">{category.replace(/_/g, ' ')}</h4>
                                        {filteredAttributes.map((attribute) => (
                                            <div key={attribute.name} className="smellPage-property">
                                                <span className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}>
                                                    <span className="indicator-icon">{attribute.impactsPositively ? '+' : '-'}</span>
                                                </span>
                                                <span className="smellPage-propertyName">{attribute.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                        <div className="smellPage-refactoringImpact">
                            <h3 className="smellPage-propertiesRefactoringImpact">Refactoring Impact</h3>
                            {Object.values(Category).map((category) => {
                                const filteredRefactoringAttributes = smell?.refactoring.propertiesAffected.filter(attribute => attribute.category === category);
                                return filteredRefactoringAttributes && filteredRefactoringAttributes.length > 0 && (
                                    <div key={category}>
                                        <h4 className="smellPage-propertyCategory">{category.replace(/_/g, ' ')}</h4>
                                        {filteredRefactoringAttributes.map((attribute) => (
                                            <div key={attribute.name} className="smellPage-property">
                                                <span className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}>
                                                    <span className="indicator-icon">{attribute.impactsPositively ? '+' : '-'}</span>
                                                </span>
                                                <span className="smellPage-propertyName">{attribute.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SmellPage;
