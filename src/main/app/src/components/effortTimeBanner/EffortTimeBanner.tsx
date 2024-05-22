import React, {useEffect, useState} from 'react';
import './EffortTimeBanner.css';
import { EffortTime, UnitOfTime } from "../../interfaces/EffortTime";

interface EffortTimeBannerProps {
    effortTime: EffortTime | undefined;
    onEffortTimeChange: (newEffortTime: EffortTime) => void;
}

const EffortTimeBanner: React.FC<EffortTimeBannerProps> = ({ effortTime, onEffortTimeChange }) => {
    const [showForm, setShowForm] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [unitOfTime, setUnitOfTime] = useState<string>('');

    useEffect(() => {
        // Chiudi il form e resetta i valori quando il smell cambia
        setShowForm(false);
        setValue(effortTime ? effortTime.value.toString() : '');
        setUnitOfTime(effortTime ? effortTime.unitOfTime : '');
    }, [effortTime]); // Dipendenze: aggiorna questi effetti quando `effortTime` cambia


    // Funzione per aprire il form e impostare i valori iniziali
    const openForm = () => {
        if (effortTime) {
            setValue(effortTime.value.toString());
            setUnitOfTime(effortTime.unitOfTime.toLowerCase());
        } else {
            setValue('');  // Resetta il valore se effortTime non è definito
            setUnitOfTime('');  // Resetta l'unità di misura se non definita
        }
        setShowForm(true);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (value && unitOfTime && Object.values(UnitOfTime).includes(unitOfTime.toUpperCase() as UnitOfTime)) {
            const newEffortTime: EffortTime = { value: parseInt(value), unitOfTime: unitOfTime.toUpperCase() as UnitOfTime };
            onEffortTimeChange(newEffortTime);
            setShowForm(false);
        } else {
            alert('Please enter a valid value and unit of measure: min, h, or d.');
        }
    };

    return (
        <>
            {!showForm && (
                <div className={`effortTime-banner ${effortTime ? 'set' : 'not-set'}`} onClick={openForm}>
                    {effortTime ? `Effort Time: ${effortTime.value} ${effortTime.unitOfTime}` : 'Insert Effort Time'}
                </div>
            )}
            {showForm && (
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
                    <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
                </form>
            )}
        </>
    );
};

export default EffortTimeBanner;
