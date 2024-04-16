import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Microservice} from "../../interfaces/Microservice";
import {Category, QualityAttribute, QualityAttributeMS, Relevance} from "../../interfaces/QualityAttribute";

interface MicroserviceFormProps {
    onAddMicroservice: (data: any) => void;
}

const qualityAttributes: QualityAttributeMS[] = [
    { name: 'confidentiality', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'integrity', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'authenticity', relevance: Relevance.NONE, category: Category.SECURITY },
    { name: 'resource utilization', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'time behaviour', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'capacity', relevance: Relevance.NONE, category: Category.PERFORMANCE_EFFICIENCY },
    { name: 'modularity', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'reusability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'analysability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'modifiability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY },
    { name: 'testability', relevance: Relevance.NONE, category: Category.MAINTAINABILITY }
];

const MicroserviceForm: React.FC<MicroserviceFormProps> = ({ onAddMicroservice }) => {
    const [newMicroservice, setNewMicroservice] = useState<Microservice>({
        name: '',
        relevance: Relevance.NONE,
        qualityAttributes: [...qualityAttributes]
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMicroservice(prev => ({
            ...prev,
            [name]: value
        }));
    };

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
        const dataToSend = {
            name: newMicroservice.name,
            relevance: newMicroservice.relevance,
            qualityAttributes: newMicroservice.qualityAttributes
                .filter(attr => attr.relevance !== Relevance.NONE)
                .map(attr => ({ name: attr.name, relevance: attr.relevance, category: attr.category }))
        };
        onAddMicroservice(dataToSend);
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
                <legend>{category}</legend>
                {filteredAttributes.map((attr, index) => (
                    <div key={index}>
                        <label htmlFor={`quality-${attr.name}`}>{attr.name}:</label>
                        <select
                            id={`quality-${attr.name}`}
                            value={attr.relevance}
                            onChange={(e) => handleQualityChange(attr.name, e.target.value as Relevance)}
                        >
                            {Object.values(Relevance).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                ))}
            </fieldset>
        );
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label htmlFor="name">Microservice Name:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={newMicroservice.name}
                    onChange={handleInputChange}
                />

                <label htmlFor="relevance">Relevance:</label>
                <select
                    id="relevance"
                    name="relevance"
                    value={newMicroservice.relevance}
                    onChange={handleInputChange}
                >
                    {Object.values(Relevance).map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                {renderCategoryGroup(Category.SECURITY)}
                {renderCategoryGroup(Category.PERFORMANCE_EFFICIENCY)}
                {renderCategoryGroup(Category.MAINTAINABILITY)}

                <button type="submit">Add Microservice</button>
            </form>
        </div>
    );
};

export default MicroserviceForm;
