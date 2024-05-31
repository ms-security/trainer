import {UrgencyCode} from "../interfaces/Smell";

export const urgencyCodeToName = (code: UrgencyCode | undefined): string => {
    if(!code) return 'Undefined'
    const descriptions: { [key: string]: string } = {
        'HH': 'High',
        'HM': 'Medium to High',
        'MM': 'Medium',
        'ML': 'Low to Medium',
        'LL': 'Low',
        'LN': 'None to Low',
        'Ø': 'None'
    };
    return descriptions[code] || 'Undefined';
};

export const getRelevanceIndicator = (relevance: string): string => {
    const indicators: { [key: string]: string } = {
        'HIGH': 'high-relevance',
        'MEDIUM': 'medium-relevance',
        'LOW': 'low-relevance',
        'NONE': 'no-relevance'
    };
    return indicators[relevance] || '';
};

export const getUrgencyClass = (code: string | undefined): string => {
    return code ? `smellPage-urgency-indicator ${code}` : 'smellPage-urgency-indicator';
};



