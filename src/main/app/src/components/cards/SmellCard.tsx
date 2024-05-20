import React, {useEffect, useState} from 'react';
import './SmellCard.css';
import {Microservice} from "../../interfaces/Microservice";
import {SmellStatus, UrgencyCode} from "../../interfaces/Smell";
import {EffortTime} from "../../interfaces/EffortTime";

interface SmellCardProps {
    smellId: number,
    smellMicroservice: Microservice | undefined,
    smellName: string,
    extendedName: string,
    outputAnalysis: string,
    smellDescription: string,
    urgencyCode: UrgencyCode | undefined,
    effortTime: EffortTime | undefined,
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
                                                 extendedName,
                                                 outputAnalysis,
                                                 smellMicroservice,
                                                 smellDescription,
                                                 urgencyCode,
                                                 isChecked,
                                                 microservices,
                                                 smellStatus,
                                                 effortTime,
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
        <div className="smellCard-container" onClick={onClick}>
            <div className="smellCard-checkBox-text-container">
                <div className="checkbox-container" onClick={(e) => {
                    e.stopPropagation();
                }}>
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                </div>

                <div className="smellCard-extendedName-mainPart-container">
                    <h4 className="smellCard-extendedName">{extendedName}</h4>
                    <div className="smellCard-mainPart-container">
                        <div className="smellCard-text">
                            <p className="smellCard-smellDescription">
                                {outputAnalysis} - {smellName}</p>
                            <p className="smellCard-smellDescription">
                                {smellDescription.split('\n')[0]}</p>
                        </div>
                        <div className="smellCard-container-info">
                            <div className="importance-status">
                                <div className="status-dropdown">
                                    <select value={smellStatus} onClick={(e) => {
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

                            <div className={getUrgencyClass(urgencyCode)}></div>

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
                </div>
            </div>

        </div>


        /*
            <div className="smell-card" onClick={onClick}>
                <div className="smellCard-checkBox-container">
                    <div className="checkbox-container" onClick={(e) => {e.stopPropagation();}}>
                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                    </div>
                </div>
                <div className="smell-card-right">
                    <div className="smell-header">
                        <h3 className="smellName">{smellName}</h3>
                        <p className="smell-description">{smellDescription}</p>
                    </div>
                    <div className="smell-footer">
                        <div className="importance-status">
                            <div className={getUrgencyClass(urgencyCode)}></div>
                            <div className="status-dropdown">
                                <select value={smellStatus} onClick={(e) => {
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
                    </div>
                </div>
            </div>*/
    );
};

export default SmellCard;