import React, { useEffect, useState } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css';
import {Smell, UrgencyCode} from "../../interfaces/Smell";
import { useAnalysis } from '../../contexts/AnalysisContext';
import {Analysis} from "../../interfaces/Analysis";
import {Category} from "../../interfaces/QualityAttribute";
import MicroserviceBanner from "../../components/microserviceBanner/MicroserviceBanner";
import EffortTimeBanner from "../../components/effortTimeBanner/EffortTimeBanner";
import {EffortTime} from "../../interfaces/EffortTime";

const SmellPage = () => {
    const { analysisId, smellId } = useParams<{ analysisId: string, smellId: string }>();
    const [smell, setSmell] = useState<Smell | undefined>();
    const [analysis, setAnalysis] = useState<Analysis | undefined>();
    const { getSmellById, fetchAnalysisById, addEffortTime} = useAnalysis();
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Check Params:", analysisId, smellId);
        if (analysisId && smellId) {
            fetchAnalysisById(parseInt(analysisId)).then(setAnalysis);
            console.log("Fetching smell for Analysis ID:");
            const fetchedSmell = getSmellById(parseInt(analysisId), parseInt(smellId));
            console.log("Fetched Smell:", fetchedSmell);
            setSmell(fetchedSmell);
            console.log(fetchedSmell);
        }
    }, [analysisId, smellId]);

    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `urgency-indicator ${code}` : 'urgency-indicator'; // Append the urgency code as a class
    };

    const handleSmellClick = (analysisId: number, smellId: number) => {
        console.log("check params:", analysisId, smellId);
        navigate(`/analysis/${analysisId}/smell/${smellId}`);
    };

    const handleEffortTimeChange = (newEffortTime: EffortTime) => {
        if (smell) {
            const updatedSmell = { ...smell, effortTime: newEffortTime };
            setSmell(updatedSmell);
            if (analysisId && smellId) {

                addEffortTime(parseInt(analysisId), parseInt(smellId), newEffortTime);
            }
        }
    };

    const handleBackClick = (analysisId: number | undefined) => {
        console.log("check params:", analysisId);
        navigate(`/analysis/${analysisId}`);
    };

    return (
        <body className="smellPage">
            <TopBar/>
            <div className="smellPage-header">
                <h1 className="smellPage-backButton" onClick={() => handleBackClick(analysis?.id)}> ← </h1>
                <h1 className="smellPage-analysisName">Analysis - {analysis?.name}</h1>
                <div className={getUrgencyClass(smell?.urgencyCode)}></div>
                <MicroserviceBanner microserviceName={smell?.microservice?.name} />
                <EffortTimeBanner
                    effortTime={smell?.effortTime}
                    onEffortTimeChange={handleEffortTimeChange}
                />
            </div>
            <hr className="smellPage-headerSeparator"/>

            <div className="smellPage-layout">
                <aside className="smellPage-sidebar">
                    <div className="smellPage-sidebarContent">
                    <h3 className="smellPage-smellIndex">Smell: {smell?.id} / {analysis?.smells.length}</h3>
                        {analysis?.smells.map((smell) => (
                            <div className="smellPage-smellListCard" onClick={() => handleSmellClick(analysis?.id, smell.id)}>
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
                        <h2 className="smellPage-smellName">Analysis Output - {smell?.name} </h2>
                        <p className="smellPage-smellDescription">{smell?.description}</p>
                    </div>
                    <div id="refactoring" className="smellPage-refactoring">
                        <h3 className="smellPage-refactorName">Refactoring - {smell?.refactoring.name}</h3>
                        <p className="smellPage-refactorDescription">{smell?.refactoring.refactor}</p>
                    </div>
                    <div id="smell-description" className="smellPage-smellDefinition">
                        <h3 className="smellPage-smellDefinitionTitle">Smell Description - {smell?.extendedName}</h3>
                        <p className="smellPage-smellDefinitionDescription">{smell?.smellTypeDescription}</p>
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
                                                <span
                                                    className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}></span>
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
                                                <span
                                                    className={`smellPage-impactIndicator ${attribute.impactsPositively ? 'positive' : 'negative'}`}></span>
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
                        <li><a href="#smell-description">Smell Description</a></li>
                        <li><a href="#impact-smell-refactoring">Smell & Refactor Impacts</a></li>
                    </ul>
                </nav>
            </div>
        </body>
    );
};

export default SmellPage;
