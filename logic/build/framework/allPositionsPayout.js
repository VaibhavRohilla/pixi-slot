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
var Helpers = __importStar(require("./helpers"));
var AllPositionsPayout = /** @class */ (function () {
    function AllPositionsPayout(info) {
        var _this = this;
        this.getPayoutAllPositions = function (screen, bet) {
            var results = Helpers.getResults(screen, bet.lines.current, _this.info.Paylines);
            var totalWin = 0;
            var lineWins = [];
            var lineIndex = 0;
            for (var _i = 0, results_1 = results; _i < results_1.length; _i++) {
                var line = results_1[_i];
                var winData = _this.getConsecutiveElements(line, lineIndex);
                winData.totalWin =
                    _this.info.Paytable[winData.symbol][winData.symbolCount] *
                        bet.current;
                if (winData.totalWin > 0) {
                    totalWin += winData.totalWin;
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
        // Get the number of Consecutive Symbols in each line
        this.getConsecutiveElements = function (line, lineIndex) {
            var asbIndex = _this.info.Paylines[lineIndex][0];
            var winData = {
                symbol: line[0],
                symbolCount: 1,
                affectedSymbolsBits: 0 | (1 << asbIndex),
                totalWin: 0,
            };
            for (var i = 1; i < line.length; i++) {
                if (line[i] === line[i - 1]) {
                    winData.symbolCount += 1;
                    asbIndex =
                        _this.info.LinesNumber * i +
                            _this.info.Paylines[lineIndex][i];
                    winData.affectedSymbolsBits =
                        winData.affectedSymbolsBits | (1 << asbIndex);
                }
                else {
                    if (winData.symbolCount >= 3) {
                        return winData;
                    }
                    winData.symbol = line[i];
                    winData.symbolCount = 1;
                    asbIndex =
                        _this.info.LinesNumber * i +
                            _this.info.Paylines[lineIndex][i];
                    winData.affectedSymbolsBits = 0 | (1 << asbIndex);
                }
            }
            return winData;
        };
        this.info = info;
    }
    return AllPositionsPayout;
}());
exports.default = AllPositionsPayout;
