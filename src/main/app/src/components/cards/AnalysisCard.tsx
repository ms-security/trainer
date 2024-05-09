import React from 'react';
import './AnalysisCard.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tooltip from '@mui/material/Tooltip';
import { faExclamationCircle, faStar as faStarRegular , faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";


// Define the prop types for the AnalysisCard component
interface AnalysisCardProps {
    name: String;
    date: string;
    isFavorite: boolean;
    isTriageValid: boolean;
    onFavoriteChange: () => void;
    onClick: () => void;
    onDelete: () => void;
}

// The AnalysisCard component displays information about an analysis
const AnalysisCard: React.FC<AnalysisCardProps> = ({
                                                       name,
                                                       date,
                                                       isFavorite,
                                                       isTriageValid,
                                                       onFavoriteChange,
                                                       onClick,
                                                       onDelete
                                                   }) => {

    const formattedDate = date.slice(0, 10);
    const smellValue = isTriageValid ? '10' : '0';

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
                        {/* Conditional rendering of triage warning icon */}
                        {!isTriageValid && (
                            <Tooltip title="To benefit from the triage for security smells, please enter information about the microservices.">
                                <div className="triage-warning-icon">
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                </div>
                            </Tooltip>
                        )}
                    </h2>
                    {/* Delete icon */}
                    <div className="delete-icon" onClick={(e) => {e.stopPropagation(); onDelete();}}>🗑️</div>
                </div>


                {/* Display the date of the analysis */}
                <h4 className="analysis-date">{formattedDate}</h4>
                {/* Container for the colored 'smell' indicators */}
                <div className="smells">
                    {/* Static placeholders for smell indicators */}
                    <span className={`smell red-smell`}>{smellValue}</span>
                    <span className={`smell orange-smell`}>{smellValue}</span>
                    <span className={`smell yellow-smell`}>{smellValue}</span>
                    <span className={`smell green-smell`}>{smellValue}</span>
                    <span className={`smell lightblue-smell`}>{smellValue}</span>
                    <span className={`smell blue-smell`}>{smellValue}</span>
                    <span className={`smell blank-smell`}>{smellValue}</span>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCard;
