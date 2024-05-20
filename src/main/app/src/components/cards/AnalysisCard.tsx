import React from 'react';
import './AnalysisCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '@mui/material/Tooltip';
import { faExclamationCircle, faStar as faStarRegular, faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import {Smell, UrgencyCode} from "../../interfaces/Smell";


// Define the prop types for the AnalysisCard component
interface AnalysisCardProps {
    name: string;
    date: string;
    isFavorite: boolean;
    isTriageValid: boolean;
    onFavoriteChange: () => void;
    onClick: () => void;
    onDelete: () => void;
    smells: Smell[];
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
                                                       name,
                                                       date,
                                                       isFavorite,
                                                       isTriageValid,
                                                       onFavoriteChange,
                                                       onClick,
                                                       onDelete,
                                                       smells
                                                   }) => {
    const formattedDate = date.slice(0, 10);

    const urgencyToColor = {
        HH: 'red-smell',
        H: 'orange-smell',
        MM: 'yellow-smell',
        M: 'green-smell',
        LL: 'lightblue-smell',
        L: 'blue-smell',
        Ø: 'blank-smell',
        null: 'undefined-smell'
    };

    // Function to count smells by urgency
    const countSmellsByUrgency = (urgency?: UrgencyCode | null) => {
        return smells.filter(smell => smell.urgencyCode === urgency).length;
    };

    const smellCounts = {
        'red-smell': countSmellsByUrgency(UrgencyCode.HH),
        'orange-smell': countSmellsByUrgency(UrgencyCode.H),
        'yellow-smell': countSmellsByUrgency(UrgencyCode.MM),
        'green-smell': countSmellsByUrgency(UrgencyCode.M),
        'lightblue-smell': countSmellsByUrgency(UrgencyCode.LL),
        'blue-smell': countSmellsByUrgency(UrgencyCode.L),
        'blank-smell': countSmellsByUrgency(UrgencyCode.Ø),
        'undefined-smell': countSmellsByUrgency(null)
    };

    // Render the analysis card
    return (
        <div className="analysis-card" onClick={onClick}>
            <div className="parent_date_favorite">
                <div className="parent_name_favorite">
                    <div className="favorite-icon" onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteChange();
                    }}>
                        <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} className={`star ${isFavorite ? "star-favorite" : ""}`} />
                    </div>
                    <h2 className="analysis-name">
                        {name}
                        {!isTriageValid && (
                            <Tooltip title="To benefit from the triage for security smells, please enter information about the microservices.">
                                <div className="triage-warning-icon">
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                </div>
                            </Tooltip>
                        )}
                    </h2>
                    <div className="delete-icon" onClick={(e) => {e.stopPropagation(); onDelete();}}>🗑️</div>
                </div>
                <h4 className="analysis-date">{formattedDate}</h4>
                <div className="smells">
                    {Object.entries(smellCounts).map(([colorClass, count]) => (
                        <span key={colorClass} className={`smell ${colorClass}`}>{count}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AnalysisCard;
