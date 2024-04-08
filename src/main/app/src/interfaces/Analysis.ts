import {Smell} from "./Smell";

export interface Analysis {
    id: number;
    smells: Smell[];
    name: string;
    isFavorite: boolean;
    date: string;
}