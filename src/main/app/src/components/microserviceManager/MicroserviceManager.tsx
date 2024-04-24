import React, { useState } from 'react';
import './MicroserviceManager.css';
import { Microservice } from "../../interfaces/Microservice";

interface MicroserviceManagerProps {
    microservices: Microservice[];
    onClickModal: () => void;
    onEditMicroservice: (microservice: Microservice) => void;
    deleteMicroservice: (microserviceName: string) => void;
}

const MicroserviceManager: React.FC<MicroserviceManagerProps> = ({ microservices, onClickModal, onEditMicroservice, deleteMicroservice }) => {
    const [expandedMicroservice, setExpandedMicroservice] = useState<string | null>(null);

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
            <button onClick={onClickModal}>Add Microservice</button>
            <div className="microservice-list">
                {microservices.map(service => (
                    <div key={service.name} className="microservice-item">
                        <div className="microservice-name" onClick={() => toggleExpand(service.name)}>
                            {service.name}
                        </div>
                        {expandedMicroservice === service.name && (
                            <div className="microservice-details">
                                <p>Relevance: {service.relevance}</p>
                                <div className="action-buttons">
                                    <button onClick={() => onEditMicroservice(service)}>Edit</button>
                                    <button onClick={() => deleteMicroservice(service.name)}>Delete</button>
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
