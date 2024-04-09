// Importa useLocation da react-router-dom per accedere allo stato passato attraverso il routing
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '../../components/topBar/TopBar';
import Sidebar from '../../components/sideBar/SideBar';
import SmellCard from '../../components/cards/SmellCard';
import { Analysis } from "../../interfaces/Analysis";
import './AnalysisPage.css'; // Assicurati di creare questo file CSS e di importarlo

const AnalysisPage = () => {
    // Use useLocation to access the state passed from the HomePage
    const location = useLocation();
    // Extract the 'analysis' data from the location state
    const { analysis } = location.state as { analysis: Analysis };

    // State to control the visibility of the sidebar
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    // Render the analysis page container
    return (
        <div className="analysis-page-container">
            <TopBar />
            <Sidebar isVisible={isSidebarVisible} toggleSidebar={() => setIsSidebarVisible(!isSidebarVisible)} />
            {/* Main content area, its margin adjusts based on the sidebar visibility */}
            <div className={`content ${isSidebarVisible ? '' : 'sidebar-closed'}`}>
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
