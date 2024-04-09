import React, { useState } from 'react';
import './SmellCard.css';

interface SmellCardProps {
    smellName: string;
    smellDescription: string;
    importance: 'none' | 'low' | 'medium' | 'high';
}

const SmellCard: React.FC<SmellCardProps> = ({
                                                 smellName,
                                                 smellDescription,
                                                 importance
                                             }) => {
    const [status, setStatus] = useState('unfixed');

    const handleStatusChange = (newStatus: string) => {
        setStatus(newStatus);
    };

    return (
        <div className="smell-card">
            <div className="smell-header">
                <h3 className="smellName">{smellName}</h3>
                <p className="smell-description">{smellDescription}</p>
            </div>
            <div className="smell-footer">
                <div className="importance-status">
                    <div className={`importance-indicator ${importance}`}></div>
                    <div className="status-dropdown">
                        <select value={status} onChange={(e) => handleStatusChange(e.target.value)}>
                            <option value="unfixed">Unfixed</option>
                            <option value="fixed">Mark as fixed</option>
                            <option value="false_positive">Mark as false positive</option>
                            <option value="wont_fix">Mark not going to fix</option>
                        </select>
                    </div>
                </div>
                <div className="checkbox-container">
                    <input type="checkbox"/>
                </div>
            </div>
        </div>
    );
};

export default SmellCard;