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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var standardSlot_1 = require("../criticalFiles/standardSlot");
var leftToRightPayout_1 = __importDefault(require("../criticalFiles/leftToRightPayout"));
var Helpers = __importStar(require("../framework/helpers"));
var LeftToRightSlot = /** @class */ (function (_super) {
    __extends(LeftToRightSlot, _super);
    function LeftToRightSlot(info, gameConfig, rng) {
        var _this = _super.call(this, info, gameConfig, rng) || this;
        _this.info = info;
        return _this;
    }
    LeftToRightSlot.prototype.scatterWin = function (screen, scatterSymbol, bet, scatterIndex, noWinSymbolsThreshold) {
        if (noWinSymbolsThreshold === void 0) { noWinSymbolsThreshold = 0; }
        return Helpers.scatterWin(this.info, screen, scatterSymbol, bet, scatterIndex, noWinSymbolsThreshold);
    };
    LeftToRightSlot.prototype.countBonusSymbols = function (screen, specialSymbol, bonusIndex) {
        return Helpers.countBonusSymbols(this.info, screen, specialSymbol, bonusIndex);
    };
    LeftToRightSlot.prototype.calculatePayout = function (screen, bet, wild) {
        var evaluate = new leftToRightPayout_1.default(this.info);
        return evaluate.getPayoutLeftToRight(screen, bet, wild);
    };
    return LeftToRightSlot;
}(standardSlot_1.StandardSlot));
exports.default = LeftToRightSlot;
