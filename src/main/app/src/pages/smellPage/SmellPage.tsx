// SmellPage.js
import React, { useState } from 'react';
import TopBar from '../../components/topBar/TopBar';
import './SmellPage.css'; // Assicurati di avere questo file CSS

const SmellPage = () => {

    return (
        <>
            <TopBar />
            <div className="container-smell-page">
                <div className="card-container">
                    <div className="smell-card">
                        <h2>Nome Esteso-UPM</h2>
                        <p>Description</p>
                    </div>
                    <div className="smell-container">
                        <h2>What smell is it?</h2>
                        <p>Description</p>
                    </div>
                </div>
                <div className="refactoring-section">
                    <h2>Refactoring</h2>
                    {/* Il contenuto per la sezione refactoring può essere aggiunto qui */}
                </div>
            </div>
        </>
    );
};

export default SmellPage;
