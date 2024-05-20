import {Microservice} from "./Microservice";
import {Refactoring} from "./Refactor";
import {QualityAttributeSR} from "./QualityAttribute";
import {EffortTime} from "./EffortTime";

export interface Smell {
    id: number,
    name: string,
    description: string;
    outputAnalysis: string;
    status: SmellStatus;
    refactoring: Refactoring;
    extendedName: string;
    urgencyCode?: UrgencyCode;
    microservice?: Microservice;
    effortTime?: EffortTime;
    checked: boolean;
    propertiesAffected: QualityAttributeSR[];
}

export enum UrgencyCode {
    HH = "HH",
    H = "H",
    MM = "MM",
    M = "M",
    LL = "LL",
    L = "L",
    Ø = "Ø"
}

export enum SmellStatus {
    UNFIXED = "UNFIXED",
    FIXED = "FIXED",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    NOT_GOING_TO_FIX = "NOT_GOING_TO_FIX"
}