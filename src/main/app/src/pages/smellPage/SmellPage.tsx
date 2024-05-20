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

const SmellPage = () => {
    const { analysisId, smellId } = useParams<{ analysisId: string, smellId: string }>();
    const [smell, setSmell] = useState<Smell | undefined>();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const { getSmellById, fetchAnalysisById, addEffortTime, changeSmellStatus } = useAnalysis();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Check Params:", analysisId, smellId);
        if (analysisId && smellId) {
            fetchAnalysisById(analysisId).then(setAnalysis);
            console.log("Fetching smell for Analysis ID:");
            const fetchedSmell = getSmellById(analysisId, parseInt(smellId));
            console.log("Fetched Smell:", fetchedSmell);
            setSmell(fetchedSmell);
            console.log(fetchedSmell);
        }
    }, [analysisId, smellId]);

    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `urgency-indicator ${code}` : 'urgency-indicator'; // Append the urgency code as a class
    };

    const handleSmellClick = (analysisId: string, smellId: number) => {
        console.log("check params:", analysisId, smellId);
        navigate(`/analysis/${analysisId}/smell/${smellId}`);
    };

    const handleEffortTimeChange = (newEffortTime: EffortTime) => {
        if (smell) {
            const updatedSmell = { ...smell, effortTime: newEffortTime };
            setSmell(updatedSmell);
            if (analysisId && smellId) {
                addEffortTime(analysisId, parseInt(smellId), newEffortTime);
            }
        }
    };

    const handleBackClick = (analysisId: string | undefined) => {
        console.log("check params:", analysisId);
        navigate(`/analysis/${analysisId}`);
    };

    const handleSmellStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        console.log('Status changed:', smellId, newStatus);
        if (analysis && smell) {
            await changeSmellStatus(analysis.id, smell.id, newStatus);
            const updatedAnalysis = await fetchAnalysisById(analysis.id);
            setAnalysis(updatedAnalysis);

            // Update the smell in the local state
            const updatedSmell = { ...smell, status: newStatus as Smell['status'] };
            setSmell(updatedSmell);
        }
    };

    const replaceFileNamesWithSpans = (text: string | undefined, fileName: string | undefined) => {
        console.log("Text:", text, "FileName:", fileName);
        if(!text || !fileName) return text;
        console.log("Text:", text, "FileName:", fileName);
        const regex = /<([^>]+)>/g;
        const parts = text.split(regex);
        return parts.map((part, index) =>
            index % 2 === 1 ? <span className="file-name-box" key={index}>{fileName}</span> : part
        );
    };

    return (
        <div className="smellPage">
            <TopBar />
            <div className="smellPage-header">
                <h1 className="smellPage-backButton" onClick={() => handleBackClick(analysis?.id)}> ← </h1>
                <h1 className="smellPage-analysisName">Analysis - {analysis?.name}</h1>
                <div className="smellPage-statusDropdown">
                    <select value={smell?.status} onClick={(e) => { e.stopPropagation(); }}
                            onChange={handleSmellStatusChange}>
                        <option value="UNFIXED">Not fixed</option>
                        <option value="FIXED">Fixed</option>
                        <option value="FALSE_POSITIVE">False positive</option>
                        <option value="NOT_GOING_TO_FIX">Not going to fix</option>
                    </select>
                </div>
                <div className={getUrgencyClass(smell?.urgencyCode)}></div>
                <MicroserviceBanner microserviceName={smell?.microservice?.name} />
                <EffortTimeBanner
                    effortTime={smell?.effortTime}
                    onEffortTimeChange={handleEffortTimeChange}
                />
            </div>
            <hr className="smellPage-headerSeparator" />

            <div className="smellPage-layout">
                <aside className="smellPage-sidebar">
                    <div className="smellPage-sidebarContent">
                        <div className="smellPage-smellIndex-fixed">
                            <h3 className="smellPage-smellIndex">Smell: {smell?.id} / {analysis?.smells.length}</h3>
                        </div>
                        {analysis?.smells.map((smell) => (
                            <div key={smell.id} className="smellPage-smellListCard"
                                 onClick={() => handleSmellClick(analysis?.id, smell.id)}>
                                <div className="smellPage-smellList-scripts">
                                    <h3 className="smellPage-smellCardTitle">{smell.name}</h3>
                                    <p className="smellPage-smellCardMicroservice">{"Microservice: " + smell.microservice?.name || ''}</p>
                                    <p className="smellPage-smellList-effortTime">
                                        {smell.effortTime ? `${smell.effortTime.value} ${smell.effortTime.unitOfTime}` : ''}
                                    </p>
                                </div>
                                <div className={getUrgencyClass(smell?.urgencyCode)}></div>
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
                                        <h4 className="smellPage-propertyCategory">{category}</h4>
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
                                        <h4 className="smellPage-propertyCategory">{category}</h4>
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

                <nav className="smellPage-toc">
                    <h3 className="smellPage-tocTitle">Table of Contents</h3>
                    <ul>
                        <li><a href="#analysis-output">Analysis Output</a></li>
                        <li><a href="#refactoring">Refactoring</a></li>
                        <li><a href="#impact-smell-refactoring">Smell & Refactor Impacts</a></li>
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default SmellPage;
