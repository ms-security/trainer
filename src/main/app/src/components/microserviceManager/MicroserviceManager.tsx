import React, { useState } from 'react';
import './MicroserviceManager.css';
import { Microservice } from "../../interfaces/Microservice";
import {Relevance} from "../../interfaces/QualityAttribute";

interface MicroserviceManagerProps {
    microservices: Microservice[];
    onClickModal: () => void;
    onEditMicroservice: (microservice: Microservice) => void;
    deleteMicroservice: (microserviceName: string) => void;
}

const MicroserviceManager: React.FC<MicroserviceManagerProps> = ({ microservices, onClickModal, onEditMicroservice, deleteMicroservice }) => {
    const [expandedMicroservice, setExpandedMicroservice] = useState<string | null>(null);

    const getRelevanceColor = (relevance: Relevance) => {
        switch (relevance) {
            case 'HIGH':
                return 'relevance-high';
            case 'MEDIUM':
                return 'relevance-medium';
            case 'LOW':
                return 'relevance-low';
            default:
                return '';
        }
    };

    const toggleExpand = (serviceName: string) => {
        if (expandedMicroservice === serviceName) {
            setExpandedMicroservice(null);
        } else {
            setExpandedMicroservice(serviceName);
        }
    };

    return (
        <div className="microservice-manager">
            <h2 className="microservice-title">Microservices Information</h2>
            <button className = "add-microservice-btn" onClick={onClickModal}>Add Microservice</button>
            <div className="microservice-list">
                {microservices.map(service => (
                    <div key={service.name} className="microservice-item" onClick={() => toggleExpand(service.name)}>
                        <div className="microservice-name" >
                            {service.name}
                        </div>
                        {expandedMicroservice === service.name && (
                        <div className="microservice-details">
                            <p className="relevance-label">Relevance: <span className={getRelevanceColor(service.relevance)}>{service.relevance}</span></p>
                            {service.qualityAttributes.length > 0 && (
                                <div className="quality-attributes">
                                    {service.qualityAttributes.map(attr => (
                                        <div key={attr.name} className="quality-attribute">
                                            <span className="attribute-name">{attr.name}:</span>
                                            <span className={`${getRelevanceColor(attr.relevance)} attribute-relevance`}>{attr.relevance}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                                <div className="action-buttons">
                                    <button className="edit-button" onClick={() => onEditMicroservice(service)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteMicroservice(service.name)}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MicroserviceManager;
