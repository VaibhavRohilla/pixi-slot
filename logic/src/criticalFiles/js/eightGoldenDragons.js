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
var leftToRightSlot_1 = __importDefault(require("./leftToRightSlot"));
var eightGoldenDragonsInfo_1 = __importStar(require("./eightGoldenDragonsInfo"));
var Helpers = __importStar(require("../framework/helpers"));
var initState_1 = require("../initState");
var EightGoldenLions = /** @class */ (function (_super) {
    __extends(EightGoldenLions, _super);
    function EightGoldenLions(gameConfig, rng, initState) {
        var _this = _super.call(this, eightGoldenDragonsInfo_1.default, gameConfig, rng) || this;
        _this.gameName = 'Eight Golden Dragons';
        if (initState) {
            _this.Start(initState);
        }
        else {
            var initStateFromConfig = Helpers.getInitStateFromConfig(_this.getGameConfig, initState_1.INIT_STATE);
            var defaultState = JSON.parse(JSON.stringify(initStateFromConfig));
            _this.Start(defaultState);
        }
        if (_this.info.Paylines) {
            Object.assign(_this.State, {
                winLines: JSON.parse(JSON.stringify(_this.info.Paylines)),
            });
        }
        if (_this.info.Symbols) {
            var syms = [];
            var i = 0;
            for (var sym in _this.info.Symbols) {
                if (i !== _this.info.Symbols.AnyX) {
                    syms.push(sym);
                }
                i++;
            }
            Object.assign(_this.State, { symbols: syms });
        }
        if (_this.info.SymbolsBonus) {
            var syms = [];
            var i = 0;
            for (var sym in _this.info.SymbolsBonus) {
                if (i !== _this.info.Symbols.AnyX) {
                    syms.push(sym);
                }
                i++;
            }
            Object.assign(_this.State, { symbolsBonus: syms });
        }
        if (_this.info.Paytable) {
            Object.assign(_this.State, {
                paytable: JSON.parse(JSON.stringify(_this.info.Paytable)),
            });
        }
        if (_this.info.ScatterPaytable) {
            Object.assign(_this.State, {
                scattersPaytable: JSON.parse(JSON.stringify(_this.info.ScatterPaytable)),
            });
        }
        return _this;
    }
    EightGoldenLions.prototype.getInfo = function () {
        return this.info;
    };
    EightGoldenLions.prototype.play = function () {
        return __awaiter(this, void 0, void 0, function () {
            var simulatorOn, allCombinations, forcedPositions, sumOfHits10SpinsMain, hits10SpinsMain, sumOfWins, sumOfHitsMain, sumOfWinsMain, sumOfWinsFeature, hitRate, sumOfScattersMain, sumOfScattersFeature, sumOfMasksMain, sumOfMasksFeature, sumOfLineWinsMain, sumOfLineWinsFeature, bonusEnterings, lineWinsSums, i, sumOfSymbolHits, sumOfSymbolWins, sumOfSymbolHitsMain, sumOfSymbolWinsMain, sumOfSymbolHitsFeature, sumOfSymbolWinsFeature, symbolIndex, sym, maxTable, maxScatters, i, maxLen, kindOf, sumOfSpins, reelIndex, winDescription, sumOfFreeSpins, _loop_1, this_1, currentSpin, symbolIndex, sym, kindOf, kindOf, sym, kindOf, kindOf, sym, kindOf, kindOf;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        simulatorOn = false;
                        allCombinations = false;
                        forcedPositions = [0, 0, 0, 0, 0];
                        sumOfHits10SpinsMain = 0;
                        hits10SpinsMain = 0;
                        sumOfWins = 0;
                        sumOfHitsMain = 0;
                        sumOfWinsMain = 0;
                        sumOfWinsFeature = 0;
                        hitRate = 0;
                        sumOfScattersMain = 0;
                        sumOfScattersFeature = 0;
                        sumOfMasksMain = 0;
                        sumOfMasksFeature = 0;
                        sumOfLineWinsMain = 0;
                        sumOfLineWinsFeature = 0;
                        bonusEnterings = 0;
                        lineWinsSums = [];
                        if (simulatorOn) {
                            for (i = 0; i < this.info.Paylines.length; i++) {
                                lineWinsSums.push(0);
                            }
                        }
                        sumOfSymbolHits = [];
                        sumOfSymbolWins = [];
                        sumOfSymbolHitsMain = [];
                        sumOfSymbolWinsMain = [];
                        sumOfSymbolHitsFeature = [];
                        sumOfSymbolWinsFeature = [];
                        if (simulatorOn) {
                            symbolIndex = 0;
                            for (sym in this.info.Symbols) {
                                sym;
                                sumOfSymbolHits.push([]);
                                sumOfSymbolWins.push([]);
                                sumOfSymbolHitsMain.push([]);
                                sumOfSymbolWinsMain.push([]);
                                sumOfSymbolHitsFeature.push([]);
                                sumOfSymbolWinsFeature.push([]);
                                maxTable = this.info.Paytable[0].length;
                                maxScatters = 0;
                                if (this.info.ScatterPaytable) {
                                    for (i = 0; i < this.info.ScatterPaytable.length; i++) {
                                        if (this.info.ScatterPaytable[i].length > maxScatters) {
                                            maxScatters = this.info.ScatterPaytable[i].length;
                                        }
                                    }
                                }
                                maxLen = Math.max(maxTable, maxScatters);
                                for (kindOf = 0; kindOf < maxLen; kindOf++) {
                                    sumOfSymbolHits[symbolIndex].push(0);
                                    sumOfSymbolWins[symbolIndex].push(0);
                                    sumOfSymbolHitsMain[symbolIndex].push(0);
                                    sumOfSymbolWinsMain[symbolIndex].push(0);
                                    sumOfSymbolHitsFeature[symbolIndex].push(0);
                                    sumOfSymbolWinsFeature[symbolIndex].push(0);
                                }
                                symbolIndex++;
                            }
                        }
                        sumOfSpins = 100000000;
                        if (allCombinations) {
                            sumOfSpins = 1;
                            for (reelIndex = this.info.ReelsNumber - 1; reelIndex >= 0; reelIndex--) {
                                sumOfSpins *= this.info.ReelLengths[reelIndex];
                            }
                        }
                        sumOfFreeSpins = 0;
                        _loop_1 = function (currentSpin) {
                            var spn, reelIndex, scatterIndex, maskIndex, screen_1, affectedSymbolsBits, totalWin, scatterWin, scatWin, maskWin, payout, lineWins, i, i, bonusWin, multiplier, freeSpinsRnd, triggeredData, spins, spinsCount, newScreen, newScats, newScat, newMaskWin, newPayout, bonusSpin, i, i;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (allCombinations) {
                                            spn = currentSpin - 1;
                                            for (reelIndex = this_1.info.ReelsNumber - 1; reelIndex >= 0; reelIndex--) {
                                                forcedPositions[reelIndex] =
                                                    spn % this_1.info.ReelLengths[reelIndex];
                                                spn = Math.floor(spn / this_1.info.ReelLengths[reelIndex]);
                                            }
                                            // console.log("forcedPositions", forcedPositions);
                                        }
                                        scatterIndex = 0;
                                        maskIndex = 1;
                                        return [4 /*yield*/, (!this_1.isForcingPositions
                                                ? this_1.createScreen()
                                                : this_1.createScreen(this_1.forcedPositions))];
                                    case 1:
                                        screen_1 = _a.sent();
                                        affectedSymbolsBits = 0;
                                        totalWin = 0;
                                        scatterWin = [];
                                        scatWin = this_1.scatterWin(screen_1, this_1.info.Symbols.Scatter, this_1.State.bet, scatterIndex);
                                        if (scatWin.affectedSymbolsBits > 0) {
                                            totalWin += scatWin.totalWin;
                                            scatterWin.push(scatWin);
                                            affectedSymbolsBits |= scatWin.affectedSymbolsBits;
                                        }
                                        maskWin = this_1.scatterWin(screen_1, this_1.info.Symbols.Mask, this_1.State.bet, maskIndex);
                                        if (maskWin.affectedSymbolsBits > 0) {
                                            totalWin += maskWin.totalWin;
                                            scatterWin.push(maskWin);
                                            affectedSymbolsBits |= maskWin.affectedSymbolsBits;
                                        }
                                        payout = this_1.modifyPayoutWithByAnyX(screen_1, this_1.calculatePayout(screen_1, this_1.State.bet, this_1.info.Symbols.Wild).lineWins, this_1.info.Symbols.AnyX, this_1.info.Symbols.Scatter, this_1.info.Symbols.X1, this_1.info.Symbols.X2, this_1.info.Symbols.X3, this_1.info.Symbols.Wild);
                                        lineWins = payout.lineWins;
                                        totalWin += payout.totalWin;
                                        lineWins.forEach(function (lw) {
                                            affectedSymbolsBits |= lw.affectedSymbolsBits;
                                        });
                                        if (simulatorOn) {
                                            for (i = 0; i < lineWins.length; i++) {
                                                lineWinsSums[lineWins[i].lineIndex] += lineWins[i].totalWin;
                                                sumOfSymbolHits[lineWins[i].symbol][lineWins[i].symbolCount]++;
                                                sumOfSymbolWins[lineWins[i].symbol][lineWins[i].symbolCount] += lineWins[i].totalWin;
                                                sumOfSymbolHitsMain[lineWins[i].symbol][lineWins[i].symbolCount]++;
                                                sumOfSymbolWinsMain[lineWins[i].symbol][lineWins[i].symbolCount] += lineWins[i].totalWin;
                                            }
                                            for (i = 0; i < scatterWin.length; i++) {
                                                sumOfSymbolHits[scatterWin[i].symbol][scatterWin[i].symbolCount]++;
                                                sumOfSymbolWins[scatterWin[i].symbol][scatterWin[i].symbolCount] += scatterWin[i].totalWin;
                                                sumOfSymbolHitsMain[scatterWin[i].symbol][scatterWin[i].symbolCount]++;
                                                sumOfSymbolWinsMain[scatterWin[i].symbol][scatterWin[i].symbolCount] += scatterWin[i].totalWin;
                                            }
                                            if (totalWin > 0) {
                                                sumOfHitsMain++;
                                                hits10SpinsMain++;
                                            }
                                            sumOfWinsMain += totalWin;
                                            sumOfScattersMain += scatWin.totalWin;
                                            sumOfMasksMain += maskWin.totalWin;
                                            sumOfLineWinsMain += payout.totalWin;
                                        }
                                        bonusWin = [];
                                        multiplier = 1;
                                        if (!(scatWin.symbolCount >= 3)) return [3 /*break*/, 5];
                                        bonusEnterings++;
                                        return [4 /*yield*/, this_1.getRng.getRandomInt({
                                                min: 0,
                                                max: eightGoldenDragonsInfo_1.freeSpinsTriggerAmounts.length - 1,
                                            })];
                                    case 2:
                                        freeSpinsRnd = _a.sent();
                                        triggeredData = eightGoldenDragonsInfo_1.freeSpinsTriggerAmounts[freeSpinsRnd];
                                        multiplier = triggeredData.multiplier;
                                        spins = triggeredData.freeSpins;
                                        spinsCount = 1;
                                        _a.label = 3;
                                    case 3:
                                        if (!(spins > 0)) return [3 /*break*/, 5];
                                        return [4 /*yield*/, this_1.createScreenBonus()];
                                    case 4:
                                        newScreen = _a.sent();
                                        newScats = [];
                                        newScat = this_1.scatterWin(newScreen, this_1.info.Symbols.Scatter, this_1.State.bet, scatterIndex);
                                        if (newScat.affectedSymbolsBits > 0) {
                                            newScats.push(newScat);
                                            //affectedSymbolsBits |= scatWin.affectedSymbolsBits;
                                        }
                                        newMaskWin = this_1.scatterWin(newScreen, this_1.info.Symbols.Mask, this_1.State.bet, maskIndex);
                                        if (newMaskWin.affectedSymbolsBits > 0) {
                                            newScats.push(newMaskWin);
                                            //affectedSymbolsBits |= maskWin.affectedSymbolsBits;
                                        }
                                        newScat.totalWin *= multiplier;
                                        totalWin += newScat.totalWin;
                                        //newMaskWin.totalWin *= multiplier;
                                        totalWin += newMaskWin.totalWin;
                                        newPayout = this_1.modifyPayoutWithByAnyX(newScreen, this_1.calculatePayout(newScreen, this_1.State.bet, this_1.info.Symbols.Wild).lineWins, this_1.info.Symbols.AnyX, this_1.info.Symbols.Scatter, this_1.info.Symbols.X1, this_1.info.Symbols.X2, this_1.info.Symbols.X3, this_1.info.Symbols.Wild);
                                        newPayout.lineWins.map(function (w) { return (w.totalWin *= multiplier); });
                                        newPayout.totalWin *= multiplier;
                                        totalWin += newPayout.totalWin;
                                        bonusSpin = {
                                            screen: newScreen,
                                            totalWin: newScat.totalWin +
                                                newMaskWin.totalWin +
                                                newPayout.totalWin,
                                            lineWins: newPayout.lineWins,
                                            scatterWin: newScats,
                                            totalSpins: spinsCount + spins - 1,
                                            spinsCount: spinsCount,
                                        };
                                        bonusWin.push(bonusSpin);
                                        if (newScat.symbolCount >= 3) {
                                            spins += triggeredData.freeSpins;
                                        }
                                        spins--;
                                        spinsCount++;
                                        sumOfFreeSpins++;
                                        if (simulatorOn) {
                                            for (i = 0; i < newPayout.lineWins.length; i++) {
                                                sumOfSymbolHits[newPayout.lineWins[i].symbol][newPayout.lineWins[i].symbolCount]++;
                                                sumOfSymbolWins[newPayout.lineWins[i].symbol][newPayout.lineWins[i].symbolCount] += newPayout.lineWins[i].totalWin;
                                                sumOfSymbolHitsFeature[newPayout.lineWins[i].symbol][newPayout.lineWins[i].symbolCount]++;
                                                sumOfSymbolWinsFeature[newPayout.lineWins[i].symbol][newPayout.lineWins[i].symbolCount] +=
                                                    newPayout.lineWins[i].totalWin;
                                            }
                                            for (i = 0; i < newScats.length; i++) {
                                                sumOfSymbolHits[newScats[i].symbol][newScats[i].symbolCount]++;
                                                sumOfSymbolWins[newScats[i].symbol][newScats[i].symbolCount] += newScats[i].totalWin;
                                                sumOfSymbolHitsFeature[newScats[i].symbol][newScats[i].symbolCount]++;
                                                sumOfSymbolWinsFeature[newScats[i].symbol][newScats[i].symbolCount] += newScats[i].totalWin;
                                            }
                                            sumOfWinsFeature +=
                                                newScat.totalWin +
                                                    newMaskWin.totalWin +
                                                    newPayout.totalWin;
                                            sumOfScattersFeature += newScat.totalWin;
                                            sumOfMasksFeature += newMaskWin.totalWin;
                                            sumOfLineWinsFeature += newPayout.totalWin;
                                        }
                                        return [3 /*break*/, 3];
                                    case 5:
                                        if (simulatorOn) {
                                            sumOfWins += totalWin;
                                            if (totalWin > 0) {
                                                hitRate++;
                                            }
                                            if (currentSpin % 10 == 0) {
                                                sumOfHits10SpinsMain += hits10SpinsMain;
                                                hits10SpinsMain = 0;
                                            }
                                        }
                                        winDescription = {
                                            totalWin: totalWin,
                                            lineWins: lineWins,
                                            scatterWin: scatterWin,
                                            bonusWin: bonusWin,
                                            additional: {
                                                multiplier: multiplier,
                                            },
                                        };
                                        this_1.State = {
                                            win: totalWin,
                                            screen: screen_1,
                                            winDescription: winDescription,
                                            isWin: totalWin > 0,
                                            affectedSymbolsBits: affectedSymbolsBits,
                                            bet: this_1.State.bet,
                                        };
                                        if (simulatorOn && currentSpin % 100000 == 0) {
                                            console.log('currentSpin = ', currentSpin);
                                            console.log('payout', (100 * sumOfWins) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutMain', (100 * sumOfWinsMain) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutFeature', (100 * sumOfWinsFeature) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutMainScatters', (100 * sumOfScattersMain) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutMainMasks', (100 * sumOfMasksMain) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutMainLineWins', (100 * sumOfLineWinsMain) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current));
                                            console.log('payoutFeatureScatters', (100 * sumOfScattersFeature) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current), (100 * sumOfScattersFeature) / sumOfWinsFeature);
                                            console.log('payoutFeatureMasks', (100 * sumOfMasksFeature) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current), (100 * sumOfMasksFeature) / sumOfWinsFeature);
                                            console.log('payoutFeatureLineWins', (100 * sumOfLineWinsFeature) /
                                                (currentSpin *
                                                    this_1.State.bet.current *
                                                    this_1.State.bet.lines.current), (100 * sumOfLineWinsFeature) / sumOfWinsFeature);
                                            console.log('bonusEnterings', bonusEnterings / currentSpin);
                                            console.log('sumOfHits10SpinsMain', sumOfHits10SpinsMain, sumOfHits10SpinsMain / (currentSpin / 10));
                                            console.log('hitsMain', sumOfHitsMain, sumOfHitsMain / currentSpin);
                                            console.log('hitRate', hitRate / currentSpin);
                                            allCombinations &&
                                                console.log('forcedPositions', forcedPositions);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        };
                        this_1 = this;
                        currentSpin = 1;
                        _a.label = 1;
                    case 1:
                        if (!((!simulatorOn && currentSpin <= 1) ||
                            (simulatorOn && currentSpin <= sumOfSpins))) return [3 /*break*/, 4];
                        return [5 /*yield**/, _loop_1(currentSpin)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        currentSpin++;
                        return [3 /*break*/, 1];
                    case 4:
                        if (simulatorOn) {
                            console.log('payout', (100 * sumOfWins) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutMain', (100 * sumOfWinsMain) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutFeature', (100 * sumOfWinsFeature) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutMainScatters', (100 * sumOfScattersMain) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutMainMasks', (100 * sumOfMasksMain) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutMainLineWins', (100 * sumOfLineWinsMain) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current));
                            console.log('payoutFeatureScatters', (100 * sumOfScattersFeature) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current), (100 * sumOfScattersFeature) / sumOfWinsFeature);
                            console.log('payoutFeatureMasks', (100 * sumOfMasksFeature) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current), (100 * sumOfMasksFeature) / sumOfWinsFeature);
                            console.log('payoutFeatureLineWins', (100 * sumOfLineWinsFeature) /
                                (sumOfSpins *
                                    this.State.bet.current *
                                    this.State.bet.lines.current), (100 * sumOfLineWinsFeature) / sumOfWinsFeature);
                            console.log('bonusEnterings', bonusEnterings / sumOfSpins);
                            console.log('sumOfHits10SpinsMain', sumOfHits10SpinsMain, sumOfHits10SpinsMain / (sumOfSpins / 10));
                            console.log('hitsMain', sumOfHitsMain, sumOfHitsMain / sumOfSpins);
                            console.log('hitRate', hitRate / sumOfSpins);
                            allCombinations && console.log('forcedPositions', forcedPositions);
                            symbolIndex = 0;
                            console.log('\nOVEALL');
                            symbolIndex = 0;
                            for (sym in this.info.Symbols) {
                                console.log("symbol " + sym + " hits:");
                                for (kindOf = 1; kindOf < sumOfSymbolHits[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolHits[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolHits[symbolIndex][kindOf] + " = " + (100 * sumOfSymbolHits[symbolIndex][kindOf]) /
                                            sumOfSpins + "%");
                                    }
                                }
                                console.log("symbol " + sym + " wins:");
                                for (kindOf = 1; kindOf < sumOfSymbolWins[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolWins[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolWins[symbolIndex][kindOf] + " = " + sumOfSymbolWins[symbolIndex][kindOf] /
                                            (sumOfSpins *
                                                this.State.bet.current *
                                                this.State.bet.lines.current) + "%");
                                    }
                                }
                                console.log('\n');
                                symbolIndex++;
                            }
                            console.log('\nMAIN');
                            symbolIndex = 0;
                            for (sym in this.info.Symbols) {
                                console.log("symbol " + sym + " hits:");
                                for (kindOf = 1; kindOf < sumOfSymbolHitsMain[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolHitsMain[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolHitsMain[symbolIndex][kindOf] + " = " + (100 *
                                            sumOfSymbolHitsMain[symbolIndex][kindOf]) /
                                            sumOfSpins + "%");
                                    }
                                }
                                console.log("symbol " + sym + " wins:");
                                for (kindOf = 1; kindOf < sumOfSymbolWinsMain[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolWinsMain[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolWinsMain[symbolIndex][kindOf] + " = " + sumOfSymbolWinsMain[symbolIndex][kindOf] /
                                            (sumOfSpins *
                                                this.State.bet.current *
                                                this.State.bet.lines.current) + "%");
                                    }
                                }
                                console.log('\n');
                                symbolIndex++;
                            }
                            console.log('\nFREE SPINS');
                            symbolIndex = 0;
                            for (sym in this.info.Symbols) {
                                console.log("symbol " + sym + " hits:");
                                for (kindOf = 1; kindOf < sumOfSymbolHitsFeature[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolHitsFeature[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolHitsFeature[symbolIndex][kindOf] + " = " + (100 *
                                            sumOfSymbolHitsFeature[symbolIndex][kindOf]) /
                                            sumOfFreeSpins + "% of free spins");
                                    }
                                }
                                console.log("symbol " + sym + " wins:");
                                for (kindOf = 1; kindOf < sumOfSymbolWinsFeature[symbolIndex].length; kindOf++) {
                                    if (sumOfSymbolWinsFeature[symbolIndex][kindOf] > 0) {
                                        console.log("x" + kindOf + ":\t " + sumOfSymbolWinsFeature[symbolIndex][kindOf] + " = " + sumOfSymbolWinsFeature[symbolIndex][kindOf] /
                                            (sumOfSpins *
                                                this.State.bet.current *
                                                this.State.bet.lines.current) + "% of total rtp  = " + sumOfSymbolWinsFeature[symbolIndex][kindOf] /
                                            sumOfWinsFeature + "% of free spins");
                                    }
                                }
                                console.log('\n');
                                symbolIndex++;
                            }
                        }
                        return [2 /*return*/, this.currentStateWithRgs(winDescription.totalWin > 0, winDescription.totalWin, this.State.bet.current * this.State.bet.lines.current)];
                }
            });
        });
    };
    EightGoldenLions.prototype.Win = function (ammount) {
        ammount;
        throw new Error('Method not implemented.');
    };
    return EightGoldenLions;
}(leftToRightSlot_1.default));
exports.default = EightGoldenLions;
