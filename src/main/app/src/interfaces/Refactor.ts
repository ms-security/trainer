import {QualityAttributeSR} from "./QualityAttribute";

export interface Refactoring {
    name: string;
    refactor: string;
    relatedFileName: string;
    propertiesAffected: QualityAttributeSR[];
}