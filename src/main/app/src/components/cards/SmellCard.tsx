import React, {useEffect, useState} from 'react';
import './SmellCard.css';
import {Microservice} from "../../interfaces/Microservice";
import {Smell, SmellStatus, UrgencyCode} from "../../interfaces/Smell";
import {EffortTime} from "../../interfaces/EffortTime";
import EffortTimeBanner from "../effortTimeBanner/EffortTimeBanner";

interface SmellCardProps {
    smell: Smell,
    isChecked: boolean,
    onClick: () => void,
    microservices: Microservice[],
    onAssignMicroservice: (smellId: number, microserviceName: string) => void,
    onCheckboxChange?: (smellId: number, checkboxValue: boolean) => void,
    onStatusChange?: (smellId: number, newStatus: string) => Promise<void>,
}

const SmellCard: React.FC<SmellCardProps> = ({
                                                 smell,
                                                 isChecked,
                                                 microservices,
                                                 onAssignMicroservice,
                                                 onClick,
                                                 onCheckboxChange,
                                                 onStatusChange,
                                             }) => {

    const [selectedMicroservice, setSelectedMicroservice] = useState(
        smell.microservice ? smell.microservice.name : '');


    const getUrgencyClass = (code: UrgencyCode | undefined) => {
        return code ? `smellCard-urgency-indicator ${code}` : 'smellCard-urgency-indicator'; // Append the urgency code as a class
    };

    const urgencyCodeToName = (code: UrgencyCode | undefined) => {
        switch (code) {
            case 'HH':
                return 'High';
            case 'HM':
                return 'Medium to High';
            case 'MM':
                return 'Medium';
            case 'ML':
                return 'Low to Medium';
            case 'LL':
                return 'Low';
            case 'LN':
                return 'None to Low';
            case 'Ø':
                return 'None';
            default:
                return 'Undefined';
        }
    };

    // Function to call when a microservice is selected from the dropdown
    const handleMicroserviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const microserviceName = e.target.value;
        setSelectedMicroservice(microserviceName);
        if (microserviceName !== '') {
            onAssignMicroservice(smell.id, microserviceName);
        }
    };

    //Function to call when the checkbox is clicked
    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checkboxValue = e.target.checked;
        if (onCheckboxChange) {
            onCheckboxChange(smell.id, checkboxValue);
        }
    };

    //Function to call when the status of a smell is changed
    const handleSmellStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value;
        console.log('Status changed:', smell.id, newStatus);
        if (onStatusChange) {
            onStatusChange(smell.id, newStatus);
        }
    };

    useEffect(() => {
        setSelectedMicroservice(smell.microservice ? smell.microservice.name : '');
    }, [smell.microservice]);

    return (
        <div className="smellCard-container" onClick={onClick}>
            <div className="smellCard-checkBox-text-container">
                <div className="checkbox-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                </div>

                <div className="smellCard-extendedName-mainPart-container">
                    <h4 className="smellCard-extendedName">{smell.extendedName}</h4>
                    <div className="smellCard-mainPart-container">
                        <div className="smellCard-text">
                            <p className="smellCard-smellDescription">
                                {smell.outputAnalysis} - {smell.name}</p>
                            <p className="smellCard-smellDescription">
                                {smell.description.split('\n')[0]}</p>
                        </div>
                        <div className="smellCard-container-info">
                            <div className="importance-status">
                                <div className="status-dropdown">
                                    <select value={smell.status} onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                            onChange={(e) => {
                                                handleSmellStatusChange(e)
                                            }}>
                                        <option value="UNFIXED">Not fixed</option>
                                        <option value="FIXED">Fixed</option>
                                        <option value="FALSE_POSITIVE">False positive</option>
                                        <option value="NOT_GOING_TO_FIX">Not going to fix</option>
                                    </select>
                                </div>
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

                            <div className="smellCard-urgencyCode-container">
                                <div className={getUrgencyClass(smell.urgencyCode)}></div>
                                <div className="smellCard-urgencyCode-text">{urgencyCodeToName(smell.urgencyCode)}</div>
                            </div>

                            <div className="smellCard-effortTime">{smell.effortTime ? 'Effort time: ' + smell.effortTime.value + smell.effortTime.unitOfTime : 'Effort time: undefined'}</div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmellCard;