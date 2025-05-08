import * as Helpers from '../framework/helpers';
import { ISlotInfo } from '../framework/interfaces';
import { IBet } from '../framework/models/bet';
import { IWinData } from '../framework/models/winData';
import { IWinDescription } from '../framework/models/winDescription';

export default class LeftToRightPayout<Symbols> {
    private info: ISlotInfo<Symbols>;
    constructor(info: ISlotInfo<Symbols>) {
        this.info = info;
    }

    // TEST CODE
    public testGetConsecutiveElements(
        line: number[],
        lineIndex: number,
        wildSymbol?: number
    ): IWinData {
        return this.getConsecutiveElements(line, lineIndex, wildSymbol);
    }

    public testGetConsecutiveElementsWild(
        line: number[],
        lineIndex: number
    ): IWinData {
        return this.getConsecutiveElementsWild(line, lineIndex);
    }
    // END TEST

    public getPayoutLeftToRight(
        screen: number[][],
        bet: IBet,
        wildSymbol?: number
    ): IWinDescription {
        let totalWin = 0;
        const lineWins: IWinData[] = [];
        const results: number[][] = Helpers.getResults(
            screen,
            bet.lines.current,
            this.info.Paylines
        );
        let lineIndex = 0;
        let winData: IWinData;
        for (const line of results) {
            if (line[0] === wildSymbol) {
                winData = this.getConsecutiveElementsWild(line, lineIndex);
            } else {
                winData = this.getConsecutiveElements(
                    line,
                    lineIndex,
                    wildSymbol
                );
            }
            winData.totalWin =
                this.info.Paytable[winData.symbol][winData.symbolCount] *
                bet.current;

            if (winData.totalWin > 0) {
                totalWin += winData.totalWin;
                winData.lineIndex = lineIndex;
                lineWins.push(winData);
            }
            lineIndex++;
        }

        const winDescription: IWinDescription = {
            totalWin,
            lineWins,
        };

        return winDescription;
    }

    // 4 Donny <3
    public getPayoutLeftToRightBonus(
        screen: number[][],
        bet: IBet,
        wildSymbol?: number
    ): IWinDescription {
        let totalWin = 0;
        const lineWins: IWinData[] = [];
        // paylines bonus???
        const results: number[][] = Helpers.getResults(
            screen,
            bet.lines.current,
            this.info.PaylinesBonus
        );
        let lineIndex = 0;
        let winData: IWinData;
        for (const line of results) {
            if (line[0] === wildSymbol) {
                winData = this.getConsecutiveElementsWild(line, lineIndex);
            } else {
                winData = this.getConsecutiveElements(
                    line,
                    lineIndex,
                    wildSymbol
                );
            }

            winData.totalWin =
                this.info.BonusPaytable[winData.symbol][winData.symbolCount] *
                bet.current;

            if (winData.totalWin > 0) {
                totalWin += winData.totalWin;
                winData.lineIndex = lineIndex;
                lineWins.push(winData);
            }
            lineIndex++;
        }

        const winDescription: IWinDescription = {
            totalWin,
            lineWins,
        };

        return winDescription;
    }

    private getConsecutiveElements(
        line: number[],
        lineIndex: number,
        wildSymbol?: number
    ): IWinData {
        let asbIndex = this.info.Paylines[lineIndex][0];
        const winData: IWinData = {
            symbol: line[0],
            symbolCount: 1,
            affectedSymbolsBits: 0 | (1 << asbIndex),
            totalWin: 0,
        };
        for (let i = 1; i < line.length; i++) {
            if (line[i] === line[0] || line[i] === wildSymbol) {
                winData.symbolCount++;

                asbIndex =
                    this.info.LinesNumber * i +
                    this.info.Paylines[lineIndex][i];
                winData.affectedSymbolsBits =
                    winData.affectedSymbolsBits | (1 << asbIndex);
            } else {
                break;
            }
        }

        return winData;
    }

    private getConsecutiveElementsWild(
        line: number[],
        lineIndex: number
    ): IWinData {
        let asbIndex = this.info.Paylines[lineIndex][0];
        let asbWild: number = 0 | (1 << asbIndex);
        let asbSymbol: number = 0 | (1 << asbIndex);

        const wildSymbol: number = line[0];
        let counterSymbol = 1;
        let counterWild = 1;
        let symbol: number = line.find((s) => s !== wildSymbol);
        if (symbol !== undefined) {
            for (let j = 1; j < this.info.ReelsNumber; j++) {
                if (line[j] === wildSymbol) {
                    counterWild++;
                    asbIndex =
                        this.info.LinesNumber * j +
                        this.info.Paylines[lineIndex][j];
                    asbWild = asbWild | (1 << asbIndex);
                } else {
                    break;
                }
            }
            for (let j = 1; j < this.info.ReelsNumber; j++) {
                if (line[j] === symbol || line[j] === wildSymbol) {
                    counterSymbol++;
                    asbIndex =
                        this.info.LinesNumber * j +
                        this.info.Paylines[lineIndex][j];
                    asbSymbol = asbSymbol | (1 << asbIndex);
                } else {
                    break;
                }
            }
        } else {
            symbol = wildSymbol;
            counterWild = this.info.ReelsNumber;
            for (let j = 1; j < this.info.ReelsNumber; j++) {
                asbIndex =
                    this.info.LinesNumber * j +
                    this.info.Paylines[lineIndex][j];
                asbWild = asbWild | (1 << asbIndex);
            }
        }
        const payoutSymbol = this.info.Paytable[symbol][counterSymbol];
        const payoutWild = this.info.Paytable[wildSymbol][counterWild];

        const winData: IWinData = {
            symbol: payoutSymbol > payoutWild ? symbol : wildSymbol,
            symbolCount:
                payoutSymbol > payoutWild ? counterSymbol : counterWild,
            affectedSymbolsBits:
                payoutSymbol > payoutWild ? asbSymbol : asbWild,
            totalWin: 0,
        };

        return winData;
    }
}
