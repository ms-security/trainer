import React, {useEffect, useState} from 'react';
import './SmellCard.css';
import {Microservice} from "../../interfaces/Microservice";
import {UrgencyCode} from "../../interfaces/Smell";

interface SmellCardProps {
    smellId: number;
    smellMicroservice: Microservice | undefined;
    smellName: string;
    smellDescription: string;
    urgencyCode: UrgencyCode | undefined;
    onClick: () => void;
    microservices: Microservice[];
    onAssignMicroservice: (smellId: number, microserviceName: string) => void;
}

const SmellCard: React.FC<SmellCardProps> = ({
                                                 smellId,
                                                 smellName,
                                                 smellMicroservice,
                                                 smellDescription,
                                                 urgencyCode,
                                                 microservices,
                                                 onAssignMicroservice,
                                                 onClick
                                                }) => {
    const [status, setStatus] = useState('unfixed');
    const [selectedMicroservice, setSelectedMicroservice] = useState(
        smellMicroservice ? smellMicroservice.name : ''
    );

    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `urgency-indicator ${code}` : 'urgency-indicator'; // Append the urgency code as a class
    };
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

    useEffect(() => {
        setSelectedMicroservice(smellMicroservice ? smellMicroservice.name : '');
    }, [smellMicroservice]);

    return (
        <div className="smell-card" onClick={onClick}>
            <div className="smell-header">
                <h3 className="smellName">{smellName}</h3>
                <p className="smell-description">{smellDescription}</p>
            </div>
            <div className="smell-footer">
                <div className="importance-status">
                    <div className={getUrgencyClass(urgencyCode)}></div>
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
                    <select value={selectedMicroservice} onClick={(e) => {e.stopPropagation();}}  onChange={handleMicroserviceChange}>
                        <option value="" >Select Microservice</option>
                        {microservices.map(microservice => (
                            <option key={microservice.name} value={microservice.name}>
                                {microservice.name}
                            </option>
                        ))}
                    </select>
                </div>

            </div>
        </div>
    );
};

export default SmellCard;