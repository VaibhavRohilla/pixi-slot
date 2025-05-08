import SpecificGame from '../../criticalFiles/index';
import * as fs from 'fs';
import { EOL } from 'os';

const log = (gameName: string, str: string, ...data: any): void => {
    //console.log(str, data);
    fs.appendFileSync(gameName, `${str} ${data.toString()}${EOL}`);
};

const basiclog = (fileName: string, str: string, ...data: any): void => {
    console.log(str, ...data);
    fs.appendFileSync(fileName, `${str} ${data.toString()}${EOL}`);
};

export class StatisticsLogs {
    sqrErrorSum = 0;
    sumOfWins = 0;
    sumOfHitsMain = 0;
    sumOfWinsMain = 0;
    sumOfWinsFeature = 0;
    sumOfWinsSpecific = 0;
    hitRate = 0;

    sumOfScattersMain = 0;
    sumOfScattersFeature = 0;
    sumOfScattersSpecific = 0;

    sumOfLineWinsMain = 0;
    sumOfLineWinsFeature = 0;
    sumOfLineWinsSpecific = 0;

    bonusEnterings = 0;

    lineWinsSums: number[] = [];

    sumOfSymbolHits: number[][] = [];
    sumOfSymbolWins: number[][] = [];
    sumOfSymbolHitsMain: number[][] = [];
    sumOfSymbolWinsMain: number[][] = [];
    sumOfSymbolHitsFeature: number[][] = [];
    sumOfSymbolWinsFeature: number[][] = [];

    sumOfSymbolHitsPerLine: number[][][] = [];
    sumOfSymbolWinsPerLine: number[][][] = [];

    specificText = 'SPECIFIC';
    sumOfSymbolHitsSpecific: number[][] = [];
    sumOfSymbolWinsSpecific: number[][] = [];

    sumOfSpins = 0;
    sumOfFreeSpins = 0;

    simulationRngHits: number[][] = null;

    maxWin = 0;
    maxWinCombinationMain: number[] = null;
    maxWinCombinationBonus = [];

    constructor(protected game: SpecificGame) {
        this.resetStats();
    }

    resetStats(): void {
        this.sqrErrorSum = 0;
        this.sumOfWins = 0;
        this.sumOfHitsMain = 0;
        this.sumOfWinsMain = 0;
        this.sumOfWinsFeature = 0;
        this.sumOfWinsSpecific = 0;
        this.hitRate = 0;

        this.sumOfScattersMain = 0;
        this.sumOfScattersFeature = 0;
        this.sumOfScattersSpecific = 0;

        this.sumOfLineWinsMain = 0;
        this.sumOfLineWinsFeature = 0;
        this.sumOfLineWinsSpecific = 0;

        this.bonusEnterings = 0;

        this.lineWinsSums = [];
        for (let i = 0; i < this.game.getInfo().Paylines.length; i++) {
            this.lineWinsSums.push(0);
        }

        this.sumOfSymbolHits = [];
        this.sumOfSymbolWins = [];
        this.sumOfSymbolHitsMain = [];
        this.sumOfSymbolWinsMain = [];
        this.sumOfSymbolHitsFeature = [];
        this.sumOfSymbolWinsFeature = [];
        this.sumOfSymbolHitsSpecific = [];
        this.sumOfSymbolWinsSpecific = [];

        this.sumOfSymbolHitsPerLine = [];
        this.sumOfSymbolWinsPerLine = [];

        this.sumOfSpins = 0;
        this.sumOfFreeSpins = 0;

        this.maxWin = 0;

        let symbolIndex = 0;

        this.game.getInfo().Paylines.forEach((line) => {
            line;
            this.sumOfSymbolHitsPerLine.push([]);
            this.sumOfSymbolWinsPerLine.push([]);
        });

        for (const sym in this.game.getInfo().Symbols) {
            sym;
            this.sumOfSymbolHits.push([]);
            this.sumOfSymbolWins.push([]);
            this.sumOfSymbolHitsMain.push([]);
            this.sumOfSymbolWinsMain.push([]);
            this.sumOfSymbolHitsFeature.push([]);
            this.sumOfSymbolWinsFeature.push([]);
            this.sumOfSymbolHitsSpecific.push([]);
            this.sumOfSymbolWinsSpecific.push([]);
            for (let i = 0; i < this.sumOfSymbolHitsPerLine.length; i++) {
                this.sumOfSymbolHitsPerLine[i].push([]);
            }

            for (let i = 0; i < this.sumOfSymbolWinsPerLine.length; i++) {
                this.sumOfSymbolWinsPerLine[i].push([]);
            }

            const maxTable = this.game.getInfo().Paytable[0].length;
            let maxScatters = 0;
            if (this.game.getInfo().ScatterPaytable) {
                for (
                    let i = 0;
                    i < this.game.getInfo().ScatterPaytable.length;
                    i++
                ) {
                    if (
                        this.game.getInfo().ScatterPaytable[i].length >
                        maxScatters
                    ) {
                        maxScatters = this.game.getInfo().ScatterPaytable[i]
                            .length;
                    }
                }
            }

            const maxLen = Math.max(maxTable, maxScatters);
            for (let kindOf = 0; kindOf < maxLen; kindOf++) {
                this.sumOfSymbolHits[symbolIndex].push(0);
                this.sumOfSymbolWins[symbolIndex].push(0);
                this.sumOfSymbolHitsMain[symbolIndex].push(0);
                this.sumOfSymbolWinsMain[symbolIndex].push(0);
                this.sumOfSymbolHitsFeature[symbolIndex].push(0);
                this.sumOfSymbolWinsFeature[symbolIndex].push(0);
                this.sumOfSymbolHitsSpecific[symbolIndex].push(0);
                this.sumOfSymbolWinsSpecific[symbolIndex].push(0);

                for (let i = 0; i < this.sumOfSymbolHitsPerLine.length; i++) {
                    this.sumOfSymbolHitsPerLine[i][symbolIndex].push(0);
                }
                for (let i = 0; i < this.sumOfSymbolWinsPerLine.length; i++) {
                    this.sumOfSymbolWinsPerLine[i][symbolIndex].push(0);
                }
            }
            symbolIndex++;
        }

        this.simulationRngHits = [];
        for (let i = 0; i < this.game.getInfo().ReelsNumber; i++) {
            this.simulationRngHits.push([]);
            for (let j = 0; j < this.game.getInfo().ReelLengths[i]; j++) {
                this.simulationRngHits[i].push(0);
            }
        }
    }

    updateStats(): void {
        // basic update
        const winDescription = this.game.State.winDescription;

        let featureWin = 0;
        if (winDescription.bonusWin && winDescription.bonusWin.length > 0) {
            this.bonusEnterings++;
            for (const bonusWin of winDescription.bonusWin) {
                featureWin += bonusWin.totalWin;
                this.sumOfFreeSpins++;
            }
        }
        this.sumOfSpins++;

        this.sumOfWinsMain += winDescription.totalWin - featureWin;
        this.sumOfWinsFeature += featureWin;
        this.sumOfWins += winDescription.totalWin;
        if (winDescription.totalWin > 0) {
            this.hitRate++;
        }
        if (winDescription.totalWin - featureWin > 0) {
            this.sumOfHitsMain++;
        }

        if (this.game.getInfo().expectedRTP) {
            const error =
                winDescription.totalWin /
                    (this.game.State.bet.current *
                        this.game.State.bet.lines.current) -
                this.game.getInfo().expectedRTP;
            this.sqrErrorSum += error * error;
        }

        if (winDescription.totalWin > this.maxWin) {
            this.maxWin = winDescription.totalWin;
            //@ts-ignore
            this.maxWinCombinationMain = this.game.getForcedPositionsCopy();
        }

        // advanced update
        for (let i = 0; i < winDescription.lineWins.length; i++) {
            if (winDescription.lineWins[i].affectedSymbolsBits > 0) {
                this.sumOfSymbolHitsMain[winDescription.lineWins[i].symbol][
                    winDescription.lineWins[i].symbolCount
                ]++;
                this.sumOfSymbolHits[winDescription.lineWins[i].symbol][
                    winDescription.lineWins[i].symbolCount
                ]++;
                this.sumOfSymbolHitsPerLine[
                    winDescription.lineWins[i].lineIndex
                ][winDescription.lineWins[i].symbol][
                    winDescription.lineWins[i].symbolCount
                ]++;
            }
            this.sumOfSymbolWinsMain[winDescription.lineWins[i].symbol][
                winDescription.lineWins[i].symbolCount
            ] += winDescription.lineWins[i].totalWin;
            this.sumOfSymbolWins[winDescription.lineWins[i].symbol][
                winDescription.lineWins[i].symbolCount
            ] += winDescription.lineWins[i].totalWin;
            this.sumOfSymbolWinsPerLine[winDescription.lineWins[i].lineIndex][
                winDescription.lineWins[i].symbol
            ][winDescription.lineWins[i].symbolCount] +=
                winDescription.lineWins[i].totalWin;

            this.sumOfLineWinsMain += winDescription.lineWins[i].totalWin;
            this.lineWinsSums[winDescription.lineWins[i].lineIndex] +=
                winDescription.lineWins[i].totalWin;
        }
        for (let i = 0; i < winDescription.scatterWin.length; i++) {
            if (winDescription.scatterWin[i].affectedSymbolsBits > 0) {
                this.sumOfSymbolHitsMain[winDescription.scatterWin[i].symbol][
                    winDescription.scatterWin[i].symbolCount
                ]++;
                this.sumOfSymbolHits[winDescription.scatterWin[i].symbol][
                    winDescription.scatterWin[i].symbolCount
                ]++;
            }
            this.sumOfSymbolWinsMain[winDescription.scatterWin[i].symbol][
                winDescription.scatterWin[i].symbolCount
            ] += winDescription.scatterWin[i].totalWin;
            this.sumOfSymbolWins[winDescription.scatterWin[i].symbol][
                winDescription.scatterWin[i].symbolCount
            ] += winDescription.scatterWin[i].totalWin;

            this.sumOfScattersMain += winDescription.scatterWin[i].totalWin;
        }

        if (winDescription.bonusWin && winDescription.bonusWin.length > 0) {
            for (const bonusWin of winDescription.bonusWin) {
                for (let i = 0; i < bonusWin.lineWins.length; i++) {
                    if (bonusWin.lineWins[i].affectedSymbolsBits > 0) {
                        this.sumOfSymbolHitsFeature[
                            bonusWin.lineWins[i].symbol
                        ][bonusWin.lineWins[i].symbolCount]++;
                        this.sumOfSymbolHits[bonusWin.lineWins[i].symbol][
                            bonusWin.lineWins[i].symbolCount
                        ]++;
                    }
                    this.sumOfSymbolWinsFeature[bonusWin.lineWins[i].symbol][
                        bonusWin.lineWins[i].symbolCount
                    ] += bonusWin.lineWins[i].totalWin;
                    this.sumOfSymbolWins[bonusWin.lineWins[i].symbol][
                        bonusWin.lineWins[i].symbolCount
                    ] += bonusWin.lineWins[i].totalWin;

                    this.sumOfLineWinsFeature += bonusWin.lineWins[i].totalWin;
                    this.lineWinsSums[bonusWin.lineWins[i].lineIndex] +=
                        bonusWin.lineWins[i].totalWin;
                }
                if (bonusWin.scatterWin) {
                    for (let i = 0; i < bonusWin.scatterWin.length; i++) {
                        if (bonusWin.scatterWin[i].affectedSymbolsBits > 0) {
                            this.sumOfSymbolHitsFeature[
                                bonusWin.scatterWin[i].symbol
                            ][bonusWin.scatterWin[i].symbolCount]++;
                            this.sumOfSymbolHits[bonusWin.scatterWin[i].symbol][
                                bonusWin.scatterWin[i].symbolCount
                            ]++;
                        }
                        this.sumOfSymbolWinsFeature[
                            bonusWin.scatterWin[i].symbol
                        ][bonusWin.scatterWin[i].symbolCount] +=
                            bonusWin.scatterWin[i].totalWin;
                        this.sumOfSymbolWins[bonusWin.scatterWin[i].symbol][
                            bonusWin.scatterWin[i].symbolCount
                        ] += bonusWin.scatterWin[i].totalWin;

                        this.sumOfScattersFeature +=
                            bonusWin.scatterWin[i].totalWin;
                    }
                }
            }
        }

        if (this.game.getInfo().lastMainPositions) {
            // simulation array. For checking rng hitting frequency of reel layout's fields
            for (let i = 0; i < this.game.getInfo().ReelsNumber; i++) {
                this.simulationRngHits[i][
                    this.game.getInfo().lastMainPositions[i]
                ]++;
            }
        }

        this.game.updateGameSpecificStats(this);
    }

    logBasicStats(
        fileName: string,
        isMaxWinCalc: boolean,
        final = false
    ): void {
        const totalBet =
            this.game.State.bet.current * this.game.State.bet.lines.current;
        const sumOfBets = this.sumOfSpins * totalBet;

        let lineWins;
        if (final) {
            lineWins = [];
            this.lineWinsSums.forEach((element) => {
                const val = (100 * element) / (this.sumOfSpins * totalBet);
                lineWins.push(val);
            });
        }

        this.sumOfSpins > 0 &&
            basiclog(fileName, '\ncurrentSpin = ', this.sumOfSpins);

        !isMaxWinCalc &&
            this.sumOfWins > 0 &&
            basiclog(fileName, 'payout', (100 * this.sumOfWins) / sumOfBets);
        this.sumOfWinsMain > 0 &&
            basiclog(
                fileName,
                'payoutMain',
                (100 * this.sumOfWinsMain) / sumOfBets
            );
        !isMaxWinCalc &&
            this.sumOfWinsFeature > 0 &&
            basiclog(
                fileName,
                'payoutFeature',
                (100 * this.sumOfWinsFeature) / sumOfBets
            );

        this.sumOfScattersMain > 0 &&
            basiclog(
                fileName,
                'payoutMainScatters',
                (100 * this.sumOfScattersMain) / sumOfBets
            );
        this.sumOfLineWinsMain > 0 &&
            basiclog(
                fileName,
                'payoutMainLineWins',
                (100 * this.sumOfLineWinsMain) / sumOfBets
            );

        !isMaxWinCalc &&
            this.sumOfScattersFeature > 0 &&
            basiclog(
                fileName,
                'payoutFeatureScatters',
                (100 * this.sumOfScattersFeature) / sumOfBets,
                (100 * this.sumOfScattersFeature) / this.sumOfWinsFeature,
                this.sumOfScattersFeature
            );
        !isMaxWinCalc &&
            this.sumOfLineWinsFeature > 0 &&
            basiclog(
                fileName,
                'payoutFeatureLineWins',
                (100 * this.sumOfLineWinsFeature) / sumOfBets,
                (100 * this.sumOfLineWinsFeature) / this.sumOfWinsFeature,
                this.sumOfLineWinsFeature
            );

        this.bonusEnterings > 0 &&
            basiclog(
                fileName,
                'bonusEnterings',
                this.bonusEnterings / this.sumOfSpins
            );

        this.sumOfHitsMain > 0 &&
            basiclog(
                fileName,
                'hitsMain',
                this.sumOfHitsMain,
                this.sumOfHitsMain / this.sumOfSpins
            );
        this.hitRate > 0 &&
            basiclog(fileName, 'hitRate', this.hitRate / this.sumOfSpins);

        lineWins &&
            lineWins.length > 0 &&
            basiclog(fileName, 'lineWinSums', lineWins);

        !isMaxWinCalc &&
            this.sqrErrorSum > 0 &&
            basiclog(
                fileName,
                'standard deviation',
                Math.sqrt(this.sqrErrorSum / this.sumOfSpins)
            );
        this.game.isForcingPositions &&
            basiclog(
                fileName,
                'forcedPositions',
                this.game.getForcedPositionsCopy()
            );

        isMaxWinCalc &&
            this.maxWin &&
            basiclog(fileName, 'max win', this.maxWin);
        isMaxWinCalc &&
            this.maxWin &&
            basiclog(fileName, 'max win multiplier', this.maxWin / totalBet);
        isMaxWinCalc &&
            this.maxWinCombinationMain &&
            basiclog(fileName, 'max win reels pos', this.maxWinCombinationMain);

        log(fileName, '\n');
        this.logGameSpecificStats();
    }

    protected logGameSpecificStats(): void {
        //hook
    }

    protected modifyStatsData(): void {
        //hook
    }

    logAdvancedStats(fileName: string): void {
        let symbolIndex = 0;
        let overallSumHits = 0;
        let overallSumWins = 0;
        let overallSumHitsMain = 0;
        let overallSumWinsMain = 0;
        let overallSumHitsFeature = 0;
        let overallSumWinsFeature = 0;
        let overallSumHitsSpecific = 0;
        let overallSumWinsSpecific = 0;

        const totalBet =
            this.game.State.bet.current * this.game.State.bet.lines.current;
        const sumOfBets = this.sumOfSpins * totalBet;

        if (this.simulationRngHits) {
            for (let i = 0; i < this.simulationRngHits.length; i++) {
                log(
                    fileName,
                    `simulationRngHits ${i}\n`,
                    this.simulationRngHits
                );
            }
        }

        log(fileName, '\nOVEALL');
        symbolIndex = 0;
        for (const sym in this.game.getInfo().Symbols) {
            log(fileName, `symbol ${sym} hits:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolHits[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolHits[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolHits[symbolIndex][kindOf]
                        } = ${
                            (100 * this.sumOfSymbolHits[symbolIndex][kindOf]) /
                            this.sumOfSpins
                        }%`
                    );
                }
                overallSumHits += this.sumOfSymbolHits[symbolIndex][kindOf];
            }
            log(fileName, `symbol ${sym} wins:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolWins[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolWins[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolWins[symbolIndex][kindOf]
                        } = ${
                            (100 * this.sumOfSymbolWins[symbolIndex][kindOf]) /
                            sumOfBets
                        }%`
                    );
                }
                overallSumWins += this.sumOfSymbolWins[symbolIndex][kindOf];
            }
            log(fileName, '\n');
            symbolIndex++;
        }

        log(fileName, '\nMAIN');
        symbolIndex = 0;
        for (const sym in this.game.getInfo().Symbols) {
            log(fileName, `symbol ${sym} hits:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolHitsMain[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolHitsMain[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolHitsMain[symbolIndex][kindOf]
                        } = ${
                            (100 *
                                this.sumOfSymbolHitsMain[symbolIndex][kindOf]) /
                            this.sumOfSpins
                        }%`
                    );
                    overallSumHitsMain += this.sumOfSymbolHitsMain[symbolIndex][
                        kindOf
                    ];
                }
            }
            log(fileName, `symbol ${sym} wins:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolWinsMain[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolWinsMain[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolWinsMain[symbolIndex][kindOf]
                        } = ${
                            (100 *
                                this.sumOfSymbolWinsMain[symbolIndex][kindOf]) /
                            sumOfBets
                        }%`
                    );
                    overallSumWinsMain += this.sumOfSymbolWinsMain[symbolIndex][
                        kindOf
                    ];
                }
            }
            log(fileName, '\n');
            symbolIndex++;
        }

        if (this.bonusEnterings) {
            log(fileName, '\nFREE SPINS');
            symbolIndex = 0;
            for (const sym in this.game.getInfo().Symbols) {
                log(fileName, `symbol ${sym} hits:`);
                for (
                    let kindOf = 1;
                    kindOf < this.sumOfSymbolHitsFeature[symbolIndex].length;
                    kindOf++
                ) {
                    if (this.sumOfSymbolHitsFeature[symbolIndex][kindOf] > 0) {
                        log(
                            fileName,
                            `x${kindOf}:\t ${
                                this.sumOfSymbolHitsFeature[symbolIndex][kindOf]
                            } = ${
                                (100 *
                                    this.sumOfSymbolHitsFeature[symbolIndex][
                                        kindOf
                                    ]) /
                                this.sumOfFreeSpins
                            }% of free spins`
                        );
                        overallSumHitsFeature += this.sumOfSymbolHitsFeature[
                            symbolIndex
                        ][kindOf];
                    }
                }
                log(fileName, `symbol ${sym} wins:`);
                for (
                    let kindOf = 1;
                    kindOf < this.sumOfSymbolWinsFeature[symbolIndex].length;
                    kindOf++
                ) {
                    if (this.sumOfSymbolWinsFeature[symbolIndex][kindOf] > 0) {
                        log(
                            fileName,
                            `x${kindOf}:\t ${
                                this.sumOfSymbolWinsFeature[symbolIndex][kindOf]
                            } = ${
                                (100 *
                                    this.sumOfSymbolWinsFeature[symbolIndex][
                                        kindOf
                                    ]) /
                                sumOfBets
                            }% of total rtp  = ${
                                (100 *
                                    this.sumOfSymbolWinsFeature[symbolIndex][
                                        kindOf
                                    ]) /
                                this.sumOfWinsFeature
                            }% of feature spins`
                        );
                        overallSumWinsFeature += this.sumOfSymbolWinsFeature[
                            symbolIndex
                        ][kindOf];
                    }
                }
                log(fileName, '\n');
                symbolIndex++;
            }
        }

        log(fileName, '\n' + this.specificText);
        symbolIndex = 0;
        for (const sym in this.game.getInfo().Symbols) {
            log(fileName, `symbol ${sym} hits:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolHitsSpecific[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolHitsSpecific[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolHitsSpecific[symbolIndex][kindOf]
                        } = ${
                            (100 *
                                this.sumOfSymbolHitsSpecific[symbolIndex][
                                    kindOf
                                ]) /
                            this.sumOfSpins
                        }%`
                    );
                    overallSumHitsSpecific += this.sumOfSymbolHitsSpecific[
                        symbolIndex
                    ][kindOf];
                }
            }
            log(fileName, `symbol ${sym} wins:`);
            for (
                let kindOf = 1;
                kindOf < this.sumOfSymbolWinsSpecific[symbolIndex].length;
                kindOf++
            ) {
                if (this.sumOfSymbolWinsSpecific[symbolIndex][kindOf] > 0) {
                    log(
                        fileName,
                        `x${kindOf}:\t ${
                            this.sumOfSymbolWinsSpecific[symbolIndex][kindOf]
                        } = ${
                            (100 *
                                this.sumOfSymbolWinsSpecific[symbolIndex][
                                    kindOf
                                ]) /
                            sumOfBets
                        }%`
                    );
                    overallSumWinsSpecific += this.sumOfSymbolWinsSpecific[
                        symbolIndex
                    ][kindOf];
                }
            }
            log(fileName, '\n');
            symbolIndex++;
        }

        overallSumHits > 0 &&
            log(
                fileName,
                `\nOverall Line Hits = ${overallSumHits} = ${
                    (100 * overallSumHits) / this.sumOfSpins
                }%`
            );
        overallSumWins > 0 &&
            log(
                fileName,
                `\nOverall Line Wins = ${overallSumWins} = ${
                    (100 * overallSumWins) / sumOfBets
                }%`
            );

        overallSumHitsMain > 0 &&
            log(
                fileName,
                `\nOverall Line Hits Main = ${overallSumHitsMain} = ${
                    (100 * overallSumHitsMain) / this.sumOfSpins
                }%`
            );
        overallSumWinsMain > 0 &&
            log(
                fileName,
                `\nOverall Line Wins Main = ${overallSumWinsMain} = ${
                    (100 * overallSumWinsMain) / sumOfBets
                }%`
            );

        overallSumHitsFeature > 0 &&
            log(
                fileName,
                `\nOverall Line Hits Free Spins = ${overallSumHitsFeature} = ${
                    (100 * overallSumHitsFeature) / this.sumOfSpins
                }%`
            );
        overallSumWinsFeature > 0 &&
            log(
                fileName,
                `\nOverall Line Wins Free Spins = ${overallSumWinsFeature} = ${
                    (100 * overallSumWinsFeature) / sumOfBets
                }%`
            );

        overallSumHitsSpecific > 0 &&
            log(
                fileName,
                `\nOverall Line Hits ${
                    this.specificText
                } = ${overallSumHitsSpecific} = ${
                    (100 * overallSumHitsSpecific) / this.sumOfSpins
                }%`
            );
        overallSumWinsSpecific > 0 &&
            log(
                fileName,
                `\nOverall Line Wins ${
                    this.specificText
                } = ${overallSumWinsSpecific} = ${
                    (100 * overallSumWinsSpecific) / sumOfBets
                }%`
            );

        log(fileName, '\nOVERALL PER LINE');
        let lineIndex = 0;
        this.game.getInfo().Paylines.forEach((line) => {
            symbolIndex = 0;
            for (const sym in this.game.getInfo().Symbols) {
                log(fileName, `line ${line}: `);
                log(fileName, `symbol ${sym} hits:`);
                for (
                    let kindOf = 1;
                    kindOf <
                    this.sumOfSymbolHitsPerLine[lineIndex][symbolIndex].length;
                    kindOf++
                ) {
                    if (
                        this.sumOfSymbolHitsPerLine[lineIndex][symbolIndex][
                            kindOf
                        ] > 0
                    ) {
                        log(
                            fileName,
                            `x${kindOf}:\t ${
                                this.sumOfSymbolHitsPerLine[lineIndex][
                                    symbolIndex
                                ][kindOf]
                            } = ${
                                (100 *
                                    this.sumOfSymbolHitsPerLine[lineIndex][
                                        symbolIndex
                                    ][kindOf]) /
                                this.sumOfSpins
                            }%`
                        );
                    }
                    overallSumHits += this.sumOfSymbolHitsPerLine[lineIndex][
                        symbolIndex
                    ][kindOf];
                }
                log(fileName, `symbol ${sym} wins:`);
                for (
                    let kindOf = 1;
                    kindOf <
                    this.sumOfSymbolWinsPerLine[lineIndex][symbolIndex].length;
                    kindOf++
                ) {
                    if (
                        this.sumOfSymbolWinsPerLine[lineIndex][symbolIndex][
                            kindOf
                        ] > 0
                    ) {
                        log(
                            fileName,
                            `x${kindOf}:\t ${
                                this.sumOfSymbolWinsPerLine[lineIndex][
                                    symbolIndex
                                ][kindOf]
                            } = ${
                                (100 *
                                    this.sumOfSymbolWinsPerLine[lineIndex][
                                        symbolIndex
                                    ][kindOf]) /
                                sumOfBets
                            }%`
                        );
                    }
                }
                log(fileName, '\n');
                symbolIndex++;
            }
            lineIndex++;
        });
    }
}
