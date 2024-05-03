import React, {useState, ChangeEvent, FormEvent, useEffect} from 'react';
import { Microservice} from "../../interfaces/Microservice";
import {Category, QualityAttribute, QualityAttributeMS, Relevance} from "../../interfaces/QualityAttribute";

interface MicroserviceFormProps {
    onAddMicroservice: (data: any) => void;
    onUpdateMicroservice?: (data: any) => void;  // Nuova funzione per l'update
    initialData?: Microservice;  // Dati iniziali per la modifica
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

const MicroserviceForm: React.FC<MicroserviceFormProps> = ({ onAddMicroservice, onUpdateMicroservice, initialData }) => {
    const [newMicroservice, setNewMicroservice] = useState<Microservice>(initialData || {
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
        const dataToSend = {
            name: newMicroservice.name,
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
                    readOnly={!!initialData}
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

                <button type="submit">{initialData ? 'Update Microservice' : 'Add Microservice'}</button>
            </form>
        </div>
    );
};

export default MicroserviceForm;
