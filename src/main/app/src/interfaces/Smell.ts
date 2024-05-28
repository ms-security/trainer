import {Microservice} from "./Microservice";
import {QualityAttributeSR} from "./QualityAttribute";
import {EffortTime} from "./EffortTime";
import {Refactoring} from "./Refactoring";

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
    HM = "HM",
    MM = "MM",
    ML = "ML",
    LL = "LL",
    LN = "LN",
    Ø = "Ø"
}

export enum SmellStatus {
    NOT_FIXED = "NOT_FIXED",
    FIXED = "FIXED",
    FALSE_POSITIVE = "FALSE_POSITIVE",
    NOT_GOING_TO_FIX = "NOT_GOING_TO_FIX"
}