import { IMainSLot } from './framework/models/games';

export const INIT_STATE: IMainSLot = {
    screen: [
        [1, 5, 3, 4, 3],
        [3, 1, 1, 0, 3],
        [3, 1, 1, 6, 5],
    ],
    bet: {
        current: 1,
        change: 1,
        min: 0.01,
        max: 20,
        start: 1,
        lines: {
            current: 20,
            start: 20,
            min: 20,
            max: 20,
            change: 0,
        },
    },
    isWin: false,
    affectedSymbolsBits: 0,
    winDescription: {
        totalWin: 0,
    },
};
