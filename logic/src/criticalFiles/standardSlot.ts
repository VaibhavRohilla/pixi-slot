import { Game } from '../framework/base-game';
import * as Helpers from '../framework/helpers';
import { ISlotInfo } from '../framework/interfaces';
import { IBet } from '../framework/models/bet';
import { IMainSLot } from '../framework/models/games';
import {
    IGameConfig,
    IRNG,
    IGameInput,
} from '../framework/models/gamesAbstractModels';
import { IWinDescription } from '../framework/models/winDescription';
import { IWinData } from '../framework/models/winData';
import { StatisticsLogs } from '../framework/tests/statisticsLogs';
import CustomError from '../framework/customError';

export abstract class StandardSlot<Symbols> extends Game<IMainSLot> {
    protected info: ISlotInfo<Symbols>;

    protected constructor(
        info: ISlotInfo<Symbols>,
        gameConfig: IGameConfig,
        rng: IRNG
    ) {
        super(info, gameConfig, rng);
        this.info = info;
    }

    protected async createScreen(
        forcedPositions?: number[]
    ): Promise<number[][]> {
        return Helpers.createScreen(
            this.info,
            this.getRng,
            false,
            forcedPositions
        );
    }

    protected async createScreenWithInfo(
        info: ISlotInfo<any>,
        forcedPositions?: number[]
    ): Promise<number[][]> {
        return Helpers.createScreen(
            this.info,
            this.getRng,
            false,
            forcedPositions
        );
    }

    protected async createScreenBonus(
        forcedPositions?: number[]
    ): Promise<number[][]> {
        return Helpers.createScreen(
            this.info,
            this.getRng,
            true,
            forcedPositions
        );
    }

    protected async createScreenBonusWithInfo(
        info: ISlotInfo<any>,
        forcedPositions?: number[]
    ): Promise<number[][]> {
        return Helpers.createScreen(
            this.info,
            this.getRng,
            true,
            forcedPositions
        );
    }

    public async action(gameInput: IGameInput): Promise<any> {
        const actionType = gameInput.actionType;
        const actionInput = gameInput.actionInput;
        let playResponse;
        switch (actionType) {
            case 'play': {
                const oldVal = this.isForcingPositions;
                this.cheatTool && this.cheatToolForce(gameInput);
                playResponse = await this.play();

                this.isForcingPositions = oldVal;
                break;
            }
            case 'playbonus':
                if (this.cheatTool) {
                    playResponse = await this.playBonus();
                } else {
                    throw new CustomError(
                        `Action type '${actionType}' not supported`,
                        400
                    );
                }
                break;
            case 'lines':
                this.lines(actionInput.direction);
                return this.currentStateWithRgs();
                break;
            case 'bet':
                this.bet(actionInput.direction);
                return this.currentStateWithRgs();
                break;
            case 'getState':
                playResponse = this.currentStateWithRgs();
                break;
            default:
                throw new CustomError(
                    `Action type '${actionType}' not supported`,
                    400
                );
        }
        return playResponse;
    }

    protected currentStateWithRgs(isWin = false, win = 0, wager = 0): any {
        return Helpers.getCurrentStateWithRgs(
            this.GameState,
            this.getGameConfig,
            isWin,
            win,
            wager
        );
    }

    protected abstract calculatePayout(
        screen: number[][],
        bet: IBet,
        wild?: number
    ): IWinDescription;

    protected modifyPayoutWithByAnyX(
        screen: number[][],
        lineWinsPrimaryWin: IWinData[],
        anySymbolIndex: number,
        dummySymbolIndex: number,
        ...anySymbolsIndexes: number[]
    ): IWinDescription {
        // create tmp screen with only anyX symbols
        const screen2 = JSON.parse(JSON.stringify(screen));
        for (
            let reelIndex = 0;
            reelIndex < this.info.ReelsNumber;
            reelIndex++
        ) {
            for (
                let rowIndex = 0;
                rowIndex < this.info.LinesNumber;
                rowIndex++
            ) {
                const sym = screen2[rowIndex][reelIndex];
                if (anySymbolsIndexes.includes(sym)) {
                    screen2[rowIndex][reelIndex] = anySymbolIndex;
                } else {
                    screen2[rowIndex][reelIndex] = dummySymbolIndex;
                }
            }
        }

        //console.log("screen2", screen, screen2, anySymbolsIndexes, anySymbolIndex, dummySymbolIndex);

        // add any syms in winDescription (reject already existing lines)
        const anySymLineWins: IWinData[] = this.calculatePayout(
            screen2,
            this.State.bet
        ).lineWins;
        anySymLineWins.forEach((anySymLineWin) => {
            let hasLineAlready = false;
            for (let i = 0; i < lineWinsPrimaryWin.length; i++) {
                const lineWinPrimary = lineWinsPrimaryWin[i];

                if (lineWinPrimary.lineIndex == anySymLineWin.lineIndex) {
                    // replace
                    if (anySymLineWin.totalWin > lineWinPrimary.totalWin) {
                        lineWinsPrimaryWin[i] = JSON.parse(
                            JSON.stringify(anySymLineWin)
                        );
                    }
                    hasLineAlready = true;
                    break;
                }
            }
            if (!hasLineAlready) {
                // add
                lineWinsPrimaryWin.push(anySymLineWin);
            }
        });

        let retTotalWin = 0;
        for (const lineWinPrimary of lineWinsPrimaryWin) {
            retTotalWin += lineWinPrimary.totalWin;
        }

        const winDescription: IWinDescription = {
            totalWin: retTotalWin,
            lineWins: lineWinsPrimaryWin,
        };

        return winDescription;
    }

    isForcingPositions = false;
    protected forcedPositions = [0, 0, 0, 0, 0];
    resetForcedPositions(currentSpin = 1): void {
        let spn = currentSpin - 1;
        for (
            let reelIndex = this.info.ReelsNumber - 1;
            reelIndex >= 0;
            reelIndex--
        ) {
            this.forcedPositions[reelIndex] =
                spn % this.info.ReelLengths[reelIndex];
            spn = Math.floor(spn / this.info.ReelLengths[reelIndex]);
        }
    }

    getForcedPositionsCopy(): void {
        return JSON.parse(JSON.stringify(this.forcedPositions));
    }

    getNumberOfPossibleCombinations(): number {
        let sumOfSpins = 1;
        for (
            let reelIndex = this.info.ReelsNumber - 1;
            reelIndex >= 0;
            reelIndex--
        ) {
            sumOfSpins *= this.info.ReelLengths[reelIndex];
        }

        return sumOfSpins;
    }

    cheatToolForce(gameInput: IGameInput): void {
        if (
            this.cheatTool &&
            gameInput.actionInput &&
            gameInput.actionInput.hasOwnProperty('force') &&
            Array.isArray(gameInput.actionInput.force)
        ) {
            this.isForcingPositions = true;
            for (
                let i = 0;
                i <
                Math.min(
                    gameInput.actionInput.force.length,
                    this.forcedPositions.length
                );
                i++
            ) {
                this.forcedPositions[i] = gameInput.actionInput.force[i];
            }
        }
    }

    updateGameSpecificStats(logs: StatisticsLogs): void {
        logs;
        // hook method
    }
}
