import {Smell} from "./Smell";
import {Microservice} from "./Microservice";

export interface Analysis {
    id: string;
    smells: Smell[];
    name: string;
    isFavorite: boolean;
    isTriageValid: boolean;
    date: string
    microservices: Microservice[];
}