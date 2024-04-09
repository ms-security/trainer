import React, { useState } from 'react';
import './AnalysisCard.css';

// Define the prop types for the AnalysisCard component
interface AnalysisCardProps {
    name: string;
    date: string;
    isFavorite: boolean;
    onFavoriteChange: (isFavorite: boolean) => void;
    onClick: () => void;
}

// The AnalysisCard component displays information about an analysis
const AnalysisCard: React.FC<AnalysisCardProps> = ({
                                                       name,
                                                       date,
                                                       isFavorite,
                                                       onFavoriteChange,
                                                       onClick
                                                   }) => {
    // State to track the favorite status
    const [favorite, setFavorite] = useState(isFavorite);

    // Handler to update the favorite status
    const handleFavoriteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFavorite(e.target.checked);
        onFavoriteChange(e.target.checked);
    };

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
                    {/* Static placeholder for favorite indicator */}
                    <label htmlFor="favorite-checkbox" className="star-label">★</label>
                    {/* Display the name of the analysis */}
                    <h2 className="analysis-name">{name}</h2>
                    {/* Delete icon */}
                    <div className="delete-icon">🗑️</div>
                </div>

                {/* Display the date of the analysis */}
                <h4 className="analysis-date">{date}</h4>
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
