import React from 'react';
import './AnalysisCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '@mui/material/Tooltip';
import {
    faExclamationCircle,
    faStar as faStarRegular,
    faStar as faStarSolid,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { Smell, UrgencyCode } from "../../interfaces/Smell";

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

    const countSmellsByUrgency = (urgency?: UrgencyCode | null) => {
        return smells.filter(smell => smell.urgencyCode === urgency && smell.status === "NOT_FIXED").length;
    };

    const countNotFixedSmells = () => {
        return smells.filter(smell => smell.status === "NOT_FIXED").length;
    };

    const smellCounts = {
        'High': countSmellsByUrgency(UrgencyCode.HH),
        'Medium-to-High': countSmellsByUrgency(UrgencyCode.HM),
        'Medium': countSmellsByUrgency(UrgencyCode.MM),
        'Low-to-Medium': countSmellsByUrgency(UrgencyCode.ML),
        'Low': countSmellsByUrgency(UrgencyCode.LL),
        'None-to-Low': countSmellsByUrgency(UrgencyCode.LN),
        'None': countSmellsByUrgency(UrgencyCode.Ø),
        'undefined': countSmellsByUrgency(null)
    };

    const totalNotFixedSmells = countNotFixedSmells();

    return (
        <div className="analysis-card" onClick={onClick}>
            <div className="parent_date_favorite">
                <div className="parent_name_favorite">
                    <div className="favorite-icon" onClick={e => { e.stopPropagation(); onFavoriteChange(); }}>
                        <Tooltip title="Add to Favorites" arrow>
                            <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} size="1x" className={`star ${isFavorite ? "star-favorite" : ""}`} />
                        </Tooltip>
                    </div>
                    <h2 className="analysis-name">{name}</h2>
                    <Tooltip title="Delete Analysis" arrow>
                        <div className="delete-icon" onClick={e => { e.stopPropagation(); onDelete(); }}>
                            <FontAwesomeIcon icon={faTrash} size="1x" />
                        </div>
                    </Tooltip>

                </div>
                <h4 className="analysis-date">{formattedDate}</h4>
                <div className="smells">
                    {Object.entries(smellCounts).map(([urgencyClass, count]) => (
                        <Tooltip title={urgencyClass.replaceAll('-', ' ')} arrow key={urgencyClass}>
                            <span className={`smell ${urgencyClass}`}>{count}</span>
                        </Tooltip>
                    ))}
                    <Tooltip title="Not Fixed Smells" arrow>
                        <div className="analysisCard-smellNumber">{totalNotFixedSmells} Smells</div>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCard;
