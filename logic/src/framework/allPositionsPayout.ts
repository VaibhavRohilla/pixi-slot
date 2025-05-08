import * as Helpers from './helpers';
import { ISlotInfo } from './interfaces';
import { IBet } from './models/bet';
import { IWinData } from './models/winData';
import { IWinDescription } from './models/winDescription';

export default class AllPositionsPayout<Symbols> {
    private info: ISlotInfo<Symbols>;
    constructor(info: ISlotInfo<Symbols>) {
        this.info = info;
    }

    public getPayoutAllPositions = (
        screen: number[][],
        bet: IBet
    ): IWinDescription => {
        const results: number[][] = Helpers.getResults(
            screen,
            bet.lines.current,
            this.info.Paylines
        );

        let totalWin = 0;
        const lineWins: IWinData[] = [];

        let lineIndex = 0;
        for (const line of results) {
            const winData: IWinData = this.getConsecutiveElements(
                line,
                lineIndex
            );
            winData.totalWin =
                this.info.Paytable[winData.symbol][winData.symbolCount] *
                bet.current;

            if (winData.totalWin > 0) {
                totalWin += winData.totalWin;
                lineWins.push(winData);
            }
            lineIndex++;
        }
        const winDescription: IWinDescription = {
            totalWin,
            lineWins,
        };

        return winDescription;
    };

    // Get the number of Consecutive Symbols in each line
    private getConsecutiveElements = (
        line: number[],
        lineIndex: number
    ): IWinData => {
        let asbIndex = this.info.Paylines[lineIndex][0];

        const winData: IWinData = {
            symbol: line[0],
            symbolCount: 1,
            affectedSymbolsBits: 0 | (1 << asbIndex),
            totalWin: 0,
        };
        for (let i = 1; i < line.length; i++) {
            if (line[i] === line[i - 1]) {
                winData.symbolCount += 1;
                asbIndex =
                    this.info.LinesNumber * i +
                    this.info.Paylines[lineIndex][i];
                winData.affectedSymbolsBits =
                    winData.affectedSymbolsBits | (1 << asbIndex);
            } else {
                if (winData.symbolCount >= 3) {
                    return winData;
                }
                winData.symbol = line[i];
                winData.symbolCount = 1;
                asbIndex =
                    this.info.LinesNumber * i +
                    this.info.Paylines[lineIndex][i];
                winData.affectedSymbolsBits = 0 | (1 << asbIndex);
            }
        }

        return winData;
    };
}
