"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentStateWithRgs = exports.getInitStateFromConfig = exports.countBonusSymbols = exports.getResults = exports.scatterWin = exports.createScreen = exports.countSymbols = void 0;
function countSymbols(screen, symbol) {
    var count = 0;
    var asb = 0;
    var lines = screen.length;
    var reels = screen[0].length;
    for (var i = 0; i < lines; i++) {
        for (var j = 0; j < reels; j++) {
            if (screen[i][j] === symbol) {
                count++;
                var asbIndex = lines * j + i;
                asb = asb | (1 << asbIndex);
            }
        }
    }
    var countAsb = {
        count: count,
        asb: asb,
    };
    return countAsb;
}
exports.countSymbols = countSymbols;
function createScreen(info, rng, isBonus, forcedPositions) {
    return __awaiter(this, void 0, void 0, function () {
        var screen, i, i, reelStop, _a, j;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    screen = [];
                    if (!isBonus) {
                        info.lastMainPositions = [];
                    }
                    for (i = 0; i < info.LinesNumber; i++) {
                        screen.push([]);
                    }
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < info.ReelsNumber)) return [3 /*break*/, 6];
                    if (!forcedPositions) return [3 /*break*/, 2];
                    _a = forcedPositions[i];
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, rng.getRandomInt({
                        min: 0,
                        max: (isBonus
                            ? info.ReelLengthsBonus[i]
                            : info.ReelLengths[i]) - 1,
                    })];
                case 3:
                    _a = _b.sent();
                    _b.label = 4;
                case 4:
                    reelStop = _a;
                    //const reelStop: number = forcedPositions ? forcedPositions[i] : Math.floor(Math.random() * (isBonus ? info.ReelLengthsBonus[i] : info.ReelLengths[i]))
                    for (j = 0; j < info.LinesNumber; j++) {
                        if (isBonus) {
                            screen[j].push(info.ReelsBonus[(reelStop + j) % info.ReelLengthsBonus[i]][i]);
                        }
                        else {
                            screen[j].push(info.Reels[(reelStop + j) % info.ReelLengths[i]][i]);
                        }
                    }
                    if (!isBonus) {
                        info.lastMainPositions.push(reelStop);
                    }
                    _b.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, screen];
            }
        });
    });
}
exports.createScreen = createScreen;
function scatterWin(info, screen, scatterSymbol, bet, scatterIndex, noWinSymbolsThreshold) {
    var count = countSymbols(screen, scatterSymbol);
    var scatterCount = count.count;
    var asb = count.asb;
    // console.log(bet)
    var winData = {
        affectedSymbolsBits: info.ScatterPaytable[scatterIndex][scatterCount] > 0 ||
            (noWinSymbolsThreshold > 0 && scatterCount >= noWinSymbolsThreshold)
            ? asb
            : 0,
        symbolCount: scatterCount,
        symbol: scatterSymbol,
        totalWin: info.ScatterPaytable[scatterIndex][scatterCount] *
            bet.lines.current *
            bet.current,
    };
    return winData;
}
exports.scatterWin = scatterWin;
function getResults(screen, linesNumber, paylines) {
    var lineLength = paylines[0].length;
    var results = [];
    for (var i = 0; i < linesNumber; i++) {
        results[i] = [];
        for (var j = 0; j < lineLength; j++) {
            var lineIndex = paylines[i][j];
            results[i].push(screen[lineIndex][j]);
        }
    }
    return results;
}
exports.getResults = getResults;
function countBonusSymbols(info, screen, bonusSymbol, bonusIndex) {
    var count = countSymbols(screen, bonusSymbol);
    var bonusCount = count.count;
    var asb = count.asb;
    var winData = {
        affectedSymbolsBits: info.BonusPaytable[bonusIndex][bonusCount] > 0 ? asb : 0,
        symbolCount: bonusCount,
        symbol: bonusSymbol,
        totalWin: info.BonusPaytable[bonusIndex][bonusCount],
    };
    return winData;
}
exports.countBonusSymbols = countBonusSymbols;
function getInitStateFromConfig(gameConfig, INIT_STATE) {
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
    }
    else {
        return INIT_STATE;
    }
}
exports.getInitStateFromConfig = getInitStateFromConfig;
function getCurrentStateWithRgs(state, gameConfig, isWin, win, wager) {
    if (isWin === void 0) { isWin = false; }
    if (win === void 0) { win = 0; }
    if (wager === void 0) { wager = 0; }
    var rgsCurrentState = {
        state: state,
        rgs: {
            isWin: isWin,
            win: win,
            wager: wager,
        },
        gameConfig: gameConfig,
    };
    return rgsCurrentState;
}
exports.getCurrentStateWithRgs = getCurrentStateWithRgs;
// export const randomInt = rndInt
