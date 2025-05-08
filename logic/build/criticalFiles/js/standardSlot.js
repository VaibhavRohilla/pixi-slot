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
exports.StandardSlot = void 0;
var base_game_1 = require("../framework/base-game");
var Helpers = __importStar(require("../framework/helpers"));
var customError_1 = __importDefault(require("../framework/customError"));
var StandardSlot = /** @class */ (function (_super) {
    __extends(StandardSlot, _super);
    function StandardSlot(info, gameConfig, rng) {
        var _this = _super.call(this, info, gameConfig, rng) || this;
        _this.isForcingPositions = false;
        _this.forcedPositions = [0, 0, 0, 0, 0];
        _this.info = info;
        return _this;
    }
    StandardSlot.prototype.createScreen = function (forcedPositions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Helpers.createScreen(this.info, this.getRng, false, forcedPositions)];
            });
        });
    };
    StandardSlot.prototype.createScreenWithInfo = function (info, forcedPositions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Helpers.createScreen(this.info, this.getRng, false, forcedPositions)];
            });
        });
    };
    StandardSlot.prototype.createScreenBonus = function (forcedPositions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Helpers.createScreen(this.info, this.getRng, true, forcedPositions)];
            });
        });
    };
    StandardSlot.prototype.createScreenBonusWithInfo = function (info, forcedPositions) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, Helpers.createScreen(this.info, this.getRng, true, forcedPositions)];
            });
        });
    };
    StandardSlot.prototype.action = function (gameInput) {
        return __awaiter(this, void 0, void 0, function () {
            var actionType, actionInput, playResponse, _a, oldVal;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        actionType = gameInput.actionType;
                        actionInput = gameInput.actionInput;
                        _a = actionType;
                        switch (_a) {
                            case 'play': return [3 /*break*/, 1];
                            case 'playbonus': return [3 /*break*/, 3];
                            case 'lines': return [3 /*break*/, 7];
                            case 'bet': return [3 /*break*/, 8];
                            case 'getState': return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 10];
                    case 1:
                        oldVal = this.isForcingPositions;
                        this.cheatTool && this.cheatToolForce(gameInput);
                        return [4 /*yield*/, this.play()];
                    case 2:
                        playResponse = _b.sent();
                        this.isForcingPositions = oldVal;
                        return [3 /*break*/, 11];
                    case 3:
                        if (!this.cheatTool) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.playBonus()];
                    case 4:
                        playResponse = _b.sent();
                        return [3 /*break*/, 6];
                    case 5: throw new customError_1.default("Action type '" + actionType + "' not supported", 400);
                    case 6: return [3 /*break*/, 11];
                    case 7:
                        this.lines(actionInput.direction);
                        return [2 /*return*/, this.currentStateWithRgs()];
                    case 8:
                        this.bet(actionInput.direction);
                        return [2 /*return*/, this.currentStateWithRgs()];
                    case 9:
                        playResponse = this.currentStateWithRgs();
                        return [3 /*break*/, 11];
                    case 10: throw new customError_1.default("Action type '" + actionType + "' not supported", 400);
                    case 11: return [2 /*return*/, playResponse];
                }
            });
        });
    };
    StandardSlot.prototype.currentStateWithRgs = function (isWin, win, wager) {
        if (isWin === void 0) { isWin = false; }
        if (win === void 0) { win = 0; }
        if (wager === void 0) { wager = 0; }
        return Helpers.getCurrentStateWithRgs(this.GameState, this.getGameConfig, isWin, win, wager);
    };
    StandardSlot.prototype.modifyPayoutWithByAnyX = function (screen, lineWinsPrimaryWin, anySymbolIndex, dummySymbolIndex) {
        var anySymbolsIndexes = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            anySymbolsIndexes[_i - 4] = arguments[_i];
        }
        // create tmp screen with only anyX symbols
        var screen2 = JSON.parse(JSON.stringify(screen));
        for (var reelIndex = 0; reelIndex < this.info.ReelsNumber; reelIndex++) {
            for (var rowIndex = 0; rowIndex < this.info.LinesNumber; rowIndex++) {
                var sym = screen2[rowIndex][reelIndex];
                if (anySymbolsIndexes.includes(sym)) {
                    screen2[rowIndex][reelIndex] = anySymbolIndex;
                }
                else {
                    screen2[rowIndex][reelIndex] = dummySymbolIndex;
                }
            }
        }
        //console.log("screen2", screen, screen2, anySymbolsIndexes, anySymbolIndex, dummySymbolIndex);
        // add any syms in winDescription (reject already existing lines)
        var anySymLineWins = this.calculatePayout(screen2, this.State.bet).lineWins;
        anySymLineWins.forEach(function (anySymLineWin) {
            var hasLineAlready = false;
            for (var i = 0; i < lineWinsPrimaryWin.length; i++) {
                var lineWinPrimary = lineWinsPrimaryWin[i];
                if (lineWinPrimary.lineIndex == anySymLineWin.lineIndex) {
                    // replace
                    if (anySymLineWin.totalWin > lineWinPrimary.totalWin) {
                        lineWinsPrimaryWin[i] = JSON.parse(JSON.stringify(anySymLineWin));
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
        var retTotalWin = 0;
        for (var _a = 0, lineWinsPrimaryWin_1 = lineWinsPrimaryWin; _a < lineWinsPrimaryWin_1.length; _a++) {
            var lineWinPrimary = lineWinsPrimaryWin_1[_a];
            retTotalWin += lineWinPrimary.totalWin;
        }
        var winDescription = {
            totalWin: retTotalWin,
            lineWins: lineWinsPrimaryWin,
        };
        return winDescription;
    };
    StandardSlot.prototype.resetForcedPositions = function (currentSpin) {
        if (currentSpin === void 0) { currentSpin = 1; }
        var spn = currentSpin - 1;
        for (var reelIndex = this.info.ReelsNumber - 1; reelIndex >= 0; reelIndex--) {
            this.forcedPositions[reelIndex] =
                spn % this.info.ReelLengths[reelIndex];
            spn = Math.floor(spn / this.info.ReelLengths[reelIndex]);
        }
    };
    StandardSlot.prototype.getForcedPositionsCopy = function () {
        return JSON.parse(JSON.stringify(this.forcedPositions));
    };
    StandardSlot.prototype.getNumberOfPossibleCombinations = function () {
        var sumOfSpins = 1;
        for (var reelIndex = this.info.ReelsNumber - 1; reelIndex >= 0; reelIndex--) {
            sumOfSpins *= this.info.ReelLengths[reelIndex];
        }
        return sumOfSpins;
    };
    StandardSlot.prototype.cheatToolForce = function (gameInput) {
        if (this.cheatTool &&
            gameInput.actionInput &&
            gameInput.actionInput.hasOwnProperty('force') &&
            Array.isArray(gameInput.actionInput.force)) {
            this.isForcingPositions = true;
            for (var i = 0; i <
                Math.min(gameInput.actionInput.force.length, this.forcedPositions.length); i++) {
                this.forcedPositions[i] = gameInput.actionInput.force[i];
            }
        }
    };
    StandardSlot.prototype.updateGameSpecificStats = function (logs) {
        logs;
        // hook method
    };
    return StandardSlot;
}(base_game_1.Game));
exports.StandardSlot = StandardSlot;
