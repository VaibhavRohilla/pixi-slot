import { ISlotInfo } from '../framework/interfaces';

export interface ISymbolsEightGoldenLions {
    Low1: number;
    Low2: number;
    Low3: number;
    Low4: number;
    X1: number;
    X2: number;
    X3: number;
    Wild: number;
    Scatter: number;
    Mask: number;
    AnyX: number;
}

const SymbolsEightGoldenLions = {
    Low1: 0,
    Low2: 1,
    Low3: 2,
    Low4: 3,
    X1: 4,
    X2: 5,
    X3: 6,
    Wild: 7,
    Scatter: 8,
    Mask: 9,
    AnyX: 10,
};

const SymbolsEightGoldenLionsBonus = {
    Low1: 0,
    Low2: 1,
    Low3: 2,
    Low4: 3,
    X1: 4,
    X2: 5,
    X3: 6,
    Wild: 7,
    Scatter: 8,
    Mask: 9,
    AnyX: 10,
};

const ReelLengthsEightGoldenLions: number[] = [50, 60, 70, 60, 50];

const ReelsEightGoldenLions: number[][] = [
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Mask,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Wild,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Wild,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        null,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Scatter,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.X1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Scatter,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.X2,
        null,
    ],
    [null, null, SymbolsEightGoldenLions.Low2, null, null],
    [null, null, SymbolsEightGoldenLions.Wild, null, null],
    [null, null, SymbolsEightGoldenLions.X2, null, null],
    [null, null, SymbolsEightGoldenLions.X2, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.Scatter, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.X1, null, null],
    [null, null, SymbolsEightGoldenLions.X1, null, null],
];

const ReelLengthsBonusEightGoldenLions: number[] = [50, 60, 70, 60, 50];

const ReelsBonusEightGoldenLions: number[][] = [
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Mask,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Wild,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low4,
    ],
    [
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low2,
    ],
    [
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Wild,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Wild,
        SymbolsEightGoldenLions.X3,
        SymbolsEightGoldenLions.X1,
    ],
    [
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Mask,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
    ],
    [
        null,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Scatter,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low4,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.X2,
        SymbolsEightGoldenLions.X1,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Low2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low3,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.Low2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.Scatter,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.X1,
        SymbolsEightGoldenLions.Low1,
        SymbolsEightGoldenLions.X2,
        null,
    ],
    [
        null,
        SymbolsEightGoldenLions.Low2,
        SymbolsEightGoldenLions.Scatter,
        SymbolsEightGoldenLions.X2,
        null,
    ],
    [null, null, SymbolsEightGoldenLions.Low2, null, null],
    [null, null, SymbolsEightGoldenLions.Wild, null, null],
    [null, null, SymbolsEightGoldenLions.X2, null, null],
    [null, null, SymbolsEightGoldenLions.X2, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.Scatter, null, null],
    [null, null, SymbolsEightGoldenLions.Low1, null, null],
    [null, null, SymbolsEightGoldenLions.X1, null, null],
    [null, null, SymbolsEightGoldenLions.X1, null, null],
];

const EightGoldenLionsPaytable: number[][] = [
    [0, 0, 0, 5, 8, 20], //Low1
    [0, 0, 0, 5, 8, 20], //Low2
    [0, 0, 0, 5, 15, 40], //Low3
    [0, 0, 0, 10, 20, 65], //Low4
    [0, 0, 0, 20, 75, 150], //X1
    [0, 0, 0, 25, 125, 400], //X2
    [0, 0, 0, 50, 325, 750], //X3
    [0, 0, 0, 125, 500, 2500], //Wild
    [0, 0, 0, 0, 0, 0], //Scatter
    [0, 0, 0, 0, 0, 0], //Mask
    [0, 0, 0, 10, 20, 65], //AnyX
];

const masksTable: number[] = [0, 0, 0, 1, 5, 15, 70, 400, 2000];

const scatterPaytableEightGoldenLions: number[][] = [
    [0, 0, 0, 1, 1, 1],
    masksTable,
];

const PaylinesEightGoldenLions: number[][] = [
    [1, 1, 1, 1, 1], //0
    [0, 0, 0, 0, 0], //1
    [2, 2, 2, 2, 2], //2
    [0, 1, 2, 1, 0], //3
    [2, 1, 0, 1, 2], //4
    [0, 0, 1, 0, 0], //5
    [2, 2, 1, 2, 2], //6
    [1, 2, 2, 2, 1], //7
    [1, 0, 0, 0, 1], //8
    [1, 0, 1, 0, 1], //9
    [1, 2, 1, 2, 1], //10
    [0, 1, 0, 1, 0], //11
    [2, 1, 2, 1, 2], //12
    [1, 1, 0, 1, 1], //13
    [1, 1, 2, 1, 1], //14
    [0, 1, 1, 1, 0], //15
    [2, 1, 1, 1, 2], //16
    [2, 0, 0, 0, 2], //17
    [0, 2, 2, 2, 0], //18
    [0, 2, 0, 2, 0], //19
];

export interface IFreeSpinTriggerData {
    freeSpins: number;
    multiplier: number;
}

export const freeSpinsTriggerAmounts: IFreeSpinTriggerData[] = [
    {
        freeSpins: 30,
        multiplier: 3,
    },
    {
        freeSpins: 10,
        multiplier: 2,
    },
    {
        freeSpins: 15,
        multiplier: 2,
    },
    {
        freeSpins: 15,
        multiplier: 2,
    },
    {
        freeSpins: 10,
        multiplier: 2,
    },
    {
        freeSpins: 20,
        multiplier: 2,
    },
    {
        freeSpins: 25,
        multiplier: 3,
    },
    {
        freeSpins: 12,
        multiplier: 2,
    },
    {
        freeSpins: 12,
        multiplier: 2,
    },
    {
        freeSpins: 10,
        multiplier: 2,
    },
];

export const EightGoldenLionsInfo: ISlotInfo<ISymbolsEightGoldenLions> = {
    SlotName: '8GoldenLions',
    SlotId: 1,
    LinesNumber: 3,
    ReelsNumber: 5,
    MaxPaylines: 20,
    Symbols: SymbolsEightGoldenLions,
    SymbolsBonus: SymbolsEightGoldenLionsBonus,
    ReelLengths: ReelLengthsEightGoldenLions,
    Reels: ReelsEightGoldenLions,
    ReelLengthsBonus: ReelLengthsBonusEightGoldenLions,
    ReelsBonus: ReelsBonusEightGoldenLions,
    Paytable: EightGoldenLionsPaytable,
    ScatterPaytable: scatterPaytableEightGoldenLions,
    Paylines: PaylinesEightGoldenLions,
    expectedRTP: 0.96273,
};

export default EightGoldenLionsInfo;
