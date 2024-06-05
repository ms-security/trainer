import { Smell, UrgencyCode } from "../interfaces/Smell";
import { SmellFilter } from "../interfaces/SmellFilter";
import queryString from "query-string";
import { useLocation } from "react-router-dom";
import { EffortTime, UnitOfTime } from "../interfaces/EffortTime";

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

const filterByChecked = (smell: Smell, filters: SmellFilter) => {
    return !(filters.isChecked === true && !smell.checked);
};

const filterByStatus = (smell: Smell, filters: SmellFilter) => {
    const smellStatusFilters = filters.smellStatus ?? [];
    return smellStatusFilters.length === 0 || smellStatusFilters.includes(smell.status);
};

const filterByUrgency = (smell: Smell, filters: SmellFilter) => {
    return !filters.urgencyCode?.length ||
        (!smell.urgencyCode && filters.urgencyCode.includes(undefined)) ||
        (smell.urgencyCode && filters.urgencyCode.includes(smell.urgencyCode));
};

const filterByMicroservice = (smell: Smell, filters: SmellFilter) => {
    return filters.microservice?.length ? filters.microservice.includes(smell.microservice?.name as string) : true;
};

const filterBySmellCode = (smell: Smell, filters: SmellFilter) => {
    return filters.smellCodes?.length ? filters.smellCodes.includes(smell.name) : true;
};

const applyFilters = (smells: Smell[], filters: SmellFilter): Smell[] => {
    return smells.filter(smell =>
        filterByChecked(smell, filters) &&
        filterByStatus(smell, filters) &&
        filterByUrgency(smell, filters) &&
        filterByMicroservice(smell, filters) &&
        filterBySmellCode(smell, filters)
    );
};

const sortByUrgencyTop = (a: Smell, b: Smell) => {
    if (!a.urgencyCode && !b.urgencyCode) return 0;
    if (!a.urgencyCode) return 1;
    if (!b.urgencyCode) return -1;
    return urgencyOrder.indexOf(a.urgencyCode) - urgencyOrder.indexOf(b.urgencyCode);
};

const sortByUrgencyBottom = (a: Smell, b: Smell) => {
    if (!a.urgencyCode && !b.urgencyCode) return 0;
    if (!a.urgencyCode) return 1;
    if (!b.urgencyCode) return -1;
    return urgencyOrder.indexOf(b.urgencyCode) - urgencyOrder.indexOf(a.urgencyCode);
};

const sortByEffortTop = (a: Smell, b: Smell) => {
    const effortA = convertEffortTimeToMinutes(a.effortTime);
    const effortB = convertEffortTimeToMinutes(b.effortTime);
    if (effortA === Number.MAX_SAFE_INTEGER && effortB === Number.MAX_SAFE_INTEGER) return 0;
    if (effortA === Number.MAX_SAFE_INTEGER) return 1;
    if (effortB === Number.MAX_SAFE_INTEGER) return -1;
    return effortB - effortA;
};

const sortByEffortBottom = (a: Smell, b: Smell) => {
    const effortA = convertEffortTimeToMinutes(a.effortTime);
    const effortB = convertEffortTimeToMinutes(b.effortTime);
    if (effortA === Number.MAX_SAFE_INTEGER && effortB === Number.MAX_SAFE_INTEGER) return 0;
    if (effortA === Number.MAX_SAFE_INTEGER) return 1;
    if (effortB === Number.MAX_SAFE_INTEGER) return -1;
    return effortA - effortB;
};

const sortSmells = (smells: Smell[], sortBy: string): Smell[] => {
    const sortFunctions: Record<string, (a: Smell, b: Smell) => number> = {
        'urgencyTop': sortByUrgencyTop,
        'urgencyBottom': sortByUrgencyBottom,
        'effortTop': sortByEffortTop,
        'effortBottom': sortByEffortBottom
    };

    const sortFunction = sortFunctions[sortBy];
    return sortFunction ? smells.sort(sortFunction) : smells;
};

export const filterSmells = (smells: Smell[], filters: SmellFilter): Smell[] => {
    const filteredSmells = applyFilters(smells, filters);
    return filters.sortBy ? sortSmells(filteredSmells, filters.sortBy) : filteredSmells;
};

export const useParsedFiltersFromUrl = (): SmellFilter => {
    const location = useLocation();
    const queryParams = queryString.parse(location.search, { arrayFormat: 'bracket' }) as Partial<SmellFilter>;
    const safeHasOwnProperty = (obj: Record<string, any>, prop: string) => Object.hasOwn(obj, prop);
    if (safeHasOwnProperty(queryParams, 'isChecked') && typeof queryParams.isChecked === 'string') {
        queryParams.isChecked = queryParams.isChecked === 'true';
    }
    return queryParams as SmellFilter;
};
