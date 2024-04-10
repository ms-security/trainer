import React, { useState } from 'react';
import './AnalysisCard.css';
import { faStar as faStarSolid } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Define the prop types for the AnalysisCard component
interface AnalysisCardProps {
    name: string;
    date: string;
    isFavorite: boolean;
    onFavoriteChange: () => void;
    onClick: () => void;
    onDelete: () => void;
}

// The AnalysisCard component displays information about an analysis
const AnalysisCard: React.FC<AnalysisCardProps> = ({
                                                       name,
                                                       date,
                                                       isFavorite,
                                                       onFavoriteChange,
                                                       onClick,
                                                       onDelete
                                                   }) => {

    console.log("AnalysisCard props:", { name, date, isFavorite }); // Aggiungi questo

    const formattedDate = date.slice(0, 10);

    // Render the analysis card
    return (
        <div className="analysis-card" onClick={onClick}>
            {/* Checkbox for favorite toggling is commented out for now */}
            {/* <input
                type="checkbox"
                id="favorite-checkbox"
                checked={favorite}
                className="favorite-checkbox"
                onChange={handleFavoriteChange}
                // Prevent the checkbox click from triggering the card click event
                onClick={(e) => e.stopPropagation()}
            /> */}
            <div className="parent_date_favorite">
                <div className="parent_name_favorite">
                    <div className="favorite-icon" onClick={(e) => {
                        e.stopPropagation();
                        onFavoriteChange();
                    }}>
                        <FontAwesomeIcon icon={isFavorite ? faStarSolid : faStarRegular} className={`star ${isFavorite ? "star-favorite" : ""}`} />
                    </div>
                    <h2 className="analysis-name">{name}</h2>
                    {/* Delete icon */}
                    <div className="delete-icon" onClick={(e) => {e.stopPropagation(); onDelete();}}>🗑️</div>
                </div>

                {/* Display the date of the analysis */}
                <h4 className="analysis-date">{formattedDate}</h4>
                {/* Container for the colored 'smell' indicators */}
                <div className="smells">
                    {/* Static placeholders for smell indicators */}
                    <span className="smell red-smell">10</span>
                    <span className="smell orange-smell">10</span>
                    <span className="smell yellow-smell">10</span>
                    <span className="smell green-smell">10</span>
                    <span className="smell lightblue-smell">10</span>
                    <span className="smell blue-smell">10</span>
                </div>
            </div>
        </div>
    );
};

export default AnalysisCard;
