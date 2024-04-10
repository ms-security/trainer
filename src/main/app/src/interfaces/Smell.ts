export interface Smell {
    id: number,
    name: string,
    description: string;
    importance: 'none' | 'low' | 'medium' | 'high';
    status: 'unfixed' | 'fixed' | 'false_positive' | 'wont_fix';
}