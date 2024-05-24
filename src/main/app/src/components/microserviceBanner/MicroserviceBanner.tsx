import React, {useEffect, useState} from 'react';
import './MicroserviceBanner.css';
import {Microservice} from "../../interfaces/Microservice";

interface MicroserviceBannerProps {
    microservice: Microservice |  undefined;
    microservices: Microservice[];
    onMicroserviceChange: (microserviceId: number) => void;
}

const MicroserviceBanner: React.FC<MicroserviceBannerProps> = ({
                                                                   microservice,
                                                                   microservices,
                                                                   onMicroserviceChange
                                                               }) => {
    const [selectedMicroserviceId, setSelectedMicroserviceId] = useState(
        microservice ? microservice.id : -1);
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = parseInt(event.target.value, 10);
        onMicroserviceChange(selectedId)
    };

    useEffect(() => {
        setSelectedMicroserviceId(microservice ? microservice.id : -1);
    }, [microservice]);

    return (
        <select
            className={`microservice-select ${!microservice ? 'no-association' : 'associated'}`}
            value={selectedMicroserviceId}
            onChange={handleSelectChange}
        >
            <option value="-1">Select a Microservice</option>
            {microservices.map(ms => (
                <option key={ms.id} value={ms.id}>
                    {ms.name}
                </option>
            ))}
        </select>
    );
};

export default MicroserviceBanner;
