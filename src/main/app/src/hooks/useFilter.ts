import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import {SmellFilter} from "../interfaces/SmellFilter";
import {useParsedFiltersFromUrl} from "../util/filterSmells";

export const useFilter = (initialFilters: SmellFilter) => {
    const [filters, setFilters] = useState<SmellFilter>(initialFilters);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = useParsedFiltersFromUrl();

    const updateFilters = (newFilters: Partial<SmellFilter>) => {
        const updatedFilters = { ...filters, ...newFilters };
        setFilters(updatedFilters);
        const queryStringified = queryString.stringify(updatedFilters, { arrayFormat: 'bracket' });
        navigate(`${location.pathname}?${queryStringified}`, { replace: true });
    };

    return [filters, updateFilters] as const;
};
