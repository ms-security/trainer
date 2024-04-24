/*
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
/*
import React, { useState } from 'react';
import './EffortTimeBanner.css';
import { EffortTime, UnitOfTime } from "../../interfaces/EffortTime";

interface EffortTimeBannerProps {
    effortTime: EffortTime | undefined;
    onEffortTimeChange: (newEffortTime: EffortTime) => void;
}

const EffortTimeBanner: React.FC<EffortTimeBannerProps> = ({ effortTime, onEffortTimeChange }) => {
    const [value, setValue] = useState(effortTime?.value.toString() || '');
    const [unitOfTime, setUnitOfTime] = useState(effortTime?.unitOfTime || '');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (value && unitOfTime && Object.values(UnitOfTime).includes(unitOfTime.toUpperCase() as UnitOfTime)) {
            const newEffortTime = { value: parseInt(value), unitOfTime: unitOfTime.toUpperCase() as UnitOfTime };
            onEffortTimeChange(newEffortTime);
        } else {
            alert('Please enter a valid value and unit of measure: min, h, or d.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`effortTime-banner ${effortTime ? 'set' : 'not-set'}`}>
            <input
                type="number"
                value={value}
                onChange={e => setValue(e.target.value)}
                placeholder="Enter effort time value"
            />
            <select value={unitOfTime} onChange={e => setUnitOfTime(e.target.value)}>
                <option value="">Select Unit</option>
                <option value="min">Minutes (min)</option>
                <option value="h">Hours (h)</option>
                <option value="d">Days (d)</option>
            </select>
            <button type="submit">Update Effort Time</button>
        </form>
    );
};

export default EffortTimeBanner;
*/

import React, { useState } from 'react';
import './EffortTimeBanner.css';
import { EffortTime, UnitOfTime } from "../../interfaces/EffortTime";

interface EffortTimeBannerProps {
    effortTime: EffortTime | undefined;
    onEffortTimeChange: (newEffortTime: EffortTime) => void;
}

const EffortTimeBanner: React.FC<EffortTimeBannerProps> = ({ effortTime, onEffortTimeChange }) => {
    const [showForm, setShowForm] = useState(false); // Stato per la visibilità del form
    const [value, setValue] = useState(effortTime?.value.toString() || '');
    const [unitOfTime, setUnitOfTime] = useState(effortTime?.unitOfTime || '');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (value && unitOfTime && Object.values(UnitOfTime).includes(unitOfTime.toUpperCase() as UnitOfTime)) {
            const newEffortTime = { value: parseInt(value), unitOfTime: unitOfTime.toUpperCase() as UnitOfTime };
            onEffortTimeChange(newEffortTime);
            setShowForm(false); // Chiudi il form dopo l'aggiornamento
        } else {
            alert('Please enter a valid value and unit of measure: min, h, or d.');
        }
    };

    const handleBannerClick = () => {
        setShowForm(!showForm); // Mostra o nascondi il form quando il banner viene cliccato
    };

    return (
        <>
            <div className={`effortTime-banner ${effortTime ? 'set' : 'not-set'}`} onClick={handleBannerClick}>
                {effortTime ? `Effort Time: ${effortTime.value} ${effortTime.unitOfTime}` : 'Insert Effort Time'}
            </div>
            {showForm && ( // Renderizza il form solo se showForm è true
                <form onSubmit={handleSubmit} className="effortTime-form">
                    <input
                        type="number"
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        placeholder="Enter effort time value"
                    />
                    <select value={unitOfTime} onChange={e => setUnitOfTime(e.target.value)}>
                        <option value="">Select Unit</option>
                        <option value="min">Minutes (min)</option>
                        <option value="h">Hours (h)</option>
                        <option value="d">Days (d)</option>
                    </select>
                    <button type="submit">Update Effort Time</button>
                </form>
            )}
        </>
    );
};

export default EffortTimeBanner;
