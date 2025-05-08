import { ISlotInfo } from './interfaces';
import { IBet } from './models/bet';
import { IRNG, IGameConfig } from './models/gamesAbstractModels';
import { ISymbolsAsb } from './models/simbolsAsb';
import { IWinData } from './models/winData';
import { IMainSLot } from './models/games';

export function countSymbols(screen: number[][], symbol: number): ISymbolsAsb {
    let count = 0;
    let asb = 0;
    const lines = screen.length;
    const reels = screen[0].length;
    for (let i = 0; i < lines; i++) {
        for (let j = 0; j < reels; j++) {
            if (screen[i][j] === symbol) {
                count++;
                const asbIndex = lines * j + i;
                asb = asb | (1 << asbIndex);
            }
        }
    }
    const countAsb: ISymbolsAsb = {
        count,
        asb,
    };

    return countAsb;
}
export async function createScreen(
    info: ISlotInfo<any>,
    rng: IRNG,
    isBonus: boolean,
    forcedPositions?: number[]
): Promise<number[][]> {
    const screen: number[][] = [];

    if (!isBonus) {
        info.lastMainPositions = [];
    }
    for (let i = 0; i < info.LinesNumber; i++) {
        screen.push([]);
    }
    for (let i = 0; i < info.ReelsNumber; i++) {
        const reelStop: number = forcedPositions
            ? forcedPositions[i]
            : await rng.getRandomInt({
                  min: 0,
                  max:
                      (isBonus
                          ? info.ReelLengthsBonus[i]
                          : info.ReelLengths[i]) - 1,
              });
        //const reelStop: number = forcedPositions ? forcedPositions[i] : Math.floor(Math.random() * (isBonus ? info.ReelLengthsBonus[i] : info.ReelLengths[i]))
        for (let j = 0; j < info.LinesNumber; j++) {
            if (isBonus) {
                screen[j].push(
                    info.ReelsBonus[(reelStop + j) % info.ReelLengthsBonus[i]][
                        i
                    ]
                );
            } else {
                screen[j].push(
                    info.Reels[(reelStop + j) % info.ReelLengths[i]][i]
                );
            }
        }
        if (!isBonus) {
            info.lastMainPositions.push(reelStop);
        }
    }
    return screen;
}

export function scatterWin(
    info: ISlotInfo<any>,
    screen: number[][],
    scatterSymbol: number,
    bet: IBet,
    scatterIndex: number,
    noWinSymbolsThreshold
): IWinData {
    const count = countSymbols(screen, scatterSymbol);

    const scatterCount: number = count.count;
    const asb: number = count.asb;
    // console.log(bet)

    const winData: IWinData = {
        affectedSymbolsBits:
            info.ScatterPaytable[scatterIndex][scatterCount] > 0 ||
            (noWinSymbolsThreshold > 0 && scatterCount >= noWinSymbolsThreshold)
                ? asb
                : 0,
        symbolCount: scatterCount,
        symbol: scatterSymbol,
        totalWin:
            info.ScatterPaytable[scatterIndex][scatterCount] *
            bet.lines.current *
            bet.current,
    };

    return winData;
}

export function getResults(
    screen: number[][],
    linesNumber: number,
    paylines: number[][]
): number[][] {
    const lineLength: number = paylines[0].length;
    const results: number[][] = [];
    for (let i = 0; i < linesNumber; i++) {
        results[i] = [];
        for (let j = 0; j < lineLength; j++) {
            const lineIndex: number = paylines[i][j];
            results[i].push(screen[lineIndex][j]);
        }
    }

    return results;
}

export function countBonusSymbols(
    info: ISlotInfo<any>,
    screen: number[][],
    bonusSymbol: number,
    bonusIndex: number
): IWinData {
    const count = countSymbols(screen, bonusSymbol);

    const bonusCount: number = count.count;
    const asb: number = count.asb;

    const winData: IWinData = {
        affectedSymbolsBits:
            info.BonusPaytable[bonusIndex][bonusCount] > 0 ? asb : 0,
        symbolCount: bonusCount,
        symbol: bonusSymbol,
        totalWin: info.BonusPaytable[bonusIndex][bonusCount],
    };

    return winData;
}

export function getInitStateFromConfig(
    gameConfig: IGameConfig,
    INIT_STATE: IMainSLot
): IMainSLot {
    if (gameConfig) {
        return {
            screen: INIT_STATE.screen,
            bet: {
                current: gameConfig.betLimits
                    ? gameConfig.betLimits.default
                    : INIT_STATE.bet.current,
                change: 1,
                min: gameConfig.betLimits
                    ? gameConfig.betLimits.min
                    : INIT_STATE.bet.min,
                max: gameConfig.betLimits
                    ? gameConfig.betLimits.max
                    : INIT_STATE.bet.max,
                start: 1,
                lines: {
                    current: gameConfig.lineLimits
                        ? gameConfig.lineLimits.default
                        : INIT_STATE.bet.lines.current,
                    start: 10,
                    min: gameConfig.lineLimits
                        ? gameConfig.lineLimits.min
                        : INIT_STATE.bet.lines.min,
                    max: gameConfig.lineLimits
                        ? gameConfig.lineLimits.max
                        : INIT_STATE.bet.lines.max,
                    change: 0,
                },
            },
            isWin: false,
            affectedSymbolsBits: 0,
            winDescription: {
                totalWin: 0,
            },
        };
    } else {
        return INIT_STATE;
    }
}

export function getCurrentStateWithRgs(
    state: IMainSLot,
    gameConfig: any,
    isWin = false,
    win = 0,
    wager = 0
): {
    state: IMainSLot;
    rgs: {
        isWin: boolean;
        win: number;
        wager: number;
    };
    gameConfig: any;
} {
    const rgsCurrentState = {
        state,
        rgs: {
            isWin,
            win,
            wager,
        },
        gameConfig,
    };
    return rgsCurrentState;
}

// export const randomInt = rndInt
