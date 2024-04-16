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
    category: Category;
}
export interface QualityAttributeMS extends QualityAttribute {
    relevance: Relevance;
}

export interface QualityAttributeSR extends QualityAttribute {
    impactsPositively: boolean;
}