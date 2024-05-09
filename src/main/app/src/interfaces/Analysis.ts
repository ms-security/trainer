import {Smell} from "./Smell";
import {Microservice} from "./Microservice";

export interface Analysis {
    id: String;
    smells: Smell[];
    name: string;
    isFavorite: boolean;
    isTriageValid: boolean;
    date: string
    microservices: Microservice[];
}