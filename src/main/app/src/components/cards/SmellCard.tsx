import React, { useState } from 'react';
import './SmellCard.css';
import {Microservice} from "../../interfaces/Microservice";

interface SmellCardProps {
    smellId: number;
    smellName: string;
    smellDescription: string;
    importance: 'none' | 'low' | 'medium' | 'high';
    onClick: () => void;
    microservices: Microservice[];
    onAssignMicroservice: (smellId: number, microserviceName: string) => void;
}

const SmellCard: React.FC<SmellCardProps> = ({
                                                 smellId,
                                                 smellName,
                                                 smellDescription,
                                                 importance,
                                                 microservices,
                                                 onAssignMicroservice,
                                                 onClick
                                                }) => {
    const [status, setStatus] = useState('unfixed');
    const [selectedMicroservice, setSelectedMicroservice] = useState('');
    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };

    // Function to call when a microservice is selected from the dropdown
    const handleMicroserviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const microserviceName = e.target.value;
        setSelectedMicroservice(microserviceName);
        if (microserviceName !== '') {
            onAssignMicroservice(smellId, microserviceName);
        }
    };

    return (
        <div className="smell-card" onClick={onClick}>
            <div className="smell-header">
                <h3 className="smellName">{smellName}</h3>
                <p className="smell-description">{smellDescription}</p>
            </div>
            <div className="smell-footer">
                <div className="importance-status">
                    <div className={`importance-indicator ${importance}`}></div>
                    <div className="status-dropdown">
                        <select value={status} onClick={(e) => {e.stopPropagation();}} onChange={(e) => {handleStatusChange(e.target.value)}}>
                            <option value="unfixed">Unfixed</option>
                            <option value="fixed">Mark as fixed</option>
                            <option value="false_positive">Mark as false positive</option>
                            <option value="wont_fix">Mark not going to fix</option>
                        </select>
                    </div>
                </div>
                <div className="checkbox-container" onClick={(e) => {e.stopPropagation();}}>
                    <input type="checkbox"/>
                </div>
                <div className="microservice-dropdown">
                    <select value={selectedMicroservice} onClick={(e) => {e.stopPropagation();}} onChange={handleMicroserviceChange}>
                        <option value="" disabled>Select Microservice</option>
                        {microservices.map(microservice => (
                            <option key={microservice.name} value={microservice.name}>{microservice.name}</option>
                        ))}
                    </select>
                </div>

            </div>
        </div>
    );
};

export default SmellCard;