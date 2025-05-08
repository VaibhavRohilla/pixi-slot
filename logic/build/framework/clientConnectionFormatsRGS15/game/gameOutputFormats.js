"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGameOutputObjectMsg = void 0;
function createGameOutputObjectMsg(gameState, account, pathCommandName, shouldRemoveWinDescription, meta) {
    if (shouldRemoveWinDescription === void 0) { shouldRemoveWinDescription = false; }
    if (meta === void 0) { meta = {}; }
    var initialOutput = { game: gameState, account: account, resolved: true };
    if (shouldRemoveWinDescription) {
        if (initialOutput.game.hasOwnProperty('win')) {
            //@ts-ignore
            initialOutput.game.win = 0;
        }
        if (initialOutput.game.hasOwnProperty('winDescription')) {
            //@ts-ignore
            delete initialOutput.game.winDescription;
        }
    }
    var returnMsg = Object.assign({ input: initialOutput }, { meta: meta }, { path: pathCommandName });
    return returnMsg;
}
exports.createGameOutputObjectMsg = createGameOutputObjectMsg;
