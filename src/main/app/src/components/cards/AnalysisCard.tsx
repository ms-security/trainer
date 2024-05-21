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
    onFavoriteChange: () => void;
    onClick: () => void;
    onDelete: () => void;
    smells: Smell[];
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({
                                                       name,
                                                       date,
                                                       isFavorite,
                                                       onFavoriteChange,
                                                       onClick,
                                                       onDelete,
                                                       smells
                                                   }) => {
    const formattedDate = date.slice(0, 10);

    // Function to count smells by urgency
    const countSmellsByUrgency = (urgency?: UrgencyCode | null) => {
        return smells.filter(smell => smell.urgencyCode === urgency).length;
    };

    const smellCounts = {
        'red-smell': countSmellsByUrgency(UrgencyCode.HH),
        'orange-smell': countSmellsByUrgency(UrgencyCode.HM),
        'yellow-smell': countSmellsByUrgency(UrgencyCode.MM),
        'green-smell': countSmellsByUrgency(UrgencyCode.ML),
        'lightblue-smell': countSmellsByUrgency(UrgencyCode.LL),
        'blue-smell': countSmellsByUrgency(UrgencyCode.LN),
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
                        <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} size="1x" className={`star ${isFavorite ? "star-favorite" : ""}`} />
                    </div>
                    <h2 className="analysis-name">{name}</h2>
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
