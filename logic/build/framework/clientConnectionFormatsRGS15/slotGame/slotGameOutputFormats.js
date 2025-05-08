"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalBet = exports.getTotalWin = exports.createSlotGameOutputObject = void 0;
var gameOutputFormats_1 = require("../game/gameOutputFormats");
var slotGameCommands_1 = require("./slotGameCommands");
function createSlotGameOutputObject(gameState, account, pathCommandName, shouldRemoveWinDescription, meta) {
    if (shouldRemoveWinDescription === void 0) { shouldRemoveWinDescription = false; }
    if (meta === void 0) { meta = {}; }
    var returnMsg = gameOutputFormats_1.createGameOutputObjectMsg(gameState, account, pathCommandName == slotGameCommands_1.ePathSlotCommands.init
        ? pathCommandName
        : slotGameCommands_1.ePathSlotCommands.action, shouldRemoveWinDescription, meta);
    return returnMsg;
}
exports.createSlotGameOutputObject = createSlotGameOutputObject;
function getTotalWin(gameState) {
    return gameState.hasOwnProperty('winDescription')
        ? gameState.winDescription.totalWin
        : 0;
}
exports.getTotalWin = getTotalWin;
function getTotalBet(gameState) {
    return gameState.bet.current * gameState.bet.lines.current;
}
exports.getTotalBet = getTotalBet;
