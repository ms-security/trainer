import {QualityAttribute} from "./QualityAttribute";

export interface Refactoring {
    name: string;
    refactor: string;
    propertiesAffected: QualityAttribute[];
}