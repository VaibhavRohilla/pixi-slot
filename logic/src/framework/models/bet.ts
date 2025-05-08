export interface IBet {
    current: number;
    change?: number;
    min?: number;
    max?: number;
    start?: number;
    lines: ILines;
    valuesOnBet?: any;
}

export interface ILines {
    current: number;
    start?: number;
    min?: number;
    max?: number;
    change?: number;
}
export class IBet {
    constructor(init: IBet) {
        Object.assign(this, Object.create(init));
    }
}
export class ILines {
    constructor(init: ILines) {
        Object.assign(this, Object.create(init));
    }
}
