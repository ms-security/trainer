export enum Category {
    SECURITY = "SECURITY",
    PERFORMANCE_EFFICIENCY = "PERFORMANCE_EFFICIENCY",
    MAINTAINABILITY = "MAINTAINABILITY"
}

export enum Relevance {
    HIGH = "HIGH",
    MEDIUM = "MEDIUM",
    LOW = "LOW",
    NONE = "NONE"
}

// Interface for QualityAttribute
export interface QualityAttribute {
    name: string;
    relevance: Relevance;
    category: Category;
}