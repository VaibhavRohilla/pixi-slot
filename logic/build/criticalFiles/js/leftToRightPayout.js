"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
var Helpers = __importStar(require("../framework/helpers"));
var LeftToRightPayout = /** @class */ (function () {
    function LeftToRightPayout(info) {
        this.info = info;
    }
    // TEST CODE
    LeftToRightPayout.prototype.testGetConsecutiveElements = function (line, lineIndex, wildSymbol) {
        return this.getConsecutiveElements(line, lineIndex, wildSymbol);
    };
    LeftToRightPayout.prototype.testGetConsecutiveElementsWild = function (line, lineIndex) {
        return this.getConsecutiveElementsWild(line, lineIndex);
    };
    // END TEST
    LeftToRightPayout.prototype.getPayoutLeftToRight = function (screen, bet, wildSymbol) {
        var totalWin = 0;
        var lineWins = [];
        var results = Helpers.getResults(screen, bet.lines.current, this.info.Paylines);
        var lineIndex = 0;
        var winData;
        for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
            var line = results_1[_i];
            if (line[0] === wildSymbol) {
                winData = this.getConsecutiveElementsWild(line, lineIndex);
            }
            else {
                winData = this.getConsecutiveElements(line, lineIndex, wildSymbol);
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
        var winDescription = {
            totalWin: totalWin,
            lineWins: lineWins,
        };
        return winDescription;
    };
    // 4 Donny <3
    LeftToRightPayout.prototype.getPayoutLeftToRightBonus = function (screen, bet, wildSymbol) {
        var totalWin = 0;
        var lineWins = [];
        // paylines bonus???
        var results = Helpers.getResults(screen, bet.lines.current, this.info.PaylinesBonus);
        var lineIndex = 0;
        var winData;
        for (var _i = 0, results_2 = results; _i < results_2.length; _i++) {
            var line = results_2[_i];
            if (line[0] === wildSymbol) {
                winData = this.getConsecutiveElementsWild(line, lineIndex);
            }
            else {
                winData = this.getConsecutiveElements(line, lineIndex, wildSymbol);
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
        var winDescription = {
            totalWin: totalWin,
            lineWins: lineWins,
        };
        return winDescription;
    };
    LeftToRightPayout.prototype.getConsecutiveElements = function (line, lineIndex, wildSymbol) {
        var asbIndex = this.info.Paylines[lineIndex][0];
        var winData = {
            symbol: line[0],
            symbolCount: 1,
            affectedSymbolsBits: 0 | (1 << asbIndex),
            totalWin: 0,
        };
        for (var i = 1; i < line.length; i++) {
            if (line[i] === line[0] || line[i] === wildSymbol) {
                winData.symbolCount++;
                asbIndex =
                    this.info.LinesNumber * i +
                        this.info.Paylines[lineIndex][i];
                winData.affectedSymbolsBits =
                    winData.affectedSymbolsBits | (1 << asbIndex);
            }
            else {
                break;
            }
        }
        return winData;
    };
    LeftToRightPayout.prototype.getConsecutiveElementsWild = function (line, lineIndex) {
        var asbIndex = this.info.Paylines[lineIndex][0];
        var asbWild = 0 | (1 << asbIndex);
        var asbSymbol = 0 | (1 << asbIndex);
        var wildSymbol = line[0];
        var counterSymbol = 1;
        var counterWild = 1;
        var symbol = line.find(function (s) { return s !== wildSymbol; });
        if (symbol !== undefined) {
            for (var j = 1; j < this.info.ReelsNumber; j++) {
                if (line[j] === wildSymbol) {
                    counterWild++;
                    asbIndex =
                        this.info.LinesNumber * j +
                            this.info.Paylines[lineIndex][j];
                    asbWild = asbWild | (1 << asbIndex);
                }
                else {
                    break;
                }
            }
            for (var j = 1; j < this.info.ReelsNumber; j++) {
                if (line[j] === symbol || line[j] === wildSymbol) {
                    counterSymbol++;
                    asbIndex =
                        this.info.LinesNumber * j +
                            this.info.Paylines[lineIndex][j];
                    asbSymbol = asbSymbol | (1 << asbIndex);
                }
                else {
                    break;
                }
            }
        }
        else {
            symbol = wildSymbol;
            counterWild = this.info.ReelsNumber;
            for (var j = 1; j < this.info.ReelsNumber; j++) {
                asbIndex =
                    this.info.LinesNumber * j +
                        this.info.Paylines[lineIndex][j];
                asbWild = asbWild | (1 << asbIndex);
            }
        }
        var payoutSymbol = this.info.Paytable[symbol][counterSymbol];
        var payoutWild = this.info.Paytable[wildSymbol][counterWild];
        var winData = {
            symbol: payoutSymbol > payoutWild ? symbol : wildSymbol,
            symbolCount: payoutSymbol > payoutWild ? counterSymbol : counterWild,
            affectedSymbolsBits: payoutSymbol > payoutWild ? asbSymbol : asbWild,
            totalWin: 0,
        };
        return winData;
    };
    return LeftToRightPayout;
}());
exports.default = LeftToRightPayout;
