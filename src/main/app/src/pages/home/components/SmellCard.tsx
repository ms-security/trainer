// Crea un nuovo file SmellCard.tsx nel tuo progetto
import React from 'react';
import './SmellCard.css'; // Assicurati di creare questo file CSS e di importarlo

interface SmellCardProps {
    name: string;
    description: string;
}

const SmellCard: React.FC<SmellCardProps> = ({ name, description }) => {
    return (
        <div className="smell-card">
            <h3 className="smell-name">{name}</h3>
            <p className="smell-description">{description}</p>
        </div>
    );
};

export default SmellCard;
