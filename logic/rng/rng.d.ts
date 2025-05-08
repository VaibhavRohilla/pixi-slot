export declare class RNG {
    onSet: () => void;
    private N;
    private M;
    private MATRIX_A;
    private UPPER_MASK;
    private LOWER_MASK;
    private mt;
    private mti;
    private seed;
    private timeout;
    constructor(seed?: number);
    getRandomInt: (min: number, max: number) => number;
    getRandomFloat: (min: number, max: number) => number;
    getRandomIntArray(size: number, min: number, max: number, sets?: number): any[];
    getRandomFloatArray(size: number, min: number, max: number, sets?: number): any[];
    shuffle(array: any[]): any[];
    raffle(container: any[], picks?: number): any[];
    readonly int32: number;
    readonly int31: number;
    readonly real1: number;
    readonly random: number;
    readonly real3: number;
    readonly res53: number;
    private set;
}
