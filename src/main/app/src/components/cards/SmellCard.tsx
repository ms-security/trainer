import React, {useEffect, useState} from 'react';
import './SmellCard.css';
import {Microservice} from "../../interfaces/Microservice";
import {SmellStatus, UrgencyCode} from "../../interfaces/Smell";

interface SmellCardProps {
    smellId: number,
    smellMicroservice: Microservice | undefined,
    smellName: string,
    smellDescription: string,
    urgencyCode: UrgencyCode | undefined,
    isChecked: boolean,
    onClick: () => void,
    microservices: Microservice[],
    onAssignMicroservice: (smellId: number, microserviceName: string) => void,
    onCheckboxChange?: (smellId: number, checkboxValue: boolean) => void,
    onStatusChange?: (smellId: number, newStatus: string) => Promise<void>,
    smellStatus?: SmellStatus
}

const SmellCard: React.FC<SmellCardProps> = ({
                                                 smellId,
                                                 smellName,
                                                 smellMicroservice,
                                                 smellDescription,
                                                 urgencyCode,
                                                 isChecked,
                                                 microservices,
                                                 smellStatus,
                                                 onAssignMicroservice,
                                                 onClick,
                                                 onCheckboxChange,
                                                 onStatusChange,
                                             }) => {

    const [selectedMicroservice, setSelectedMicroservice] = useState(
        smellMicroservice ? smellMicroservice.name : '');


    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `urgency-indicator ${code}` : 'urgency-indicator'; // Append the urgency code as a class
    };

    // Function to call when a microservice is selected from the dropdown
    const handleMicroserviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const microserviceName = e.target.value;
        setSelectedMicroservice(microserviceName);
        if (microserviceName !== '') {
            onAssignMicroservice(smellId, microserviceName);
        }
    };

    //Function to call when the checkbox is clicked
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checkboxValue = e.target.checked;
        if (onCheckboxChange) {
            onCheckboxChange(smellId, checkboxValue);
        }
    };

    //Function to call when the status of a smell is changed
    const handleSmellStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        console.log('Status changed:', smellId, newStatus);
        if (onStatusChange) {
            onStatusChange(smellId, newStatus);
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
                        <select value={smellStatus} onClick={(e) => {e.stopPropagation();}}
                                onChange={(e) => {handleSmellStatusChange(e)}}>
                            <option value="UNFIXED">Unfixed</option>
                            <option value="FIXED">Mark as fixed</option>
                            <option value="FALSE_POSITIVE">Mark as false positive</option>
                            <option value="WONT_FIX">Mark not going to fix</option>
                        </select>
                    </div>
                </div>
                <div className="checkbox-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                </div>
                <div className="microservice-dropdown">
                    <select value={selectedMicroservice} onClick={(e) => {
                        e.stopPropagation();
                    }}
                            onChange={handleMicroserviceChange}>
                        <option value="">Select Microservice</option>
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