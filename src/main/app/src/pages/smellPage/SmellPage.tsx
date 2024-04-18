import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css';
import { Smell } from "../../interfaces/Smell";
import { useAnalysis } from '../../contexts/AnalysisContext';

const SmellPage = () => {
    const { analysisId, smellId } = useParams<{ analysisId: string, smellId: string }>();
    const { getSmellById } = useAnalysis();
    const [smell, setSmell] = useState<Smell | undefined>();

    useEffect(() => {
        console.log("Check Params:", analysisId, smellId);
        if (analysisId && smellId) {
            console.log("Fetching smell for Analysis ID:");
            const fetchedSmell = getSmellById(parseInt(analysisId), parseInt(smellId));
            console.log("Fetched Smell:", fetchedSmell);
            setSmell(fetchedSmell);
            console.log(fetchedSmell);
        }
    }, [analysisId, smellId, getSmellById]);

    return (
        <>
            <TopBar />
            <div className="smellPage-pageContainer">
                <div className="smellPage-smellRefactor-container">
                    <div className="smellPage-smellK">
                        <h2 className="smellPage-smellName">{smell?.name } - {smell?.extendedName}</h2>
                        <p className="smellPage-smellDescription">{smell?.description}</p>
                    </div>
                    <div className="smellPage-refactoring">
                        <h3 className="smellPage-refactorName">Refactoring - {smell?.refactoring.name}</h3>
                        <p className="smellPage-refactorDescription">{smell?.refactoring.refactor}</p>
                    </div>
                </div>
                <div className="smellPage-smellDefinition">
                    <h3 className="smellPage-smellDefinitionTitle">Smell Definition - {smell?.name }</h3>
                    <p className="smellPage-smellDefinitionDescription">{smell?.smellTypeDescription}</p>
                </div>
            </div>
        </>
    );
};

export default SmellPage;
