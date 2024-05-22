import {EffortTime, UnitOfTime} from "../interfaces/EffortTime";
import {Smell} from "../interfaces/Smell";

export const calculateTotalEffortTime = (smells: Smell[]) => {
    const totalMinutes = smells.reduce((total, smell) => {
        if (!smell.effortTime) return total;
        const minutes = convertEffortTimeToMinutes(smell.effortTime);
        return total + minutes;
    }, 0);

    console.log('Total minutes:', totalMinutes);

    if (totalMinutes >= 1440) {
        const days = Math.floor(totalMinutes / 1440);
        return `${days}d`;
    } else if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        return `${hours}h`;
    } else {
        return `${totalMinutes}min`;
    }
};
const convertEffortTimeToMinutes = (effortTime?: EffortTime): number => {
    if (!effortTime) return 0;
    console.log('Effort time:', effortTime);
    return effortTime.value * unitToMinutes(effortTime.unitOfTime);
};

const unitToMinutes = (unit: UnitOfTime): number => {
    switch (unit) {
        case UnitOfTime.MIN:
            return 1;
        case UnitOfTime.H:
            return 60;
        case UnitOfTime.D:
            return 1440;
        default:
            return 0;
    }
};