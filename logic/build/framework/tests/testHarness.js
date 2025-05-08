"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cliProgress = __importStar(require("cli-progress"));
var fs = __importStar(require("fs"));
//import { EOL } from 'os';
var readline = __importStar(require("readline"));
var dummyRNG_1 = __importDefault(require("./rngExamples/dummyRNG"));
var GamingIsaac_1 = __importDefault(require("./rngExamples/GamingIsaac"));
var index_1 = __importDefault(require("../../criticalFiles/index"));
//import { IMainSLot } from '../models/games';
var statisticsLogs_1 = require("./statisticsLogs");
var simSpecific_1 = require("../../simSpecific");
var StatsGame = /** @class */ (function (_super) {
    __extends(StatsGame, _super);
    function StatsGame() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasMaxWinForcing = false;
        //forcedPositions = [0, 37, 32, 32, 0];
        _this.cheatTool = false;
        return _this;
    }
    //redefinition
    StatsGame.prototype.createScreenBonus = function (forcedPositions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (this.hasMaxWinForcing &&
                    simSpecific_1.simMaxWinBonusIndexes &&
                    simSpecific_1.simMaxWinBonusIndexes[0] >= 0) {
                    return [2 /*return*/, _super.prototype.createScreenBonus.call(this, simSpecific_1.simMaxWinBonusIndexes)];
                }
                else if (forcedPositions) {
                    return [2 /*return*/, _super.prototype.createScreenBonus.call(this, forcedPositions)];
                }
                else {
                    return [2 /*return*/, _super.prototype.createScreenBonus.call(this)];
                }
                return [2 /*return*/];
            });
        });
    };
    return StatsGame;
}(index_1.default));
var spins;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
});
// const currentBetIndex = 0;
var game;
var rng = null;
var statisticsLogs;
//const importService = new ImportService();
/* tslint:disable */
console.log('\nTo create game, Please select');
console.log('\ngame {rngType}');
console.log('rngType can be "dummy" or "GamingIsaac"');
var writeInputs = function () {
    console.log('Commands: ');
    console.log('\ngame {rngType}. Possible options are dummy and GamingIsaac');
    console.log('\nbet {direction or amount}. Possible options are +, -, number');
    console.log('\nlines {direction or amount}. Possible options are +, -, number');
    console.log('\nforce1line');
    console.log('\nplay {amount of spins} number}.');
    console.log('\nplay all.');
    console.log('\nplay maxwin.');
};
function runTest(line) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, command, option, rngType, gameConfig, passed, direction, bar, bet_1, lines_1, totalWin_1, totalWager_1, wins_1, date, gameSuffix, fileName_1, i, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = line.toString().split(' '), command = _a[0], option = _a[1];
                    console.log(line);
                    console.log(command, option);
                    if (!(command === 'game')) return [3 /*break*/, 1];
                    rngType = '';
                    if (option === 'dummy') {
                        rngType = 'dummy';
                        rng = new dummyRNG_1.default();
                    }
                    else {
                        rngType = 'GamingIsaac';
                        rng = new GamingIsaac_1.default();
                    }
                    gameConfig = {
                        rngType: rngType,
                    };
                    // @ts-ignore
                    game = new StatsGame(gameConfig, rng); //importService.importGame({ name: gameName });
                    statisticsLogs = new statisticsLogs_1.StatisticsLogs(game);
                    // @ts-ignore
                    //game.state = game.state || game.GameState;
                    console.log('\rng set to ', rngType);
                    console.log('Current line bet is: ', game.State.bet.current);
                    console.log('Current amount of lines is: ', game.State.bet.lines.current);
                    console.log('Total wager is: ', game.State.bet.current * game.State.bet.lines.current);
                    writeInputs();
                    return [3 /*break*/, 8];
                case 1:
                    if (!(command === 'bet' || command === 'lines')) return [3 /*break*/, 2];
                    passed = false;
                    direction = void 0;
                    if (option !== '+' && option !== '-') {
                        direction = +option;
                        if (typeof direction != 'number') {
                            console.log('invalid bet type');
                        }
                        else if (direction < game.State.bet.min ||
                            direction > game.State.bet.max) {
                            console.log('invalid bet amount.');
                            console.log("Valid amounts are between: " + game.State.bet.min + " and " + game.State.bet.max);
                        }
                        else {
                            passed = true;
                        }
                    }
                    else {
                        direction = option;
                        passed = true;
                    }
                    if (passed) {
                        game.action({
                            actionType: command,
                            actionInput: {
                                direction: direction,
                            },
                        });
                        console.log('\nCurrent bet is: ', game.State.bet.current);
                        console.log('Current amount of lines is: ', game.State.bet.lines.current);
                        console.log('Total wager is: ', game.State.bet.current * game.State.bet.lines.current);
                        writeInputs();
                    }
                    return [3 /*break*/, 8];
                case 2:
                    if (!(command === 'force1line')) return [3 /*break*/, 3];
                    game.State.bet.lines.current = 1;
                    console.log('\nCurrent bet is: ', game.State.bet.current);
                    console.log('Current amount of lines is: ', game.State.bet.lines.current);
                    console.log('Total wager is: ', game.State.bet.current * game.State.bet.lines.current);
                    writeInputs();
                    return [3 /*break*/, 8];
                case 3:
                    if (!(command === 'play')) return [3 /*break*/, 8];
                    game.isForcingPositions = false;
                    if (option == 'all' || option == 'maxwin') {
                        game.isForcingPositions = true;
                        spins = game.getNumberOfPossibleCombinations();
                        game.cheatTool = true;
                    }
                    else {
                        spins = +option;
                    }
                    if (option == 'maxwin') {
                        if (rng.hasOwnProperty('forceValue')) {
                            rng['forceValue'] = simSpecific_1.simMaxWinRngForcingVals[0];
                        }
                        game.hasMaxWinForcing = true;
                    }
                    statisticsLogs.resetStats();
                    bar = new cliProgress.Bar({
                        barCompleteChar: '#',
                        barIncompleteChar: '.',
                        fps: 5,
                        stream: process.stdout,
                        barsize: 65,
                        position: 'center',
                    }, cliProgress.Presets.shades_classic);
                    bet_1 = game.State.bet.current;
                    lines_1 = game.State.bet.lines.current;
                    totalWin_1 = 0;
                    totalWager_1 = 0;
                    wins_1 = 0;
                    date = new Date();
                    gameSuffix = game.gameName + " " + spins + " spin(s), " + date.toDateString() + " " + date.toTimeString() + ".log";
                    fileName_1 = 'testHarness' + gameSuffix;
                    //const fileNameTotals = fileName; //'testHarnessTotals' + gameSuffix;
                    fs.writeFileSync(fileName_1, '');
                    bar.start(spins, 0);
                    i = 1;
                    _b.label = 4;
                case 4:
                    if (!(i <= spins)) return [3 /*break*/, 7];
                    totalWager_1 += bet_1 * lines_1;
                    if (option == 'maxwin' && game.isForcingPositions) {
                        game.resetForcedPositions(i);
                    }
                    return [4 /*yield*/, game.action({
                            actionType: 'play',
                        })];
                case 5:
                    result = _b.sent();
                    if (result.rgs.win > 0) {
                        wins_1++;
                        totalWin_1 += result.rgs.win;
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
                        statisticsLogs.logBasicStats(fileName_1, game.hasMaxWinForcing);
                    }
                    bar.update(i);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 4];
                case 7:
                    bar.stop();
                    setTimeout(function () {
                        statisticsLogs.logBasicStats(fileName_1, game.hasMaxWinForcing, true);
                        statisticsLogs.logAdvancedStats(fileName_1);
                        fs.appendFileSync(fileName_1, "Spins: " + spins + "\n            Bet: " + bet_1 + "\n            Lines: " + lines_1 + "\n            Wager: " + bet_1 * lines_1 + "\n            Total win: " + totalWin_1 + "\n            Total wager: " + totalWager_1 + "\n            Num of wins: " + wins_1);
                        console.log('\nLogs were written in testHarness.log and testHarnessTotals.log file in the root of the project');
                        writeInputs();
                    }, 500);
                    _b.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
rl.on('line', function (line) {
    runTest(line)
        .then(function () {
        console.log('test complete');
    })
        .catch(function (err) { return console.log(err); });
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
