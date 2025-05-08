import * as cliProgress from 'cli-progress';
import * as fs from 'fs';
//import { EOL } from 'os';
import * as readline from 'readline';

import DUMMYRNG from './rngExamples/dummyRNG';
import GamingIsaac from './rngExamples/GamingIsaac';
import { IGameConfig } from '../models/gamesAbstractModels';
import SpecificGame from '../../criticalFiles/index';
//import { IMainSLot } from '../models/games';
import { StatisticsLogs } from './statisticsLogs';
import {
    simMaxWinBonusIndexes,
    simMaxWinRngForcingVals,
} from '../../simSpecific';

class StatsGame extends SpecificGame {
    hasMaxWinForcing = false;
    //forcedPositions = [0, 37, 32, 32, 0];
    cheatTool = false;

    //redefinition
    protected async createScreenBonus(
        forcedPositions?: number[]
    ): Promise<number[][]> {
        if (
            this.hasMaxWinForcing &&
            simMaxWinBonusIndexes &&
            simMaxWinBonusIndexes[0] >= 0
        ) {
            return super.createScreenBonus(simMaxWinBonusIndexes);
        } else if (forcedPositions) {
            return super.createScreenBonus(forcedPositions);
        } else {
            return super.createScreenBonus();
        }
    }
}

let spins: number;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});

// const currentBetIndex = 0;
let game: StatsGame;
let rng = null;
let statisticsLogs: StatisticsLogs;
//const importService = new ImportService();
/* tslint:disable */
console.log('\nTo create game, Please select');
console.log('\ngame {rngType}');
console.log('rngType can be "dummy" or "GamingIsaac"');

const writeInputs = (): void => {
    console.log('Commands: ');
    console.log(
        '\ngame {rngType}. Possible options are dummy and GamingIsaac'
    );
    console.log(
        '\nbet {direction or amount}. Possible options are +, -, number'
    );
    console.log(
        '\nlines {direction or amount}. Possible options are +, -, number'
    );
    console.log('\nforce1line');
    console.log('\nplay {amount of spins} number}.');
    console.log('\nplay all.');
    console.log('\nplay maxwin.');
};

async function runTest(line: string): Promise<void> {
    const [command, option] = line.toString().split(' ');

    console.log(line);
    console.log(command, option);

    /* tslint:enable */
    if (command === 'game') {
        let rngType = '';

        if (option === 'dummy') {
            rngType = 'dummy';
            rng = new DUMMYRNG();
        } else {
            rngType = 'GamingIsaac';
            rng = new GamingIsaac();
        }
        const gameConfig: IGameConfig = {
            rngType,
        };

        // @ts-ignore
        game = new StatsGame(gameConfig, rng); //importService.importGame({ name: gameName });
        statisticsLogs = new StatisticsLogs(game);
        // @ts-ignore
        //game.state = game.state || game.GameState;
        console.log('\rng set to ', rngType);
        console.log('Current line bet is: ', game.State.bet.current);
        console.log(
            'Current amount of lines is: ',
            game.State.bet.lines.current
        );
        console.log(
            'Total wager is: ',
            game.State.bet.current * game.State.bet.lines.current
        );

        writeInputs();
    } else if (command === 'bet' || command === 'lines') {
        let passed = false;
        let direction: '+' | '-' | number;
        if (option !== '+' && option !== '-') {
            direction = +option;
            if (typeof direction != 'number') {
                console.log('invalid bet type');
            } else if (
                direction < game.State.bet.min ||
                direction > game.State.bet.max
            ) {
                console.log('invalid bet amount.');
                console.log(
                    `Valid amounts are between: ${game.State.bet.min} and ${game.State.bet.max}`
                );
            } else {
                passed = true;
            }
        } else {
            direction = option;
            passed = true;
        }

        if (passed) {
            game.action({
                actionType: command,
                actionInput: {
                    direction,
                },
            });
            console.log('\nCurrent bet is: ', game.State.bet.current);
            console.log(
                'Current amount of lines is: ',
                game.State.bet.lines.current
            );
            console.log(
                'Total wager is: ',
                game.State.bet.current * game.State.bet.lines.current
            );

            writeInputs();
        }
    } else if (command === 'force1line') {
        game.State.bet.lines.current = 1;
        console.log('\nCurrent bet is: ', game.State.bet.current);
        console.log(
            'Current amount of lines is: ',
            game.State.bet.lines.current
        );
        console.log(
            'Total wager is: ',
            game.State.bet.current * game.State.bet.lines.current
        );

        writeInputs();
    } else if (command === 'play') {
        game.isForcingPositions = false;
        if (option == 'all' || option == 'maxwin') {
            game.isForcingPositions = true;
            spins = game.getNumberOfPossibleCombinations();
            game.cheatTool = true;
        } else {
            spins = +option;
        }

        if (option == 'maxwin') {
            if (rng.hasOwnProperty('forceValue')) {
                rng['forceValue'] = simMaxWinRngForcingVals[0];
            }
            game.hasMaxWinForcing = true;
        }

        statisticsLogs.resetStats();

        const bar = new cliProgress.Bar(
            {
                barCompleteChar: '#',
                barIncompleteChar: '.',
                fps: 5,
                stream: process.stdout,
                barsize: 65,
                position: 'center',
            },
            cliProgress.Presets.shades_classic
        );

        const bet = game.State.bet.current;
        const lines = game.State.bet.lines.current;
        let totalWin = 0;
        let totalWager = 0;
        let wins = 0;
        const date: Date = new Date();
        const gameSuffix = `${
            game.gameName
        } ${spins} spin(s), ${date.toDateString()} ${date.toTimeString()}.log`;
        const fileName = 'testHarness' + gameSuffix;
        //const fileNameTotals = fileName; //'testHarnessTotals' + gameSuffix;

        fs.writeFileSync(fileName, '');
        bar.start(spins, 0);
        for (let i = 1; i <= spins; i++) {
            totalWager += bet * lines;
            if (option == 'maxwin' && game.isForcingPositions) {
                game.resetForcedPositions(i);
            }
            const result = await game.action({
                actionType: 'play',
            });
            if (result.rgs.win > 0) {
                wins++;
                totalWin += result.rgs.win;
            }

            // setTimeout(() => {
            //     console.log('game = ', JSON.stringify(game.State));
            // }, 3000);

            //specificGameLogs(result.state, i);

            //fs.appendFileSync('testHarness.log', `RTP: ${totalWin / totalWager}${EOL}`);

            if (option != 'maxwin' && game.isForcingPositions) {
                game.resetForcedPositions(i);
            }
            statisticsLogs.updateStats();
            if (i % 100000 == 0) {
                statisticsLogs.logBasicStats(fileName, game.hasMaxWinForcing);
            }

            bar.update(i);
        }
        bar.stop();

        setTimeout(() => {
            statisticsLogs.logBasicStats(fileName, game.hasMaxWinForcing, true);
            statisticsLogs.logAdvancedStats(fileName);

            fs.appendFileSync(
                fileName,
                `Spins: ${spins}
            Bet: ${bet}
            Lines: ${lines}
            Wager: ${bet * lines}
            Total win: ${totalWin}
            Total wager: ${totalWager}
            Num of wins: ${wins}`
            );

            console.log(
                '\nLogs were written in testHarness.log and testHarnessTotals.log file in the root of the project'
            );
            writeInputs();
        }, 500);
    }
}

rl.on('line', (line) => {
    runTest(line)
        .then(() => {
            console.log('test complete');
        })
        .catch((err) => console.log(err));
});

// const specificGameLogs = (gameState: IMainSLot, i: number): void => {
//     fs.appendFileSync(
//         'testHarness.log',
//         `Start Game ${i} Stake ${
//             gameState.bet.current * gameState.bet.lines.current
//         }${EOL}`
//     );

//     fs.appendFileSync('testHarness.log', `Reels details${EOL}`);
//     fs.appendFileSync('testHarness.log', `${gameState.screen[0]}${EOL}`);
//     fs.appendFileSync('testHarness.log', `${gameState.screen[1]}${EOL}`);
//     fs.appendFileSync('testHarness.log', `${gameState.screen[2]}${EOL}`);
//     fs.appendFileSync('testHarness.log', `${gameState.screen[3]}${EOL}`);
//     for (const line of gameState.winDescription.lineWins) {
//         fs.appendFileSync(
//             'testHarness.log',
//             `Line ${line.lineIndex} Symbol ${line.symbol} Win ${line.totalWin}${EOL}`
//         );
//     }
//     fs.appendFileSync(
//         'testHarness.log',
//         `Total Win ${gameState.winDescription.totalWin}${EOL}`
//     );
//     // if (state.winDescription.lineWins.length > 0) {
//     // 	fs.appendFileSync('testHarness.log', `Cascading screen${EOL}`);
//     // }

//     if (
//         gameState.winDescription.bonusWin &&
//         gameState.winDescription.bonusWin.length > 0
//     ) {
//         fs.appendFileSync('testHarness.log', `Start Bonus Game${EOL}`);
//         let totalBonusWin = 0;
//         for (const { screen, lineWins, scatterWin, totalWin } of gameState
//             .winDescription.bonusWin) {
//             fs.appendFileSync(
//                 'testHarness.log',
//                 `Bonus Game Reels details${EOL}`
//             );
//             fs.appendFileSync('testHarness.log', `${screen[0]}${EOL}`);
//             fs.appendFileSync('testHarness.log', `${screen[1]}${EOL}`);
//             fs.appendFileSync('testHarness.log', `${screen[2]}${EOL}`);
//             fs.appendFileSync('testHarness.log', `${screen[3]}${EOL}`);
//             for (const line of lineWins) {
//                 fs.appendFileSync(
//                     'testHarness.log',
//                     `Line ${line.lineIndex} Symbol ${line.symbol}${EOL}`
//                 );
//             }
//             for (const scatter of scatterWin) {
//                 fs.appendFileSync(
//                     'testHarness.log',
//                     `Line ${scatter} Symbol ${scatter.symbol}${EOL}`
//                 );
//             }
//             totalBonusWin += totalWin;
//         }
//         fs.appendFileSync(
//             'testHarness.log',
//             `Bonus Game Win ${totalBonusWin}${EOL}`
//         );
//         fs.appendFileSync('testHarness.log', `End Bonus Game${EOL}`);
//     }
//     fs.appendFileSync(
//         'testHarness.log',
//         `Game ${i} Win ${gameState.winDescription.totalWin}${EOL}`
//     );
//     fs.appendFileSync('testHarness.log', `End Game ${i}${EOL}`);
// };
