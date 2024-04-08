import React, { useState } from 'react';
import './AnalysisCard.css';

interface AnalysisCardProps {
    name: string;
    date: string;
    isFavorite: boolean;
    onFavoriteChange: (isFavorite: boolean) => void;
    onClick: () => void;
}

const AnalysisCard: React.FC<AnalysisCardProps> = ({ name, date, isFavorite, onFavoriteChange, onClick }) => {
    const [favorite, setFavorite] = useState(isFavorite);

    const handleFavoriteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFavorite(e.target.checked);
        onFavoriteChange(e.target.checked);
    };

    return (
        <div className="analysis-card" onClick={onClick}>
            {/*<input
                type="checkbox"
                id="favorite-checkbox"
                checked={favorite}
                className="favorite-checkbox"
                onChange={handleFavoriteChange}
                onClick={(e) => e.stopPropagation()}
            />*/}
            <div className="parent_date_favorite">
                <div className="parent_name_favorite">
                    <label htmlFor="favorite-checkbox" className="star-label">★</label>
                    <h2 className="analysis-name">{name}</h2>
                    <div className="delete-icon">🗑️</div>
                </div>

                <h4 className="analysis-date">{date}</h4>
                <div className="smells">
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