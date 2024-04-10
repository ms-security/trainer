import React, { useState, ChangeEvent, FormEvent } from 'react';

type QualityAttributes = {
    [key: string]: string;
};

interface Microservice {
    name: string;
    importance: string;
    qualities: QualityAttributes;
}

const importanceLevels = ['High', 'Medium', 'Low', 'None'];
const qualityAttributes = [
    'confidentiality', 'integrity', 'authenticity',
    'independent deployability', 'horizontal scalability', 'failure isolation', 'decentralization',
    'resource utilization', 'time behaviour', 'capacity',
    'modularity', 'reusability', 'analysability', 'modifiability', 'testability'
];

const MicroserviceForm: React.FC = () => {
    const [microservices, setMicroservices] = useState<Microservice[]>([]);
    const [newMicroservice, setNewMicroservice] = useState<Microservice>({
        name: '',
        importance: 'None',
        qualities: {}
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewMicroservice(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleQualityChange = (quality: string, importance: string) => {
        setNewMicroservice(prevState => ({
            ...prevState,
            qualities: {
                ...prevState.qualities,
                [quality]: importance
            }
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setMicroservices(prevMicroservices => [...prevMicroservices, newMicroservice]);
        setNewMicroservice({ name: '', importance: 'None', qualities: {} }); // Reset form
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

                <label htmlFor="importance">Importance:</label>
                <select
                    id="importance"
                    name="importance"
                    value={newMicroservice.importance}
                    onChange={handleInputChange}
                >
                    {importanceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                    ))}
                </select>

                <fieldset>
                    <legend>Quality Attributes:</legend>
                    {qualityAttributes.map(quality => (
                        <div key={quality}>
                            <label htmlFor={`quality-${quality}`}>{quality}:</label>
                            <select
                                id={`quality-${quality}`}
                                value={newMicroservice.qualities[quality] || 'None'}
                                onChange={(e) => handleQualityChange(quality, e.target.value)}
                            >
                                {importanceLevels.map(level => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </fieldset>

                <button type="submit">Add Microservice</button>
            </form>

            <h2>Microservices List:</h2>
            {microservices.map((ms, index) => (
                <div key={index}>
                    <h3>{ms.name} ({ms.importance})</h3>
                    <ul>
                        {Object.entries(ms.qualities).map(([quality, importance]) => (
                            <li key={quality}>{quality}: {importance}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default MicroserviceForm;
