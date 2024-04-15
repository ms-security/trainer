import React from 'react';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css';
import { useLocation } from "react-router-dom";
import { Smell } from "../../interfaces/Smell"; // Assicurati di avere questo file CSS

const SmellPage = () => {
    // Utilizza useLocation per accedere allo stato passato attraverso il routing
    const location = useLocation();

    // Estrai lo smell dalla location state
    const { smell } = location.state as { smell: Smell };

    return (
        <>
            <TopBar />
            <div className="container-smell-page">
                <div className="card-container">
                    <div className="smell-name-description">
                        <h2 className="smell-name">{smell.name}</h2>
                        <p className="smell-description-page"> {smell.description}</p>
                    </div>
                    <div className="smell-container">
                        <h2>What smell is it?</h2>
                        <p>Description</p>
                    </div>
                </div>
                {/*
                <div className="refactoring-section">
                    <h2>Refactoring</h2>
                    {/* Il contenuto per la sezione refactoring può essere aggiunto qui *
                </div>*/}
            </div>
        </>
    );
};

export default SmellPage;
