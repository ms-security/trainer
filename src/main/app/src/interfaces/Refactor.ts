import {QualityAttributeSR} from "./QualityAttribute";

export interface Refactoring {
    name: string;
    refactor: string;
    propertiesAffected: QualityAttributeSR[];
}