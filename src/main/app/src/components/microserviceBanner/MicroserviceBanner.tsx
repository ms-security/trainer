import React from 'react';
import './MicroserviceBanner.css';

interface MicroserviceBannerProps {
    microserviceName: string | undefined;
}

// Assumi che il componente riceva il nome del microservizio come prop
const MicroserviceBanner: React.FC<MicroserviceBannerProps> = ({ microserviceName }) => {
    return (
        <div className={`microservice-banner ${microserviceName ? 'associated' : 'no-association'}`}>
            {"MicroService: " +microserviceName || 'No MicroService associated'}
        </div>
    );
};

export default MicroserviceBanner;
