import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Microservice } from "../../interfaces/Microservice";
import { Category, QualityAttributeMS, Relevance } from "../../interfaces/QualityAttribute";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './MicroserviceForm.css';
interface MicroserviceFormProps {
    onAddMicroservice: (data: any) => void;
    onUpdateMicroservice?: (data: any) => void;
    initialData?: Microservice;
    microservicesList?: Microservice[];
}

const qualityAttributes: QualityAttributeMS[] = [
    { name: 'Confidentiality', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'Integrity', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'Authenticity', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'Resource utilization', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'Time behaviour', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'Capacity', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'Modularity', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'Reusability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'Analysability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'Modifiability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'Testability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY }
];

const MicroserviceForm: React.FC<MicroserviceFormProps> = ({ onAddMicroservice, onUpdateMicroservice, initialData, microservicesList }) => {
    const [newMicroservice, setNewMicroservice] = useState<Microservice>(initialData || {
        name: '',
        relevance: Relevance.NONE,
        qualityAttributes: [...qualityAttributes]
    });
    const [nameError, setNameError] = useState<string>('');

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewMicroservice(prev => ({
            ...prev,
            [name]: value
        }));
        validateName(value);
    };

    const validateName = (name: string) => {
        if (name.trim() === '') {
            setNameError('Microservice name cannot be empty.');
        } else if (name.length > 20) {
            setNameError('Microservice name cannot be longer than 20 characters.');
        } else if (microservicesList?.some(ms => ms.name === name)) {
            setNameError('Microservice name already exists.');
        } else {
            setNameError('');
        }
    };

    const handleRelevanceChange = (value: Relevance) => {
        setNewMicroservice(prev => ({
            ...prev,
            relevance: value
        }));
    };

    useEffect(() => {
        if (initialData) {
            const updatedQualityAttributes = qualityAttributes.map(defaultAttr => {
                const existingAttr = initialData.qualityAttributes.find(attr => attr.name === defaultAttr.name);
                return existingAttr || defaultAttr;
            });

            setNewMicroservice({
                name: initialData.name,
                relevance: initialData.relevance,
                qualityAttributes: updatedQualityAttributes,
            });
        }
    }, [initialData]);

    const handleQualityChange = (name: string, value: Relevance) => {
        const updatedQualityAttributes = newMicroservice.qualityAttributes.map(attr =>
            attr.name === name ? { ...attr, relevance: value } : attr
        );
        setNewMicroservice(prev => ({
            ...prev,
            qualityAttributes: updatedQualityAttributes
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (nameError) {
            return;
        }
        const trimmedName = newMicroservice.name.trim();
        const dataToSend = {
            name: trimmedName,
            relevance: newMicroservice.relevance,
            qualityAttributes: newMicroservice.qualityAttributes
                .filter(attr => attr.relevance !== Relevance.NONE)
                .map(attr => ({ name: attr.name, relevance: attr.relevance, category: attr.category }))
        };
        if (initialData) {
            onUpdateMicroservice?.(dataToSend);
        } else {
            onAddMicroservice(dataToSend);
        }

        setNewMicroservice({
            name: '',
            relevance: Relevance.NONE,
            qualityAttributes: [...qualityAttributes]
        });
    };

    const renderCategoryGroup = (category: Category) => {
        const filteredAttributes = newMicroservice.qualityAttributes.filter(attr => attr.category === category);
        return (
            <fieldset>
                <legend>{category.replace(/_/g, ' ')}</legend>
                {filteredAttributes.map((attr) => (
                    <div key={attr.name} className="quality-attribute-form">
                        <span className="attribute-name-form">{attr.name}:</span>
                        <div className="relevance-buttons-form">
                            {Object.values(Relevance).map(level => (
                                <button
                                    key={level}
                                    type="button"
                                    className={`relevance-button-form ${attr.relevance === level ? `${level.toLowerCase()}-form selected-form` : ''}`}
                                    onClick={() => handleQualityChange(attr.name, level)}
                                >
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </fieldset>
        );
    };

    return (
        <div>
            <form className= "microservice-form" onSubmit={handleSubmit}>
                <label className= "inputNameLabel-form" htmlFor="name">Microservice Name:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={newMicroservice.name}
                    onChange={handleInputChange}
                    readOnly={!!initialData}
                    className={nameError ? 'input-error-form' : 'input-form'}
                />

                {nameError && (
                    <span className="error-message">
                        <FontAwesomeIcon icon={faExclamationCircle} className="error-icon" />
                        {nameError}
                    </span>
                )}

                <div className="relevance-section-form">
                    <label className="Microservice-relevance-label">Microservice's Relevance:</label>
                    <div className="relevance-buttons-form">
                        {Object.values(Relevance).map(level => (
                            <button
                                key={level}
                                type="button"
                                className={`relevance-button-form ${newMicroservice.relevance === level ? `${level.toLowerCase()}-form selected-form` : ''}`}
                                onClick={() => handleRelevanceChange(level)}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {renderCategoryGroup(Category.SECURITY)}
                {renderCategoryGroup(Category.PERFORMANCE_EFFICIENCY)}
                {renderCategoryGroup(Category.MAINTAINABILITY)}

                <button className="submit-button-form" type="submit" disabled={!!nameError || newMicroservice.name.trim() === ''}>{initialData ? 'Update Microservice' : 'Add Microservice'}</button>            </form>
        </div>
    );
};

export default MicroserviceForm;
