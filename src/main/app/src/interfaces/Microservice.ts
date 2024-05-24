import {QualityAttributeMS, Relevance} from "./QualityAttribute";
export interface Microservice {
    id?: number;
    name: string,
    relevance: Relevance;
    qualityAttributes: QualityAttributeMS[];
}