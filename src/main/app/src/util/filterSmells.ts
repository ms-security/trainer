import {Smell} from "../interfaces/Smell";
import {SmellFilter} from "../interfaces/SmellFilter";
import queryString from "query-string";
import {useLocation} from "react-router-dom";

export const filterSmells = (smells: Smell[], filters: SmellFilter) => {
    return smells.filter(smell => {
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