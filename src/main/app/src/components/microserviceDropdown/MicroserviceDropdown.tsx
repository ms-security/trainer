import React, {useEffect, useRef, useState} from 'react';
import { Microservice } from "../../interfaces/Microservice";
import './MicroserviceDropdown.css';
import {Relevance} from "../../interfaces/QualityAttribute";
import MicroserviceDetailsCard from "../cards/MicroserviceDetailCard";

interface MicroserviceDropdownProps {
    microservices: Microservice[];
    onSelect: (microservice: Microservice) => void;
    onEditMicroservice: (microservice: Microservice) => void;
    deleteMicroservice: (microserviceName: string) => void;
}

const MicroserviceDropdown: React.FC<MicroserviceDropdownProps> = ({ microservices, onSelect, onEditMicroservice, deleteMicroservice }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMicroservice, setSelectedMicroservice] = useState<Microservice | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = () => {
        setIsOpen(prevIsOpen => {
            if (prevIsOpen) {
                setSelectedMicroservice(null);
            }
            return !prevIsOpen;
        });
    };


    const handleSelect = (microservice: Microservice) => {
        if(selectedMicroservice?.name === microservice.name) {
            setSelectedMicroservice(null);
            return;
        }
        setSelectedMicroservice(microservice)
        onSelect(microservice);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsOpen(false);
            setSelectedMicroservice(null);
        }
    };

    const handleDelete = (microserviceName: string) => {
        deleteMicroservice(microserviceName);
        setSelectedMicroservice(null);
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <div className="dropdown-container" ref={dropdownRef}>
            <button className="dropdown-button" onClick={toggleDropdown}>
                Microservices List
                <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-menu">
                    {microservices.length === 0 ? (
                        <div className="dropdown-item no-microservices">No microservices</div>
                    ) : (
                        microservices.map((microservice, index) => (
                            <div
                                key={microservice.name}
                                className={`dropdown-item ${selectedMicroservice?.name === microservice.name ? 'selected' : ''}`}
                                onClick={() => handleSelect(microservice)}
                            >
                                {microservice.name}
                            </div>
                        ))
                    )}
                </div>
            )}
            {selectedMicroservice && (
                <div className="microservice-details-container">
                    <MicroserviceDetailsCard
                        microservice={selectedMicroservice}
                        onEditMicroservice={onEditMicroservice}
                        deleteMicroservice={handleDelete}
                    />
                </div>
            )}
        </div>
    );
};

export default MicroserviceDropdown;
