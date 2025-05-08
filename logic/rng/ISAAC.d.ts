export declare class ISAAC {
    private m;
    private r;
    private acc;
    private brs;
    private cnt;
    private gnt;
    private readonly backcycle;
    private bck;
    constructor(seed: number, backcycle?: boolean);
    static create(backcycle: boolean, seed?: number): Promise<ISAAC>;
    static getSeed(): Promise<{}>;
    private startBackcycle;
    reset(): void;
    seed(this: any, s: any): void;
    private add;
    private toIntArray;
    prng(n?: number): void;
    rand(): any;
    internals(): {
        acc: number;
        brs: number;
        cnt: number;
        m: any[];
        r: any[];
    };
    readonly random: number;
    randomNatural(): number;
    randomMinMax(min: number, max: number): number;
    getRandomInt: (min: number, max: number) => number;
    getRandomFloat: (min: number, max: number, precision?: number) => string;
    getRandomIntArray(size: number, min: number, max: number, sets?: number): any[];
    getRandomFloatArray(size: number, min: number, max: number, sets?: number, precision?: number): any[];
    shuffle(array: any[], returnNew?: boolean): any[];
    raffle(container: any[], picks?: number): any[];
}
