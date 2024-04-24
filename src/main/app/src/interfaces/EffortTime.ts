export interface EffortTime{
    value: number;
    unitOfTime: UnitOfTime;
}

export enum UnitOfTime {
    MIN = "MIN",
    H = "H",
    D = "D"
}