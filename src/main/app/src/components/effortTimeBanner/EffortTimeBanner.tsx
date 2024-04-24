import React from 'react';
import './EffortTimeBanner.css';
import {EffortTime, UnitOfTime} from "../../interfaces/EffortTime";

interface EffortTimeBannerProps {
    effortTime: EffortTime | undefined;
    onEffortTimeChange: (newEffortTime: EffortTime) => void;
}

const EffortTimeBanner: React.FC<EffortTimeBannerProps> = ({ effortTime, onEffortTimeChange }) => {
    const handleBannerClick = () => {
        const inputValue = prompt('Enter effort time value:', effortTime?.value.toString() || '');
        let unitOfTime = prompt('Enter unit of measure (min, h, d):', effortTime?.unitOfTime || '');

        if (inputValue && unitOfTime) {
            // Converti l'input in maiuscolo per matchare i valori dell'enum
            console.log(unitOfTime);
            unitOfTime = unitOfTime.toUpperCase();
            console.log(unitOfTime);

            // Verifica che il valore inserito sia uno dei valori validi dell'enum
            if (Object.values(UnitOfTime).includes(unitOfTime as UnitOfTime)) {
                const newEffortTime = { value: parseInt(inputValue), unitOfTime: unitOfTime as UnitOfTime };
                onEffortTimeChange(newEffortTime);
            } else {
                alert('Please enter a valid unit of measure: min, h, or d.');
            }
        }
    };

    return (
        <div className={`effortTime-banner ${effortTime ? 'set' : 'not-set'}`} onClick={handleBannerClick}>
            {effortTime ? `Effort Time: ${effortTime.value} ${effortTime.unitOfTime}` : 'Insert Effort Time'}
        </div>
    );
};

export default EffortTimeBanner;
