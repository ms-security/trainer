export interface Smell {
    name: string,
    description: string;
    importance: 'none' | 'low' | 'medium' | 'high';
    status: 'unfixed' | 'fixed' | 'false_positive' | 'wont_fix';
}