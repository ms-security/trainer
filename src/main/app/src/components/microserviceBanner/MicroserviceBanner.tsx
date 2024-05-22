import React from 'react';
import './MicroserviceBanner.css';

interface MicroserviceBannerProps {
    microserviceName: string | undefined;
    microservices: string[];
    onMicroserviceChange: (newMicroserviceName: string) => void;
}

const MicroserviceBanner: React.FC<MicroserviceBannerProps> = ({
                                                                   microserviceName,
                                                                   microservices,
                                                                   onMicroserviceChange
                                                               }) => {
    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        onMicroserviceChange(event.target.value);
    };

    return (
        <select
            className={`microservice-select ${!microserviceName ? 'no-association' : 'associated'}`}
            value={microserviceName || ''}
            onChange={handleSelectChange}
        >
            <option value="">{microserviceName || 'Select a MicroService'}</option>
            {microservices.map(ms => (
                ms !== microserviceName && <option key={ms} value={ms}>{ms}</option>
            ))}
        </select>
    );
};

export default MicroserviceBanner;
