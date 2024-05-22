import React from 'react';
import { Microservice } from "../../interfaces/Microservice";
import './MicroserviceDetailCard.css';

interface MicroserviceDetailsCardProps {
    microservice: Microservice;
    onEditMicroservice: (microservice: Microservice) => void;
    deleteMicroservice: (microserviceName: string) => void;
}

const MicroserviceDetailsCard: React.FC<MicroserviceDetailsCardProps> = ({ microservice , onEditMicroservice, deleteMicroservice}) => {
    const getRelevanceColor = (relevance: string) => {
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

    return (
        <div className="microservice-details">
            <p className="relevance-label">Relevance: <span className={getRelevanceColor(microservice.relevance)}>{microservice.relevance}</span></p>
            {microservice.qualityAttributes.length > 0 && (
                <div className="quality-attributes">
                    {microservice.qualityAttributes.map(attr => (
                        <div key={attr.name} className="quality-attribute">
                            <span className="attribute-name">{attr.name}:</span>
                            <span className={`${getRelevanceColor(attr.relevance)} attribute-relevance`}>{attr.relevance}</span>
                        </div>
                    ))}
                </div>
            )}
            <div className="action-buttons">
                <button className="edit-button" onClick={() => onEditMicroservice(microservice)}>Edit</button>
                <button className="delete-button" onClick={() => deleteMicroservice(microservice.name)}>Delete</button>
            </div>
        </div>
    );
};

export default MicroserviceDetailsCard;