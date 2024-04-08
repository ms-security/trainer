// Importa useLocation da react-router-dom per accedere allo stato passato attraverso il routing
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import Sidebar from '../../components/sideBar/SideBar';
import SmellCard from '../../components/cards/SmellCard';
import { Analysis } from "../../interfaces/Analysis";
import './AnalysisPage.css'; // Assicurati di creare questo file CSS e di importarlo

const AnalysisPage = () => {
    // Usa useLocation per accedere allo stato passato dalla HomePage
    const location = useLocation();
    const { analysis } = location.state as { analysis: Analysis };

    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    return (
        <div className="analysis-page-container">
            <TopBar />
            <Sidebar isVisible={isSidebarVisible} toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
            <div className={`content ${isSidebarVisible ? '' : 'full-width'}`}>
                <h1>Dettagli Analisi: {analysis.name}</h1>
                <div className="smells-list">
                    {analysis.smells.map((smell, index) => (
                        <SmellCard key={index} smellName={smell.name} smellDescription={smell.description} importance={"low"}/>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
