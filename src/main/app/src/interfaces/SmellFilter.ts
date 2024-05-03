import { Microservice } from "./Microservice";
import { SmellStatus, UrgencyCode } from "./Smell";

export interface SmellFilter {
    smellStatus?: SmellStatus[];
    urgencyCode?: (UrgencyCode | undefined)[];
    microservice?: string[];
    isChecked?: boolean;
    smellCodes?: string[];
}