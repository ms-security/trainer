import {Smell, UrgencyCode} from "../interfaces/Smell";
import {SmellFilter} from "../interfaces/SmellFilter";
import queryString from "query-string";
import {useLocation} from "react-router-dom";
import {EffortTime, UnitOfTime} from "../interfaces/EffortTime";

const urgencyOrder: UrgencyCode[] = [
    UrgencyCode.HH,
    UrgencyCode.HM,
    UrgencyCode.MM,
    UrgencyCode.ML,
    UrgencyCode.LL,
    UrgencyCode.LN,
    UrgencyCode.Ø
];

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

const convertEffortTimeToMinutes = (effortTime?: EffortTime): number => {
    if (!effortTime) return Number.MAX_SAFE_INTEGER;
    return effortTime.value * unitToMinutes(effortTime.unitOfTime);
};
export const filterSmells = (smells: Smell[], filters: SmellFilter): Smell[] => {
    let filteredSmells = smells.filter(smell => {
        if (filters.isChecked === true && !smell.checked) {
            return false;
        }

        const isVisibleBasedOnStatus = smell.status === 'UNFIXED' ||
            ((filters.smellStatus ?? []).length > 0 && filters.smellStatus?.includes(smell.status));

        const matchUrgency =
            !(filters.urgencyCode && filters.urgencyCode.length) ||
            (!smell.urgencyCode && filters.urgencyCode.includes(undefined) ||
                (smell.urgencyCode && filters.urgencyCode.includes(smell.urgencyCode))
            );

        const matchStatus = filters.smellStatus?.length ? filters.smellStatus.includes(smell.status) : true;

        const matchMicroservice = filters.microservice?.length ? filters.microservice.includes(smell.microservice?.name as string) : true;

        const matchSmellCode = filters.smellCodes?.length ? filters.smellCodes.includes(smell.name) : true;

        return isVisibleBasedOnStatus && matchUrgency && matchStatus && matchMicroservice && matchSmellCode;
    });

    if (filters.sortBy) {
        switch (filters.sortBy) {
            case 'urgencyTop':
                filteredSmells.sort((a, b) => {
                    if (!a.urgencyCode && !b.urgencyCode) return 0;
                    if (!a.urgencyCode) return 1;
                    if (!b.urgencyCode) return -1;
                    return urgencyOrder.indexOf(a.urgencyCode) - urgencyOrder.indexOf(b.urgencyCode);
                });
                break;
            case 'urgencyBottom':
                filteredSmells.sort((a, b) => {
                    if (!a.urgencyCode && !b.urgencyCode) return 0;
                    if (!a.urgencyCode) return 1;
                    if (!b.urgencyCode) return -1;
                    return urgencyOrder.indexOf(b.urgencyCode) - urgencyOrder.indexOf(a.urgencyCode);
                });
                break;
            case 'effortTop':
                filteredSmells.sort((a, b) => {
                    const effortA = convertEffortTimeToMinutes(a.effortTime);
                    const effortB = convertEffortTimeToMinutes(b.effortTime);
                    if (effortA === Number.MAX_SAFE_INTEGER && effortB === Number.MAX_SAFE_INTEGER) return 0;
                    if (effortA === Number.MAX_SAFE_INTEGER) return 1;
                    if (effortB === Number.MAX_SAFE_INTEGER) return -1;
                    return effortB - effortA;
                });
                break;
            case 'effortBottom':
                filteredSmells.sort((a, b) => {
                    const effortA = convertEffortTimeToMinutes(a.effortTime);
                    const effortB = convertEffortTimeToMinutes(b.effortTime);
                    if (effortA === Number.MAX_SAFE_INTEGER && effortB === Number.MAX_SAFE_INTEGER) return 0;
                    if (effortA === Number.MAX_SAFE_INTEGER) return 1;
                    if (effortB === Number.MAX_SAFE_INTEGER) return -1;
                    return effortA - effortB;
                });
                break;
            case 'none':
            default:
                break;
        }
    }

    return filteredSmells;
};

export const useParsedFiltersFromUrl = (): SmellFilter => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search, { arrayFormat: 'bracket' }) as Partial<SmellFilter>;
    const safeHasOwnProperty = (obj: Record<string, any>, prop: string) => Object.prototype.hasOwnProperty.call(obj, prop);
    if (safeHasOwnProperty(queryParams, 'isChecked') && typeof queryParams.isChecked === 'string') {
        queryParams.isChecked = queryParams.isChecked === 'true';
    }
    return queryParams as SmellFilter;
}