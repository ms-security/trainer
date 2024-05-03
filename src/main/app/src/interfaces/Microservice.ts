import {QualityAttributeMS, Relevance} from "./QualityAttribute";
export interface Microservice {
    name: string,
    relevance: Relevance;
    qualityAttributes: QualityAttributeMS[];
}