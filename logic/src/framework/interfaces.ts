export interface IGameInfo {
    SlotName: string;
    SlotId: number;
}
export interface ISlotInfo<Symbols> extends IGameInfo {
    LinesNumber: number;
    ReelsNumber: number;
    MaxPaylines: number;
    Symbols: Symbols;
    SymbolsBonus?: any;
    ReelLengths: number[];
    Reels: number[][];
    ReelLengthsBonus: number[];
    ReelsBonus: number[][];
    Paytable: number[][];
    ScatterPaytable?: number[][];
    BonusPaytable?: number[][];
    Paylines?: number[][];
    PaylinesBonus?: number[][];
    LinesNumberBonus?: number;
    ReelsNumberBonus?: number;
    expectedRTP?: number;
    lastMainPositions?: number[];
    lastBonusPositions?: number[];
}
