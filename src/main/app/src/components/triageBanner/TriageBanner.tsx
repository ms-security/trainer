// TriageBanner.tsx
import React from 'react';
import './TriageBanner.css'; // Your existing CSS file

interface TriageBannerProps {
    onClick: () => void; // Add this prop to handle the click event
}

const TriageBanner: React.FC<TriageBannerProps> = ({ onClick }) => {
    return (
        <div className="triage-banner" onClick={onClick}>
            To benefit from the triage for security smells, please enter information about the
            microservices.
        </div>
    );
};

export default TriageBanner;
